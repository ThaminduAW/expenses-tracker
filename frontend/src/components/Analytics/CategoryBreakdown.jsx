import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie, Doughnut } from 'react-chartjs-2';
import { analyticsService } from '../../services/analyticsService';
import Button from '../Button';

ChartJS.register(ArcElement, Tooltip, Legend);

const CategoryBreakdown = ({ selectedMonth, selectedYear, setIsLoading }) => {
  const [categoryData, setCategoryData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategoryBreakdown();
  }, [selectedMonth, selectedYear]);

  const fetchCategoryBreakdown = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await analyticsService.getCategoryBreakdown(selectedYear, selectedMonth);
      setCategoryData(data);
    } catch (err) {
      setError('Failed to fetch category breakdown data');
      console.error('Error fetching category breakdown:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">⚠️ {error}</div>
        <Button 
          onClick={fetchCategoryBreakdown}
          variant="primary"
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (!categoryData) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading category breakdown...</p>
      </div>
    );
  }

  const categoryLabels = Object.keys(categoryData.categories);
  const categoryValues = Object.values(categoryData.categories);
  const totalAmount = categoryValues.reduce((sum, value) => sum + value, 0);

  // Color scheme for categories
  const colors = {
    'Monthly Subscriptions': '#3B82F6',
    'Yearly Subscriptions': '#10B981',
    'Installment Payments': '#8B5CF6'
  };

  const backgroundColors = categoryLabels.map(label => colors[label] || '#6B7280');
  const borderColors = backgroundColors.map(color => color);

  // Pie chart data
  const pieChartData = {
    labels: categoryLabels,
    datasets: [
      {
        data: categoryValues,
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: 2,
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
        }
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

  // Doughnut chart data for better visual representation
  const doughnutChartData = {
    ...pieChartData,
    datasets: [
      {
        ...pieChartData.datasets[0],
        cutout: '60%',
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Expenses</p>
              <p className="text-2xl font-bold">${totalAmount.toFixed(2)}</p>
            </div>
            <div className="text-3xl opacity-80">💰</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Monthly Subscriptions</p>
              <p className="text-2xl font-bold">${categoryData.categories['Monthly Subscriptions'].toFixed(2)}</p>
              <p className="text-green-100 text-xs">
                {totalAmount > 0 ? ((categoryData.categories['Monthly Subscriptions'] / totalAmount) * 100).toFixed(1) : 0}% of total
              </p>
            </div>
            <div className="text-3xl opacity-80">📱</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm">Yearly Subscriptions</p>
              <p className="text-2xl font-bold">${categoryData.categories['Yearly Subscriptions'].toFixed(2)}</p>
              <p className="text-emerald-100 text-xs">
                {totalAmount > 0 ? ((categoryData.categories['Yearly Subscriptions'] / totalAmount) * 100).toFixed(1) : 0}% of total
              </p>
            </div>
            <div className="text-3xl opacity-80">📅</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Installment Payments</p>
              <p className="text-2xl font-bold">${categoryData.categories['Installment Payments'].toFixed(2)}</p>
              <p className="text-purple-100 text-xs">
                {totalAmount > 0 ? ((categoryData.categories['Installment Payments'] / totalAmount) * 100).toFixed(1) : 0}% of total
              </p>
            </div>
            <div className="text-3xl opacity-80">💳</div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Category Distribution (Pie Chart)
          </h3>
          {totalAmount > 0 ? (
            <div className="h-80 flex items-center justify-center">
              <Pie data={pieChartData} options={pieChartOptions} />
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <div className="text-6xl mb-4">📊</div>
                <p>No expenses to categorize</p>
              </div>
            </div>
          )}
        </div>

        {/* Doughnut Chart */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Category Distribution (Doughnut Chart)
          </h3>
          {totalAmount > 0 ? (
            <div className="h-80 flex items-center justify-center relative">
              <Doughnut data={doughnutChartData} options={pieChartOptions} />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">${totalAmount.toFixed(2)}</p>
                  <p className="text-sm text-gray-600">Total</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <div className="text-6xl mb-4">🍩</div>
                <p>No expenses to categorize</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Detailed Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Subscriptions Details */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-2xl">📱</span>
            Monthly Subscriptions
          </h3>
          {categoryData.details['Monthly Subscriptions'].length > 0 ? (
            <div className="space-y-3">
              {categoryData.details['Monthly Subscriptions'].map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-600">Monthly recurring</p>
                  </div>
                  <p className="font-semibold text-blue-600">${item.amount.toFixed(2)}</p>
                </div>
              ))}
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between items-center font-semibold">
                  <p className="text-gray-900">Subtotal:</p>
                  <p className="text-blue-600">${categoryData.categories['Monthly Subscriptions'].toFixed(2)}</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No monthly subscriptions</p>
          )}
        </div>

        {/* Yearly Subscriptions Details */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-2xl">📅</span>
            Yearly Subscriptions
          </h3>
          {categoryData.details['Yearly Subscriptions'].length > 0 ? (
            <div className="space-y-3">
              {categoryData.details['Yearly Subscriptions'].map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-600">Annual recurring</p>
                  </div>
                  <p className="font-semibold text-green-600">${item.amount.toFixed(2)}</p>
                </div>
              ))}
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between items-center font-semibold">
                  <p className="text-gray-900">Subtotal:</p>
                  <p className="text-green-600">${categoryData.categories['Yearly Subscriptions'].toFixed(2)}</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No yearly subscriptions</p>
          )}
        </div>

        {/* Installment Payments Details */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-2xl">💳</span>
            Installment Payments
          </h3>
          {categoryData.details['Installment Payments'].length > 0 ? (
            <div className="space-y-3">
              {categoryData.details['Installment Payments'].map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      {item.provider} • Remaining balance
                    </p>
                  </div>
                  <p className="font-semibold text-purple-600">${item.amount.toFixed(2)}</p>
                </div>
              ))}
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between items-center font-semibold">
                  <p className="text-gray-900">Subtotal:</p>
                  <p className="text-purple-600">${categoryData.categories['Installment Payments'].toFixed(2)}</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No installment payments</p>
          )}
        </div>
      </div>

      {/* Summary Table */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Category Summary
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Percentage
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items Count
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categoryLabels.map((category, index) => {
                const amount = categoryData.categories[category];
                const percentage = totalAmount > 0 ? ((amount / totalAmount) * 100) : 0;
                const itemCount = categoryData.details[category].length;
                
                return (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: colors[category] || '#6B7280' }}
                      ></div>
                      {category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold text-gray-900">
                      ${amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-600">
                      {percentage.toFixed(1)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-600">
                      {itemCount}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-gray-100">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                  Total
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-right text-gray-900">
                  ${totalAmount.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-right text-gray-900">
                  100.0%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-right text-gray-900">
                  {categoryLabels.reduce((sum, category) => sum + categoryData.details[category].length, 0)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CategoryBreakdown; 