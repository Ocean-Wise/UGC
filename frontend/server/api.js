const express = require('express');
const router = express.Router();

const api = require('./queries');


router.get('/authorize', api.instaAuth);
router.get('/instaAuth', api.instaHandled);
router.get('/twitter', api.getTwitter);

module.exports = router;
