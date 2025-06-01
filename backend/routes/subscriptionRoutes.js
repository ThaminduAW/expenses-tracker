const express = require('express');
const {
    getSubscriptions,
    addSubscription,
    updateSubscription,
    deleteSubscription,
    getBreakdown,
    getReminders
} = require('../controllers/subscriptionController');
const router = express.Router();

// Route to get all subscriptions
router.get('/', getSubscriptions);

// Route to add a new subscription
router.post('/', addSubscription);

// Update a subscription
router.put('/:id', updateSubscription);

// Delete a subscription
router.delete('/:id', deleteSubscription);

// Get breakdown
router.get('/breakdown', getBreakdown);

// Get reminders
router.get('/reminders', getReminders);

module.exports = router;
