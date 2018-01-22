// PostgreSQL
// const promise = require('bluebird');
// const options = {
//   // Initialization option for database
//   promiseLib: promise,
// };

// Import the instagram library
const ig = require('instagram-node').instagram();

// Config Instagram client settings
ig.use({
  client_id: 'c60bd6880ab04a36994ce043decf1525',
  client_secret: 'b6747394d8774f5b91cbf3a33345b333',
});

// Set the Instagram OAuth redirectUri and initialize the accessToken store
const redirectUri = 'http://172.19.1.14:3000/api/instaAuth';
let accessToken;

// Handle the redirection to Instagram's login
function handleInstaAuth(req, res) {
  // Set the scope of our application to be able to access likes and public content
  res.redirect(ig.get_authorization_url(redirectUri, { scope: ['public_content', 'likes'] }));
}

// Handle the authorization of the user who just logged in and store the retreived access token into our store
function handleInstaHandled(req, res) {
  ig.authorize_user(req.query.code, redirectUri, (err, result) => {
    if (err) res.send(err);
    accessToken = result.access_token;
    res.redirect('/');
  });
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
  instaAuth: handleInstaAuth,
  instaHandled: handleInstaHandled,
  getTwitter: handleGetTwitter,
};
