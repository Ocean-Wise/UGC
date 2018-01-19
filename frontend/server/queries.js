// PostgreSQL
// const promise = require('bluebird');
// const options = {
//   // Initialization option for database
//   promiseLib: promise,
// };

// Python Twitter
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
  // getPledges: handleGetLatestPledges,
  // addPledge: handleAddPledge,
  getTwitter: handleGetTwitter,
};
