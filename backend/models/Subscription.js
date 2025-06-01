const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  frequency: { type: String, required: true },  // Monthly, Yearly, etc.
  startDate: { type: Date, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Add user field
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);
module.exports = Subscription;
