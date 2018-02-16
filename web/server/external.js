const express = require('express');
const router = express.Router();

const api = require('./queries');

router.post('/getApproved', api.getApprovedPosts);

module.exports = router;
