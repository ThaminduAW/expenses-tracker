const Subscription = require('../models/Subscription');
const RecurringPayment = require('../models/RecurringPayment');

// Get expense summary for a specific month and year
exports.getMonthlyExpenseSummary = async (req, res) => {
  try {
    const { month, year } = req.query;
    const userId = req.user.id;

    // Parse month and year, default to current if not provided
    const targetMonth = month ? parseInt(month) : new Date().getMonth() + 1;
    const targetYear = year ? parseInt(year) : new Date().getFullYear();

    // Get all subscriptions for the user
    const subscriptions = await Subscription.find({ user: userId });

    // Get all recurring payments for the user
    const recurringPayments = await RecurringPayment.find({ user: userId });

    // Calculate subscription costs for the target month
    let monthlySubscriptionCost = 0;
    const subscriptionBreakdown = [];

    subscriptions.forEach(sub => {
      const startDate = new Date(sub.startDate);
      const targetDate = new Date(targetYear, targetMonth - 1, 1);

      // Check if subscription was active during target month
      if (startDate <= targetDate) {
        let monthlyCost = 0;
        
        if (sub.frequency === 'Monthly') {
          monthlyCost = sub.amount;
        } else if (sub.frequency === 'Yearly') {
          // Check if yearly payment falls in this month
          const renewalMonth = startDate.getMonth() + 1;
          if (renewalMonth === targetMonth) {
            monthlyCost = sub.amount;
          }
        }

        if (monthlyCost > 0) {
          monthlySubscriptionCost += monthlyCost;
          subscriptionBreakdown.push({
            name: sub.name,
            amount: monthlyCost,
            frequency: sub.frequency
          });
        }
      }
    });

    // Calculate installment payments for the target month
    let monthlyInstallmentCost = 0;
    const installmentBreakdown = [];

    recurringPayments.forEach(payment => {
      payment.installments.forEach(installment => {
        const dueDate = new Date(installment.dueDate);
        if (dueDate.getMonth() + 1 === targetMonth && dueDate.getFullYear() === targetYear) {
          monthlyInstallmentCost += installment.amount;
          installmentBreakdown.push({
            name: payment.name,
            provider: payment.provider,
            amount: installment.amount,
            dueDate: installment.dueDate,
            status: installment.status
          });
        }
      });
    });

    const totalMonthlyExpense = monthlySubscriptionCost + monthlyInstallmentCost;

    res.json({
      month: targetMonth,
      year: targetYear,
      totalExpense: totalMonthlyExpense,
      subscriptionCost: monthlySubscriptionCost,
      installmentCost: monthlyInstallmentCost,
      subscriptionBreakdown,
      installmentBreakdown
    });

  } catch (error) {
    console.error('Error fetching monthly expense summary:', error);
    res.status(500).json({ error: 'Failed to fetch expense summary' });
  }
};

// Get yearly expense summary
exports.getYearlyExpenseSummary = async (req, res) => {
  try {
    const { year } = req.query;
    const userId = req.user.id;
    const targetYear = year ? parseInt(year) : new Date().getFullYear();

    const subscriptions = await Subscription.find({ user: userId });
    const recurringPayments = await RecurringPayment.find({ user: userId });

    const monthlyData = [];
    let totalYearlyExpense = 0;

    // Calculate expenses for each month of the year
    for (let month = 1; month <= 12; month++) {
      let monthlySubscriptionCost = 0;
      let monthlyInstallmentCost = 0;

      // Calculate subscription costs for this month
      subscriptions.forEach(sub => {
        const startDate = new Date(sub.startDate);
        const targetDate = new Date(targetYear, month - 1, 1);

        if (startDate <= targetDate) {
          if (sub.frequency === 'Monthly') {
            monthlySubscriptionCost += sub.amount;
          } else if (sub.frequency === 'Yearly') {
            const renewalMonth = startDate.getMonth() + 1;
            if (renewalMonth === month) {
              monthlySubscriptionCost += sub.amount;
            }
          }
        }
      });

      // Calculate installment costs for this month
      recurringPayments.forEach(payment => {
        payment.installments.forEach(installment => {
          const dueDate = new Date(installment.dueDate);
          if (dueDate.getMonth() + 1 === month && dueDate.getFullYear() === targetYear) {
            monthlyInstallmentCost += installment.amount;
          }
        });
      });

      const monthTotal = monthlySubscriptionCost + monthlyInstallmentCost;
      totalYearlyExpense += monthTotal;

      monthlyData.push({
        month,
        monthName: new Date(targetYear, month - 1, 1).toLocaleString('default', { month: 'long' }),
        subscriptionCost: monthlySubscriptionCost,
        installmentCost: monthlyInstallmentCost,
        totalCost: monthTotal
      });
    }

    res.json({
      year: targetYear,
      totalYearlyExpense,
      monthlyData
    });

  } catch (error) {
    console.error('Error fetching yearly expense summary:', error);
    res.status(500).json({ error: 'Failed to fetch yearly expense summary' });
  }
};

