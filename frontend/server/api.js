const express = require('express');
const router = express.Router();

const api = require('./queries');

// router.get('/pledges', api.getPledges);
// router.post('/pledges', api.addPledge);
router.get('/twitter', api.getTwitter);

module.exports = router;
