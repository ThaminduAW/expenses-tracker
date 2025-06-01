const express = require('express');
const {
    getSubscriptions,
    addSubscription,
    updateSubscription,
    deleteSubscription,
    getBreakdown,
    getReminders
} = require('../controllers/subscriptionController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// Route to get all subscriptions
router.get('/', protect, getSubscriptions);

// Route to add a new subscription
router.post('/', protect, addSubscription);

// Update a subscription
router.put('/:id', protect, updateSubscription);

// Delete a subscription
router.delete('/:id', protect, deleteSubscription);

// Get breakdown
router.get('/breakdown', protect, getBreakdown);

// Get reminders
router.get('/reminders', protect, getReminders);

module.exports = router;
