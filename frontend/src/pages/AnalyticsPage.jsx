import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { analyticsService } from '../services/analyticsService';
import MonthlyReport from '../components/Analytics/MonthlyReport';
import YearlyReport from '../components/Analytics/YearlyReport';
import SpendingTrends from '../components/Analytics/SpendingTrends';
import CategoryBreakdown from '../components/Analytics/CategoryBreakdown';

const AnalyticsPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('monthly');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const tabs = [
    { 
      id: 'monthly', 
      label: 'Monthly Report', 
      icon: (
        <svg width={20} height={20} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
          <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )
    },
    { 
      id: 'yearly', 
      label: 'Yearly Report', 
      icon: (
        <svg width={20} height={20} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <line x1="18" y1="20" x2="18" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <line x1="12" y1="20" x2="12" y2="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <line x1="6" y1="20" x2="6" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )
    },
    { 
      id: 'trends', 
      label: 'Spending Trends', 
      icon: (
        <svg width={20} height={20} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <polyline points="23,6 13.5,15.5 8.5,10.5 1,18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <polyline points="17,6 23,6 23,12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    { 
      id: 'categories', 
      label: 'Category Breakdown', 
      icon: (
        <svg width={20} height={20} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21.21 15.89A10 10 0 1 1 8 2.83" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M22 12A10 10 0 0 0 12 2v10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    }
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

  useEffect(() => {
    // Check for token in localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/signin');
      return;
    }
  }, [navigate]);

  const handleGoBack = () => {
    navigate('/');
  };

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
    <StyledWrapper>
      <div className="analytics-container">
        <Header>
          <div className="header-left">
            <button className="back-btn" onClick={handleGoBack}>
              <svg width={16} height={16} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Back to Dashboard
            </button>
            <div className="header-text">
              <h1>Analytics & Reports</h1>
              <p>Analyze your spending patterns and track your financial habits</p>
            </div>
          </div>
          {isLoading && (
            <LoadingIndicator>
              <div className="spinner"></div>
              <span>Loading...</span>
            </LoadingIndicator>
          )}
        </Header>

        <Card>
          <CardHeader>
            <h2>Date Controls</h2>
            <svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </CardHeader>
          <DateControls>
            <div className="control-group">
              <label>Month</label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              >
                {months.map((month, index) => (
                  <option key={index} value={index + 1}>
                    {month}
                  </option>
                ))}
              </select>
            </div>
            <div className="control-group">
              <label>Year</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </DateControls>
        </Card>

        <TabsCard>
          <TabNavigation>
            {tabs.map((tab) => (
              <TabButton
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={activeTab === tab.id ? 'active' : ''}
              >
                {tab.icon}
                {tab.label}
              </TabButton>
            ))}
          </TabNavigation>
          
          <TabContent>
            {renderActiveComponent()}
          </TabContent>
        </TabsCard>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  min-height: 100vh;
  background-color: #f5f5f5;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;

  .analytics-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 1.5rem 2rem;
  border-radius: 20px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);

  .header-left {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }

  .back-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    background-color: #6c757d;
    color: white;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    font-weight: 500;
    transition: background-color 0.2s ease-in-out;
    font-size: 0.9rem;

    &:hover {
      background-color: #5a6268;
    }
  }

  .header-text {
    h1 {
      margin: 0 0 0.25rem 0;
      color: #151717;
      font-size: 1.8rem;
      font-weight: 600;
    }

    p {
      margin: 0;
      color: #6c757d;
      font-size: 0.95rem;
    }
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    
    .header-left {
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }
  }
`;

const LoadingIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #2d79f3;
  font-size: 0.9rem;
  font-weight: 500;

  .spinner {
    width: 16px;
    height: 16px;
    border: 2px solid #e3f2fd;
    border-top: 2px solid #2d79f3;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;

  h2 {
    margin: 0;
    color: #151717;
    font-size: 1.5rem;
    font-weight: 600;
  }

  svg {
    color: #2d79f3;
  }
`;

const DateControls = styled.div`
  display: flex;
  gap: 2rem;
  align-items: flex-end;

  .control-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    min-width: 120px;

    label {
      color: #151717;
      font-weight: 600;
      font-size: 0.9rem;
    }

    select {
      padding: 0.75rem;
      border: 1.5px solid #ecedec;
      border-radius: 10px;
      font-size: 1rem;
      background-color: white;
      cursor: pointer;
      transition: border-color 0.2s ease-in-out;

      &:focus {
        outline: none;
        border-color: #2d79f3;
      }
    }
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;

    .control-group {
      min-width: 100%;
    }
  }
`;

const TabsCard = styled.div`
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const TabNavigation = styled.div`
  display: flex;
  border-bottom: 1px solid #ecedec;
  overflow-x: auto;
  
  @media (max-width: 768px) {
    flex-wrap: wrap;
  }
`;

const TabButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.25rem 2rem;
  border: none;
  background: none;
  color: #6c757d;
  font-weight: 500;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  transition: all 0.2s ease-in-out;
  white-space: nowrap;
  font-size: 0.95rem;

  &:hover {
    color: #151717;
    background-color: #f8f9fa;
  }

  &.active {
    color: #2d79f3;
    border-bottom-color: #2d79f3;
    background-color: #f8f9fa;
  }

  svg {
    flex-shrink: 0;
  }

  @media (max-width: 768px) {
    flex: 1;
    min-width: 0;
    padding: 1rem;
    
    span {
      display: none;
    }
  }
`;

const TabContent = styled.div`
  padding: 2rem;
  min-height: 400px;

  /* Override existing component styles for consistency */
  .bg-gray-50 {
    background-color: transparent !important;
  }

  .bg-white {
    background-color: #f8f9fa !important;
    border: 1px solid #e9ecef !important;
    border-radius: 15px !important;
  }

  .rounded-lg {
    border-radius: 15px !important;
  }

  .shadow-sm {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
  }

  .border-gray-200 {
    border-color: #e9ecef !important;
  }

  .text-gray-900 {
    color: #151717 !important;
  }

  .text-gray-600 {
    color: #6c757d !important;
  }

  .text-blue-600 {
    color: #2d79f3 !important;
  }

  .bg-blue-600 {
    background-color: #2d79f3 !important;
  }

  .hover\\:bg-blue-700:hover {
    background-color: #1e5bb8 !important;
  }
`;

export default AnalyticsPage; 