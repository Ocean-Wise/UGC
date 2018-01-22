// PostgreSQL
// const promise = require('bluebird');
// const options = {
//   // Initialization option for database
//   promiseLib: promise,
// };

const axios = require('axios');
const moment = require('moment');

// Gets a list of posts with the provided tag
function handleGetTag(req, res) {
  axios.get('https://www.instagram.com/explore/tags/' + req.tag + '/?__a=1') // eslint-disable-line
    .then((result) => {
      const data = result.data.graphql.hashtag.edge_hashtag_to_top_posts.edges; // or edge_hashtag_to_media
      const insta = []; // Initialize the array to return
      for (let i = 0; i < data.length; i += 1) {
        let item = {}; // eslint-disable-line
        item.id = data[i].node.shortcode; // The shortcode of the post used to grab the full post info
        handleGetPost(item) // Get the post information in JSON
          .then((postData) => {
            insta.push(postData); // Add the new data to the output array
            if (i === data.length - 1) { // We have reached the last item, so return data with 200 status code
              res.status(200)
              .json({
                status: 'success',
                data: insta,
              });
            }
          })
          .catch(() => { // An error occured
            res.status(500)
            .json({
              status: 'Instagram data skimming failed',
            });
          });
      }
    })
    .catch(() => { // An error occured
      res.status(500);
    });
}

// Asynchronous function to get post data for a provided Instagram shortcode
async function handleGetPost(item) {
  const updatedItem = (

    await axios.get('https://www.instagram.com/p/' + item.id + '/?__a=1') // eslint-disable-line
    .then((postRes) => {
      const postInfo = postRes.data.graphql.shortcode_media; // Shorten our path to the desired scope
      const out = {}; // Initialize output object
      out.user = postInfo.owner; // Pull the post owner's information
      out.text = postInfo.edge_media_to_caption.edges[0].node.text; // Pull the post caption
      if (postInfo.is_video) {
        // The post is a video, set type and get url
        out.content_type = 'video';
        out.content = postInfo.video_url;
      } else {
        // The post is an image, set type and get object holding image size options and urls
        out.content_type = 'image';
        out.content = postInfo.display_resources;
      }
      out.timestamp = moment(postInfo.taken_at_timestamp).add(48, 'years').unix(); // Get Instagram's weird timestamp, convert it to a date object, add 48 years (because weirdness), and convert to unix format
      return out; // Return output and set to updatedItem
    })
    .catch(() => { // eslint-disable-line
      return null;
    })

  );

  return updatedItem;
}

// Import library to run Python scripts on the server
const PythonShell = require('python-shell');

// const cn = {
//   host: 'db', // Container name from docker-compose.pml
//   port: 5432,
//   database: 'plasticwise',
//   user: 'root',
//   password: 'd8h*_z6a#SJ=cFfw',
// };

// const pgp = require('pg-promise')(options);
// const db = pgp(cn);

// Runs the twitter.py script and gets the output
function handleGetTwitter(req, res) {
  try {
    PythonShell.run('server/twitter.py', function (err, data) { // eslint-disable-line
      res.status(200)
      .json({
        status: 'success',
        data: data.toString(),
        message: 'Twitter data pulled successfully',
      });
    });
  } catch (err) {
    res.status(500);
  }
}

// Gets the three most recent pledges
// function handleGetLatestPledges(req, res, next) {
//   try {
//     db.any('SELECT pledge, name FROM pledges ORDER BY id DESC LIMIT 3')
//       .then((dbData) => {
//         res.status(200)
//           .json({
//             status: 'success',
//             data: dbData,
//             message: 'Retrieved three most recent pledges',
//           });
//       })
//       .catch((err) => { // eslint-disable-line arrow-body-style
//         return next(err);
//       });
//   } catch (err) {
//     res.status(500).send('Error getting pledges from database');
//   }
// }

// Add a new pledge to the DB
// function handleAddPledge(req, res, next) {
//   try {
//     db.none('INSERT into pledges (Pledge, Name, Email)' +
//             'values(${Pledge}, ${Name}, ${Email})', // eslint-disable-line
//             req.body)
//       .then(() => {
//         res.status(200)
//            .json({
//              status: 'success',
//              message: 'Added pledge',
//            });
//       })
//       .catch((err) => { // eslint-disable-line
//         return next(err);
//       });
//   } catch (err) {
//     res.status(500).send('Error adding pledge to database');
//   }
// }

module.exports = {
  // instaAuth: handleInstaAuth,
  // instaHandled: handleInstaHandled,
  getTag: handleGetTag,
  getTwitter: handleGetTwitter,
};
