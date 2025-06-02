import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { analyticsService } from '../../services/analyticsService';
import { format } from 'date-fns';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const MonthlyReport = ({ selectedMonth, selectedYear, setIsLoading }) => {
  const [monthlyData, setMonthlyData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMonthlyReport();
  }, [selectedMonth, selectedYear]);

  const fetchMonthlyReport = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await analyticsService.getMonthlyExpenseSummary(selectedMonth, selectedYear);
      setMonthlyData(data);
    } catch (err) {
      setError('Failed to fetch monthly report data');
      console.error('Error fetching monthly report:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">⚠️ {error}</div>
        <button 
          onClick={fetchMonthlyReport}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!monthlyData) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading monthly report...</p>
      </div>
    );
  }

  const monthName = format(new Date(selectedYear, selectedMonth - 1, 1), 'MMMM yyyy');

  // Pie chart data for expense breakdown
  const pieChartData = {
    labels: ['Subscriptions', 'Installments'],
    datasets: [
      {
        data: [monthlyData.subscriptionCost || 0, monthlyData.installmentCost || 0],
        backgroundColor: ['#3B82F6', '#10B981'],
        borderColor: ['#2563EB', '#059669'],
        borderWidth: 2,
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = total > 0 ? ((context.parsed / total) * 100).toFixed(1) : 0;
            return `${context.label}: $${context.parsed.toFixed(2)} (${percentage}%)`;
          }
        }
      }
    },
  };

  // Bar chart data for subscription breakdown
  const subscriptionLabels = monthlyData.subscriptionBreakdown.map(sub => sub.name);
  const subscriptionAmounts = monthlyData.subscriptionBreakdown.map(sub => sub.amount);

  const subscriptionBarData = {
    labels: subscriptionLabels.length > 0 ? subscriptionLabels : ['No Subscriptions'],
    datasets: [
      {
        label: 'Amount ($)',
        data: subscriptionAmounts.length > 0 ? subscriptionAmounts : [0],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '$' + value.toFixed(2);
          }
        }
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Expenses</p>
              <p className="text-3xl font-bold">${monthlyData.totalExpense.toFixed(2)}</p>
            </div>
            <div className="text-4xl opacity-80">💰</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Subscriptions</p>
              <p className="text-3xl font-bold">${monthlyData.subscriptionCost.toFixed(2)}</p>
            </div>
            <div className="text-4xl opacity-80">📱</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Installments</p>
              <p className="text-3xl font-bold">${monthlyData.installmentCost.toFixed(2)}</p>
            </div>
            <div className="text-4xl opacity-80">💳</div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense Breakdown Pie Chart */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Expense Breakdown for {monthName}
          </h3>
          {monthlyData.totalExpense > 0 ? (
            <div className="h-64 flex items-center justify-center">
              <Pie data={pieChartData} options={pieChartOptions} />
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <div className="text-6xl mb-4">📊</div>
                <p>No expenses for this month</p>
              </div>
            </div>
          )}
        </div>

        {/* Subscription Breakdown */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Subscription Breakdown
          </h3>
          {monthlyData.subscriptionBreakdown.length > 0 ? (
            <div className="h-64">
              <Bar data={subscriptionBarData} options={barChartOptions} />
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <div className="text-6xl mb-4">📱</div>
                <p>No subscriptions for this month</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Detailed Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subscription Details */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Subscription Details
          </h3>
          {monthlyData.subscriptionBreakdown.length > 0 ? (
            <div className="space-y-3">
              {monthlyData.subscriptionBreakdown.map((sub, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{sub.name}</p>
                    <p className="text-sm text-gray-600">{sub.frequency}</p>
                  </div>
                  <p className="font-semibold text-blue-600">${sub.amount.toFixed(2)}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No subscriptions this month</p>
          )}
        </div>

        {/* Installment Details */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Installment Details
          </h3>
          {monthlyData.installmentBreakdown.length > 0 ? (
            <div className="space-y-3">
              {monthlyData.installmentBreakdown.map((installment, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{installment.name}</p>
                    <p className="text-sm text-gray-600">
                      {installment.provider} • Due: {format(new Date(installment.dueDate), 'MMM dd')}
                    </p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      installment.status === 'paid' 
                        ? 'bg-green-100 text-green-800' 
                        : installment.status === 'overdue'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {installment.status}
                    </span>
                  </div>
                  <p className="font-semibold text-purple-600">${installment.amount.toFixed(2)}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No installments this month</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MonthlyReport; 