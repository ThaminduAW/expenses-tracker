import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { analyticsService } from '../../services/analyticsService';
import Button from '../Button';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const SpendingTrends = ({ setIsLoading }) => {
  const [trendsData, setTrendsData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSpendingTrends();
  }, []);

  const fetchSpendingTrends = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await analyticsService.getSpendingTrends();
      setTrendsData(data);
    } catch (err) {
      setError('Failed to fetch spending trends data');
      console.error('Error fetching spending trends:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">⚠️ {error}</div>
        <Button 
          onClick={fetchSpendingTrends}
          variant="primary"
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (!trendsData) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading spending trends...</p>
      </div>
    );
  }

  const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Line chart comparing current year vs previous year
  const comparisonLineData = {
    labels: monthLabels,
    datasets: [
      {
        label: `${trendsData.currentYear.year} Total`,
        data: trendsData.currentYear.monthlyData.map(month => month.total),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: false,
      },
      {
        label: `${trendsData.previousYear.year} Total`,
        data: trendsData.previousYear.monthlyData.map(month => month.total),
        borderColor: 'rgb(156, 163, 175)',
        backgroundColor: 'rgba(156, 163, 175, 0.1)',
        tension: 0.4,
        fill: false,
        borderDash: [5, 5],
      },
    ],
  };

  const comparisonLineOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Year-over-Year Spending Comparison',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: $${context.parsed.y.toFixed(2)}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '$' + value.toFixed(0);
          }
        }
      },
    },
  };

  // Bar chart for category comparison
  const categoryComparisonData = {
    labels: monthLabels,
    datasets: [
      {
        label: `${trendsData.currentYear.year} Subscriptions`,
        data: trendsData.currentYear.monthlyData.map(month => month.subscriptions),
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 1,
      },
      {
        label: `${trendsData.currentYear.year} Installments`,
        data: trendsData.currentYear.monthlyData.map(month => month.installments),
        backgroundColor: 'rgba(139, 92, 246, 0.8)',
        borderColor: 'rgba(139, 92, 246, 1)',
        borderWidth: 1,
      },
      {
        label: `${trendsData.previousYear.year} Subscriptions`,
        data: trendsData.previousYear.monthlyData.map(month => month.subscriptions),
        backgroundColor: 'rgba(16, 185, 129, 0.4)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 1,
      },
      {
        label: `${trendsData.previousYear.year} Installments`,
        data: trendsData.previousYear.monthlyData.map(month => month.installments),
        backgroundColor: 'rgba(139, 92, 246, 0.4)',
        borderColor: 'rgba(139, 92, 246, 1)',
        borderWidth: 1,
      },
    ],
  };

  const categoryComparisonOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Category Comparison by Month',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: $${context.parsed.y.toFixed(2)}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '$' + value.toFixed(0);
          }
        }
      },
    },
  };

  // Calculate insights
  const insights = [];
  
  if (trendsData.comparison.percentageChange > 0) {
    insights.push({
      type: 'increase',
      text: `Your spending increased by ${trendsData.comparison.percentageChange.toFixed(1)}% compared to last year`,
      icon: '📈',
      color: 'text-red-600'
    });
  } else if (trendsData.comparison.percentageChange < 0) {
    insights.push({
      type: 'decrease',
      text: `Great job! Your spending decreased by ${Math.abs(trendsData.comparison.percentageChange).toFixed(1)}% compared to last year`,
      icon: '📉',
      color: 'text-green-600'
    });
  }

  if (trendsData.currentYear.averageMonthly > trendsData.previousYear.averageMonthly) {
    insights.push({
      type: 'average',
      text: `Your average monthly spending increased by $${(trendsData.currentYear.averageMonthly - trendsData.previousYear.averageMonthly).toFixed(2)}`,
      icon: '📊',
      color: 'text-orange-600'
    });
  } else {
    insights.push({
      type: 'average',
      text: `Your average monthly spending decreased by $${(trendsData.previousYear.averageMonthly - trendsData.currentYear.averageMonthly).toFixed(2)}`,
      icon: '📊',
      color: 'text-green-600'
    });
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">{trendsData.currentYear.year} Total</p>
              <p className="text-2xl font-bold">${trendsData.currentYear.totalExpense.toFixed(2)}</p>
              <p className="text-blue-100 text-xs">Avg: ${trendsData.currentYear.averageMonthly.toFixed(2)}/month</p>
            </div>
            <div className="text-3xl opacity-80">💰</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-gray-500 to-gray-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-100 text-sm">{trendsData.previousYear.year} Total</p>
              <p className="text-2xl font-bold">${trendsData.previousYear.totalExpense.toFixed(2)}</p>
              <p className="text-gray-100 text-xs">Avg: ${trendsData.previousYear.averageMonthly.toFixed(2)}/month</p>
            </div>
            <div className="text-3xl opacity-80">📅</div>
          </div>
        </div>

        <div className={`bg-gradient-to-r rounded-lg p-6 text-white ${
          trendsData.comparison.percentageChange >= 0 
            ? 'from-red-500 to-red-600' 
            : 'from-green-500 to-green-600'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white text-opacity-80 text-sm">Year-over-Year</p>
              <p className="text-2xl font-bold">
                {trendsData.comparison.percentageChange >= 0 ? '+' : ''}
                {trendsData.comparison.percentageChange.toFixed(1)}%
              </p>
              <p className="text-white text-opacity-80 text-xs">
                ${Math.abs(trendsData.comparison.yearOverYearChange).toFixed(2)} difference
              </p>
            </div>
            <div className="text-3xl opacity-80">
              {trendsData.comparison.percentageChange >= 0 ? '📈' : '📉'}
            </div>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Spending Insights</h3>
        <div className="space-y-3">
          {insights.map((insight, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <span className="text-2xl">{insight.icon}</span>
              <p className={`${insight.color} font-medium`}>{insight.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Year-over-Year Comparison */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="h-80">
            <Line data={comparisonLineData} options={comparisonLineOptions} />
          </div>
        </div>

        {/* Category Comparison */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="h-80">
            <Bar data={categoryComparisonData} options={categoryComparisonOptions} />
          </div>
        </div>
      </div>

      {/* Detailed Comparison Table */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Month-by-Month Comparison
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Month
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {trendsData.currentYear.year}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {trendsData.previousYear.year}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Difference
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Change %
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {monthLabels.map((month, index) => {
                const currentAmount = trendsData.currentYear.monthlyData[index].total;
                const previousAmount = trendsData.previousYear.monthlyData[index].total;
                const difference = currentAmount - previousAmount;
                const changePercent = previousAmount > 0 ? ((difference / previousAmount) * 100) : 0;
                
                return (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {month}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-blue-600">
                      ${currentAmount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-600">
                      ${previousAmount.toFixed(2)}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${
                      difference >= 0 ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {difference >= 0 ? '+' : ''}${difference.toFixed(2)}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${
                      changePercent >= 0 ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {changePercent >= 0 ? '+' : ''}{changePercent.toFixed(1)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SpendingTrends; 