const express = require('express');
const {
    getRecurringPayments,
    addRecurringPayment,
    updateRecurringPayment,
    deleteRecurringPayment,
    getPaymentSchedule,
    getInstallmentReminders,
    markInstallmentPaid
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// Get all recurring payments
router.get('/', protect, getRecurringPayments);

// Add a new recurring payment
router.post('/', protect, addRecurringPayment);

// Update a recurring payment
router.put('/:id', protect, updateRecurringPayment);

// Delete a recurring payment
router.delete('/:id', protect, deleteRecurringPayment);

// Get payment schedule and history for a recurring payment
router.get('/:id/schedule', protect, getPaymentSchedule);

// Mark an installment as paid
router.post('/:id/installments/:installmentId/pay', protect, markInstallmentPaid);

// Get reminders for upcoming installments
router.get('/reminders', protect, getInstallmentReminders);

module.exports = router;
