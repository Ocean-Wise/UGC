var promise = require('bluebird');

function turnOnLogging() {
  var log = adal.Logging;
  log.setLoggingOptions(
    {
      level: log.LOGGING_LEVEL.VERBOSE,
      log : function(level, message, error) {
        console.log(message);
        if (error) {
          console.log(error);
        }
      }
    }
  );
}

var options = {
  // Initialization options for database
  promiseLib: promise
};

const cn = {
  host: 'db', // Container name from docker-compose.yml
  port: 5432, // Database port
  database: 'ugc', // Name of the database
  user: 'root', // Database username
  password: 'd8h*_z6a#SJ=cFfw' // Database password
}

var pgp = require('pg-promise')(options);
var db = pgp(cn);
const path = require('path');

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

function handleGetEmbed(req, res, next) {
  res.sendFile(path.join(__dirname, 'public', 'oceanWiseUGC.min.js'), function (err) {
    if (err) {
      next(err);
    } else {
      console.log('Sent embeddable');
    }
  });
}

module.exports = {
  getApproved: handleGetApproved,
  getEmbed: handleGetEmbed,
};
