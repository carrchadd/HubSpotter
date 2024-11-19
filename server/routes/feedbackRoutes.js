const express = require('express');
const router = express.Router();
const controller = require('../controllers/feedbackController');

// send feedback to databse
router.post('/send', controller.sendFeedback);

module.exports = router;