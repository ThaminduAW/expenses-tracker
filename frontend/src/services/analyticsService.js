import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://expenses-tracker-server-f9n8.onrender.com/api';

// Create axios instance with base configuration
const analyticsAPI = axios.create({
  baseURL: `${API_BASE_URL}/analytics`,
});

// Add token to requests
analyticsAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle auth errors
analyticsAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

export const analyticsService = {
  // Get monthly expense summary
  getMonthlyExpenseSummary: async (month, year) => {
    try {
      const params = {};
      if (month) params.month = month;
      if (year) params.year = year;
      
      const response = await analyticsAPI.get('/monthly-summary', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching monthly expense summary:', error);
      throw error;
    }
  },

  // Get yearly expense summary
  getYearlyExpenseSummary: async (year) => {
    try {
      const params = {};
      if (year) params.year = year;
      
      const response = await analyticsAPI.get('/yearly-summary', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching yearly expense summary:', error);
      throw error;
    }
  },

  // Get spending trends (year-over-year comparison)
  getSpendingTrends: async () => {
    try {
      const response = await analyticsAPI.get('/spending-trends');
      return response.data;
    } catch (error) {
      console.error('Error fetching spending trends:', error);
      throw error;
    }
  },

  // Get category breakdown
  getCategoryBreakdown: async (year, month) => {
    try {
      const params = {};
      if (year) params.year = year;
      if (month) params.month = month;
      
      const response = await analyticsAPI.get('/category-breakdown', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching category breakdown:', error);
      throw error;
    }
  }
}; 