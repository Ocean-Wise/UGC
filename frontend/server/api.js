const express = require('express');
const router = express.Router();

const api = require('./queries');

router.post('/getInsta', api.getTag); // Get all Instagram posts with hashtag
router.post('/getTwitter', api.getTwitter); // Get all Twitter posts with hashtag
router.get('/getTrackedTags', api.getTrackedTags); // Get all tracked hashtags
router.post('/approvedPosts', api.getApproved); // Get all approved posts with hashtag
router.post('/approve', api.approvePost); // Approve a post
router.post('/disapprove', api.removePost); // Un-approve a post
router.post('/tracker', api.newTracker); // Track a new hashtag
router.post('/removeTracker', api.removeTracker); // Remove a tracker

module.exports = router;
