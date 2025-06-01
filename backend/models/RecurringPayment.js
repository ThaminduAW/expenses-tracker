const mongoose = require('mongoose');

const InstallmentSchema = new mongoose.Schema({
    dueDate: { type: Date, required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'paid', 'overdue'], default: 'pending' },
    paidAt: { type: Date }
});

const RecurringPaymentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    provider: { type: String }, // e.g., Afterpay, Klarna
    totalAmount: { type: Number, required: true },
    installments: [InstallmentSchema],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('RecurringPayment', RecurringPaymentSchema);
