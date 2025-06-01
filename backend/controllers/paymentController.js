const RecurringPayment = require('../models/RecurringPayment');
const User = require('../models/User');

// Get all recurring payments for a user
exports.getRecurringPayments = async (req, res) => {
    try {
        const payments = await RecurringPayment.find({ user: req.user._id });
        res.json(payments);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Add a new recurring payment
exports.addRecurringPayment = async (req, res) => {
    try {
        const { name, provider, totalAmount, installments } = req.body;
        const payment = new RecurringPayment({
            user: req.user._id,
            name,
            provider,
            totalAmount,
            installments
        });
        await payment.save();
        res.status(201).json(payment);
    } catch (err) {
        res.status(400).json({ error: 'Invalid data' });
    }
};

// Update a recurring payment
exports.updateRecurringPayment = async (req, res) => {
    try {
        const payment = await RecurringPayment.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            req.body,
            { new: true }
        );
        if (!payment) return res.status(404).json({ error: 'Not found' });
        res.json(payment);
    } catch (err) {
        res.status(400).json({ error: 'Invalid data' });
    }
};

// Delete a recurring payment
exports.deleteRecurringPayment = async (req, res) => {
    try {
        const payment = await RecurringPayment.findOneAndDelete({ _id: req.params.id, user: req.user._id });
        if (!payment) return res.status(404).json({ error: 'Not found' });
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Get payment schedule and history
exports.getPaymentSchedule = async (req, res) => {
    try {
        const payment = await RecurringPayment.findOne({ _id: req.params.id, user: req.user._id });
        if (!payment) return res.status(404).json({ error: 'Not found' });
        res.json({
            nextDue: payment.installments.find(i => i.status === 'pending'),
            amountRemaining: payment.installments.filter(i => i.status !== 'paid').reduce((sum, i) => sum + i.amount, 0),
            paymentHistory: payment.installments
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Mark an installment as paid
exports.markInstallmentPaid = async (req, res) => {
    try {
        const payment = await RecurringPayment.findOne({ _id: req.params.id, user: req.user._id });
        if (!payment) return res.status(404).json({ error: 'Not found' });
        const installment = payment.installments.id(req.params.installmentId);
        if (!installment) return res.status(404).json({ error: 'Installment not found' });
        installment.status = 'paid';
        installment.paidAt = new Date();
        await payment.save();
        res.json(installment);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Get reminders for upcoming installments (next 7 days)
exports.getInstallmentReminders = async (req, res) => {
    try {
        const now = new Date();
        const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        const payments = await RecurringPayment.find({ user: req.user._id });
        const reminders = [];
        payments.forEach(payment => {
            payment.installments.forEach(inst => {
                if (inst.status === 'pending' && inst.dueDate >= now && inst.dueDate <= weekFromNow) {
                    reminders.push({
                        paymentId: payment._id,
                        name: payment.name,
                        provider: payment.provider,
                        dueDate: inst.dueDate,
                        amount: inst.amount,
                        installmentId: inst._id
                    });
                }
            });
        });
        res.json(reminders);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};