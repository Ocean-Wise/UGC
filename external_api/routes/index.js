var express = require('express');
var router = express.Router();

var api = require('../queries');

// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

router.post('/getApproved', api.getApproved);
router.get('/embeddable', api.getEmbed);

module.exports = router;
