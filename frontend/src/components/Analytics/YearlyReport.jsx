import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { analyticsService } from '../../services/analyticsService';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const YearlyReport = ({ selectedYear, setIsLoading }) => {
  const [yearlyData, setYearlyData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchYearlyReport();
  }, [selectedYear]);

  const fetchYearlyReport = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await analyticsService.getYearlyExpenseSummary(selectedYear);
      setYearlyData(data);
    } catch (err) {
      setError('Failed to fetch yearly report data');
      console.error('Error fetching yearly report:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">⚠️ {error}</div>
        <button 
          onClick={fetchYearlyReport}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!yearlyData) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading yearly report...</p>
      </div>
    );
  }

  const monthLabels = yearlyData.monthlyData.map(item => item.monthName);
  const totalCosts = yearlyData.monthlyData.map(item => item.totalCost);
  const subscriptionCosts = yearlyData.monthlyData.map(item => item.subscriptionCost);
  const installmentCosts = yearlyData.monthlyData.map(item => item.installmentCost);

  // Line chart for monthly trends
  const lineChartData = {
    labels: monthLabels,
    datasets: [
      {
        label: 'Total Expenses',
        data: totalCosts,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Subscriptions',
        data: subscriptionCosts,
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Installments',
        data: installmentCosts,
        borderColor: 'rgb(139, 92, 246)',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Monthly Expense Trends - ${selectedYear}`,
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

  // Bar chart for monthly breakdown
  const barChartData = {
    labels: monthLabels,
    datasets: [
      {
        label: 'Subscriptions',
        data: subscriptionCosts,
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 1,
      },
      {
        label: 'Installments',
        data: installmentCosts,
        backgroundColor: 'rgba(139, 92, 246, 0.8)',
        borderColor: 'rgba(139, 92, 246, 1)',
        borderWidth: 1,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Monthly Expense Breakdown - ${selectedYear}`,
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
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '$' + value.toFixed(0);
          }
        }
      },
    },
  };

  // Calculate statistics
  const averageMonthly = yearlyData.totalYearlyExpense / 12;
  const highestMonth = yearlyData.monthlyData.reduce((max, month) => 
    month.totalCost > max.totalCost ? month : max
  );
  const lowestMonth = yearlyData.monthlyData.reduce((min, month) => 
    month.totalCost < min.totalCost ? month : min
  );

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Yearly Expense</p>
              <p className="text-2xl font-bold">${yearlyData.totalYearlyExpense.toFixed(2)}</p>
            </div>
            <div className="text-3xl opacity-80">💰</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Average Monthly</p>
              <p className="text-2xl font-bold">${averageMonthly.toFixed(2)}</p>
            </div>
            <div className="text-3xl opacity-80">📊</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm">Highest Month</p>
              <p className="text-xl font-bold">{highestMonth.monthName}</p>
              <p className="text-lg">${highestMonth.totalCost.toFixed(2)}</p>
            </div>
            <div className="text-3xl opacity-80">📈</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Lowest Month</p>
              <p className="text-xl font-bold">{lowestMonth.monthName}</p>
              <p className="text-lg">${lowestMonth.totalCost.toFixed(2)}</p>
            </div>
            <div className="text-3xl opacity-80">📉</div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Line Chart for Trends */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="h-80">
            <Line data={lineChartData} options={lineChartOptions} />
          </div>
        </div>

        {/* Stacked Bar Chart */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="h-80">
            <Bar data={barChartData} options={barChartOptions} />
          </div>
        </div>
      </div>

      {/* Monthly Data Table */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Monthly Breakdown for {selectedYear}
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Month
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subscriptions
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Installments
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {yearlyData.monthlyData.map((month, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {month.monthName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-green-600">
                    ${month.subscriptionCost.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-purple-600">
                    ${month.installmentCost.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-right text-gray-900">
                    ${month.totalCost.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-100">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                  Total
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-right text-green-600">
                  ${yearlyData.monthlyData.reduce((sum, month) => sum + month.subscriptionCost, 0).toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-right text-purple-600">
                  ${yearlyData.monthlyData.reduce((sum, month) => sum + month.installmentCost, 0).toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-right text-gray-900">
                  ${yearlyData.totalYearlyExpense.toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default YearlyReport; 