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

module.exports = { getSubscriptions, addSubscription };
