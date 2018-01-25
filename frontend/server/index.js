/* eslint consistent-return:0 */
const express = require('express');
const logger = require('./logger');

const argv = require('./argv');
const port = require('./port');
const setup = require('./middlewares/frontendMiddleware');
const isDev = process.env.NODE_ENV !== 'production';
const ngrok = (isDev && process.env.ENABLE_TUNNEL) || argv.tunnel ? require('ngrok') : false;
const resolve = require('path').resolve;
const bodyParser = require('body-parser');
const app = express();
const theApi = require('./api');
// Configuration for API basic authentication
const auth = require('http-auth');
const internal = auth.basic({
  realm: "all",
}, (username, password, callback) => {
  callback(username === "foo" && password === "bar"); // Set the username and password here
}
);

app.use(auth.connect(internal));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api', theApi);
// app.all('/api/*', function(req, res, next) {
//   // CORS headers
//   res.header('Access-Control-Allow-Origin', 'localhost'); // Restrict to specified domains
//   res.header('Access-Control-Allow-Methods', 'GET,POST');
//   next();
// });

// In production we need to pass these values in instead of relying on webpack
setup(app, {
  outputPath: resolve(process.cwd(), 'build'),
  publicPath: '/',
});

// get the intended host and port number, use localhost and port 3000 if not provided
const customHost = argv.host || process.env.HOST;
const host = customHost || null; // Let http.Server use its default IPv6/4 host
const prettyHost = customHost || 'localhost';

// Start your app.
app.listen(port, host, (err) => {
  if (err) {
    return logger.error(err.message);
  }

  // Connect to ngrok in dev mode
  if (ngrok) {
    ngrok.connect(port, (innerErr, url) => {
      if (innerErr) {
        return logger.error(innerErr);
      }

      logger.appStarted(port, prettyHost, url);
    });
  } else {
    logger.appStarted(port, prettyHost);
  }
});