// Get spending trends and comparison data
exports.getSpendingTrends = async (req, res) => {
  try {
    const userId = req.user.id;
    const currentYear = new Date().getFullYear();
    const previousYear = currentYear - 1;

    // Get data for current and previous year
    const currentYearData = await calculateYearlyData(userId, currentYear);
    const previousYearData = await calculateYearlyData(userId, previousYear);

    // Calculate trends
    const trends = {
      currentYear: {
        year: currentYear,
        totalExpense: currentYearData.total,
        averageMonthly: currentYearData.total / 12,
        monthlyData: currentYearData.monthly
      },
      previousYear: {
        year: previousYear,
        totalExpense: previousYearData.total,
        averageMonthly: previousYearData.total / 12,
        monthlyData: previousYearData.monthly
      },
      comparison: {
        yearOverYearChange: currentYearData.total - previousYearData.total,
        percentageChange: previousYearData.total > 0 
          ? ((currentYearData.total - previousYearData.total) / previousYearData.total) * 100 
          : 0
      }
    };

    res.json(trends);

  } catch (error) {
    console.error('Error fetching spending trends:', error);
    res.status(500).json({ error: 'Failed to fetch spending trends' });
  }
};

// Get category breakdown
exports.getCategoryBreakdown = async (req, res) => {
  try {
    const userId = req.user.id;
    const { year, month } = req.query;
    
    const subscriptions = await Subscription.find({ user: userId });
    const recurringPayments = await RecurringPayment.find({ user: userId });

    // Group subscriptions by frequency
    const categories = {
      'Monthly Subscriptions': 0,
      'Yearly Subscriptions': 0,
      'Installment Payments': 0
    };

    const details = {
      'Monthly Subscriptions': [],
      'Yearly Subscriptions': [],
      'Installment Payments': []
    };

    // Process subscriptions
    subscriptions.forEach(sub => {
      if (sub.frequency === 'Monthly') {
        categories['Monthly Subscriptions'] += sub.amount;
        details['Monthly Subscriptions'].push({
          name: sub.name,
          amount: sub.amount
        });
      } else if (sub.frequency === 'Yearly') {
        categories['Yearly Subscriptions'] += sub.amount;
        details['Yearly Subscriptions'].push({
          name: sub.name,
          amount: sub.amount
        });
      }
    });

    // Process recurring payments
    recurringPayments.forEach(payment => {
      const totalRemaining = payment.installments
        .filter(installment => installment.status === 'pending')
        .reduce((sum, installment) => sum + installment.amount, 0);
      
      categories['Installment Payments'] += totalRemaining;
      details['Installment Payments'].push({
        name: payment.name,
        amount: totalRemaining,
        provider: payment.provider
      });
    });

    res.json({
      categories,
      details
    });

  } catch (error) {
    console.error('Error fetching category breakdown:', error);
    res.status(500).json({ error: 'Failed to fetch category breakdown' });
  }
};

// Helper function to calculate yearly data
async function calculateYearlyData(userId, year) {
  const subscriptions = await Subscription.find({ user: userId });
  const recurringPayments = await RecurringPayment.find({ user: userId });

  const monthlyData = [];
  let totalYearlyExpense = 0;

  for (let month = 1; month <= 12; month++) {
    let monthlySubscriptionCost = 0;
    let monthlyInstallmentCost = 0;

    subscriptions.forEach(sub => {
      const startDate = new Date(sub.startDate);
      const targetDate = new Date(year, month - 1, 1);

      if (startDate <= targetDate) {
        if (sub.frequency === 'Monthly') {
          monthlySubscriptionCost += sub.amount;
        } else if (sub.frequency === 'Yearly') {
          const renewalMonth = startDate.getMonth() + 1;
          if (renewalMonth === month) {
            monthlySubscriptionCost += sub.amount;
          }
        }
      }
    });

    recurringPayments.forEach(payment => {
      payment.installments.forEach(installment => {
        const dueDate = new Date(installment.dueDate);
        if (dueDate.getMonth() + 1 === month && dueDate.getFullYear() === year) {
          monthlyInstallmentCost += installment.amount;
        }
      });
    });

    const monthTotal = monthlySubscriptionCost + monthlyInstallmentCost;
    totalYearlyExpense += monthTotal;

    monthlyData.push({
      month,
      total: monthTotal,
      subscriptions: monthlySubscriptionCost,
      installments: monthlyInstallmentCost
    });
  }

  return {
    total: totalYearlyExpense,
    monthly: monthlyData
  };
} 