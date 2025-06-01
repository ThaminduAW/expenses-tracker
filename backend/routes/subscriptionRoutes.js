const express = require('express');
const { getSubscriptions, addSubscription } = require('../controllers/subscriptionController');
const router = express.Router();

// Route to get all subscriptions
router.get('/', getSubscriptions);

// Route to add a new subscription
router.post('/', addSubscription);

module.exports = router;
