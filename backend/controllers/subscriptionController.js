// Subscription handling logic

const Subscription = require('../models/Subscription');

// Get all subscriptions
const getSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find();
    res.json(subscriptions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add a new subscription
const addSubscription = async (req, res) => {
  const { name, amount, frequency, startDate } = req.body;

  const newSubscription = new Subscription({
    name,
    amount,
    frequency,
    startDate
  });

  try {
    const savedSubscription = await newSubscription.save();
    res.status(201).json(savedSubscription);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update a subscription
const updateSubscription = async (req, res) => {
  try {
    const updated = await Subscription.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Subscription not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a subscription
const deleteSubscription = async (req, res) => {
  try {
    const deleted = await Subscription.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Subscription not found' });
    res.json({ message: 'Subscription deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get monthly/yearly breakdown
const getBreakdown = async (req, res) => {
  const { year, month } = req.query;
  try {
    let match = {};
    if (year) {
      match.startDate = { $gte: new Date(`${year}-01-01`), $lte: new Date(`${year}-12-31`) };
    }
    if (month && year) {
      const start = new Date(`${year}-${month}-01`);
      const end = new Date(start);
      end.setMonth(end.getMonth() + 1);
      match.startDate = { $gte: start, $lt: end };
    }
    const subs = await Subscription.find(match);
    res.json(subs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get reminders for upcoming renewals (next 30 days)
const getReminders = async (req, res) => {
  try {
    const now = new Date();
    const soon = new Date();
    soon.setDate(now.getDate() + 30);
    const subs = await Subscription.find({
      startDate: { $gte: now, $lte: soon }
    });
    res.json(subs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getSubscriptions,
  addSubscription,
  updateSubscription,
  deleteSubscription,
  getBreakdown,
  getReminders
};
