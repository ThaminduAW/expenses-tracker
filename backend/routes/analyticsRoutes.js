const express = require('express');
const router = express.Router();
const {
  getMonthlyExpenseSummary,
  getYearlyExpenseSummary,
  getSpendingTrends,
  getCategoryBreakdown
} = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');

// Get monthly expense summary
router.get('/monthly-summary', protect, getMonthlyExpenseSummary);

// Get yearly expense summary
router.get('/yearly-summary', protect, getYearlyExpenseSummary);

// Get spending trends (comparison between years)
router.get('/spending-trends', protect, getSpendingTrends);

// Get category breakdown
router.get('/category-breakdown', protect, getCategoryBreakdown);

module.exports = router; 