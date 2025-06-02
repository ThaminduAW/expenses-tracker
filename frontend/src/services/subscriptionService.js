import axios from 'axios';

// API calls for managing subscriptions

const API_URL = (import.meta.env.VITE_API_URL || 'https://expenses-tracker-server-f9n8.onrender.com/api') + '/subscriptions';

// Helper to get auth header
const getAuthConfig = () => {
    const token = localStorage.getItem('token');
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

// Helper to handle auth errors
const handleAuthError = (error) => {
    if (error.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/signin';
    }
    throw error;
};

export const getSubscriptions = async () => {
    try {
        const res = await axios.get(API_URL, getAuthConfig());
        return res.data;
    } catch (error) {
        handleAuthError(error);
    }
};

export const addSubscription = async (data) => {
    try {
        const res = await axios.post(API_URL, data, getAuthConfig());
        return res.data;
    } catch (error) {
        handleAuthError(error);
    }
};

export const updateSubscription = async (id, data) => {
    try {
        const res = await axios.put(`${API_URL}/${id}`, data, getAuthConfig());
        return res.data;
    } catch (error) {
        handleAuthError(error);
    }
};

export const deleteSubscription = async (id) => {
    try {
        const res = await axios.delete(`${API_URL}/${id}`, getAuthConfig());
        return res.data;
    } catch (error) {
        handleAuthError(error);
    }
};

export const getBreakdown = async (params) => {
    try {
        const res = await axios.get(`${API_URL}/breakdown`, { ...getAuthConfig(), params });
        return res.data;
    } catch (error) {
        handleAuthError(error);
    }
};

export const getReminders = async () => {
    try {
        const res = await axios.get(`${API_URL}/reminders`, getAuthConfig());
        return res.data;
    } catch (error) {
        handleAuthError(error);
    }
};