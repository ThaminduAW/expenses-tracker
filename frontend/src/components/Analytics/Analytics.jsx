import React, { useState, useEffect } from 'react';
import { analyticsService } from '../../services/analyticsService';
import MonthlyReport from './MonthlyReport';
import YearlyReport from './YearlyReport';
import SpendingTrends from './SpendingTrends';
import CategoryBreakdown from './CategoryBreakdown';

const Analytics = () => {
  const [activeTab, setActiveTab] = useState('monthly');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const tabs = [
    { id: 'monthly', label: 'Monthly Report', icon: '📊' },
    { id: 'yearly', label: 'Yearly Report', icon: '📈' },
    { id: 'trends', label: 'Spending Trends', icon: '📉' },
    { id: 'categories', label: 'Category Breakdown', icon: '🥧' }
  ];

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const years = [];
  const currentYear = new Date().getFullYear();
  for (let i = currentYear - 2; i <= currentYear + 1; i++) {
    years.push(i);
  }

  const renderActiveComponent = () => {
    const props = {
      selectedMonth,
      selectedYear,
      setIsLoading
    };

    switch (activeTab) {
      case 'monthly':
        return <MonthlyReport {...props} />;
      case 'yearly':
        return <YearlyReport {...props} />;
      case 'trends':
        return <SpendingTrends {...props} />;
      case 'categories':
        return <CategoryBreakdown {...props} />;
      default:
        return <MonthlyReport {...props} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Analytics & Reports
          </h1>
          <p className="text-gray-600">
            Analyze your spending patterns and track your financial habits
          </p>
        </div>

        {/* Date Controls */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Month:</label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {months.map((month, index) => (
                  <option key={index} value={index + 1}>
                    {month}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Year:</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {isLoading && (
              <div className="flex items-center gap-2 text-blue-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-sm">Loading...</span>
              </div>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } flex items-center gap-2 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {renderActiveComponent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics; 