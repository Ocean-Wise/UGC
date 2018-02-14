const axios = require('axios');

// Gets a list of posts with the provided tag
function handleGetTag(req, res) {
  axios.get('https://www.instagram.com/explore/tags/' + req.body.tag + '/?__a=1') // eslint-disable-line
    .then((result) => {
      const data = result.data.graphql.hashtag.edge_hashtag_to_media.edges; // or edge_hashtag_to_top_posts
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
      out.post_type = 'instagram';
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


// Runs the twitter.py script and gets the output
function handleGetTwitter(req, res) {
  const options = {
    mode: 'json',
    args: [req.body.tag], // Pass the tag given through the request as an argument for the Python script
  };

  try {
    PythonShell.run('server/twitter.py', options, function (err, data) { // eslint-disable-line
      const out = [];
      for (let i = 0; i < data[0].statuses.length; i += 1) {
        const post = {};
        const user = {};
        post.post_type = 'twitter';
        user.name = data[0].statuses[i].user.name;
        user.username = data[0].statuses[i].user.screen_name;
        user.profile_img = data[0].statuses[i].user.profile_image_url;
        post.user = user;
        post.text = data[0].statuses[i].text;
        out.push(post);
      }
      res.status(200)
      .json({
        status: 'success',
        data: out, // Return the result as JSON
        message: 'Twitter data pulled successfully',
      });
    });
  } catch (err) {
    res.status(500);
  }
}

// PostgreSQL
const promise = require('bluebird');
const options = {
  // Initialization option for database
  promiseLib: promise,
};

const cn = {
  host: 'db', // Container name from docker-compose.pml
  port: 5432,
  database: 'ugc',
  user: 'root',
  password: 'd8h*_z6a#SJ=cFfw',
};

const pgp = require('pg-promise')(options);
const db = pgp(cn);

// Gets the three most recent pledges
function handleGetTrackedTags(req, res, next) {
  try {
    db.any("SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname='public'")
      .then((dbData) => {
        res.status(200)
          .json({
            status: 'success',
            data: dbData,
            message: 'Retrieved list of tracked tags',
          });
      })
      .catch((err) => { // eslint-disable-line arrow-body-style
        return next(err);
      });
  } catch (err) {
    res.status(500).send('Error getting tracked tags from database');
  }
}

function handleGetApproved(req, res, next) {
  try {
    db.any('SELECT * FROM ' + req.body.tag + ' ORDER BY ID DESC') // eslint-disable-line
      .then((dbData) => {
        res.status(200)
          .json({
            status: 'success',
            data: dbData,
            message: 'Retrieved all approved posts for #' + req.body.tag, // eslint-disable-line
          });
      })
      .catch((err) => { // eslint-disable-line
        return next(err);
      });
  } catch (err) {
    res.status(500).send('Error getting approved posts for #' + req.body.tag); // eslint-disable-line
  }
}

function handleApprovePost(req, res, next) {
  try {
    db.none('INSERT into ' + req.body.tag + ' (PostType, TextContent, ContentURL, Author, Profile, Username)' + // eslint-disable-line
            'values(${PostType}, ${TextContent}, ${ContentURL}, ${Author}, ${Profile}, ${Username})', // eslint-disable-line
            req.body)
      .then(() => {
        res.status(200)
          .json({
            status: 'success',
            message: 'Post approved',
          });
      })
      .catch((err) => { // eslint-disable-line
        return next(err);
        // res.status(500).send(req.body);
      });
  } catch (err) {
    res.status(500).send('Error approving post');
  }
}

function handleRemovePost(req, res, next) {
  try {
    db.none('DELETE FROM ' + req.body.tag + ' WHERE ID=${ID}', // eslint-disable-line
            req.body)
      .then(() => {
        res.status(200)
          .json({
            status: 'success',
            message: 'Post removed',
          });
      })
      .catch((err) => { // eslint-disable-line
        return next(err);
      });
  } catch (err) {
    res.status(500).send('Error removing post');
  }
}

function handleNewTracker(req, res, next) {
  try {
    db.none('CREATE TABLE ' + req.body.tag + '(ID SERIAL PRIMARY KEY, PostType VARCHAR, TextContent VARCHAR, ContentURL VARCHAR, Author VARCHAR, Profile VARCHAR, Username VARCHAR)') // eslint-disable-line
      .then(() => {
        res.status(200)
          .json({
            status: 'success',
            message: 'Added new table to track #' + req.body.tag, // eslint-disable-line
          });
      })
      .catch((err) => { // eslint-disable-line
        return next(err);
      });
  } catch (err) {
    res.status(500).send('Error adding new tracker');
  }
}

function handleRemoveTracker(req, res) {
  try {
    db.none('DROP TABLE ' + req.body.tag) // eslint-disable-line
      .then(() => {
        res.status(200)
          .json({
            status: 'success',
            message: 'Removed tracker for #' + req.body.tag, // eslint-disable-line
          });
      });
  } catch (err) {
    res.status(500).send('Error removing tracker');
  }
}

module.exports = {
  getTag: handleGetTag,
  getTwitter: handleGetTwitter,
  getTrackedTags: handleGetTrackedTags,
  getApproved: handleGetApproved,
  approvePost: handleApprovePost,
  removePost: handleRemovePost,
  newTracker: handleNewTracker,
  removeTracker: handleRemoveTracker,
};
