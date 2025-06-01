import axios from 'axios';

// API calls for managing subscriptions

const API_URL = import.meta.env.VITE_API_URL + '/subscriptions';

// Helper to get auth header
const getAuthConfig = () => {
    const token = localStorage.getItem('token');
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

export const getSubscriptions = async () => {
    const res = await axios.get(API_URL, getAuthConfig());
    return res.data;
};

export const addSubscription = async (data) => {
    const res = await axios.post(API_URL, data, getAuthConfig());
    return res.data;
};

export const updateSubscription = async (id, data) => {
    const res = await axios.put(`${API_URL}/${id}`, data, getAuthConfig());
    return res.data;
};

export const deleteSubscription = async (id) => {
    const res = await axios.delete(`${API_URL}/${id}`, getAuthConfig());
    return res.data;
};

export const getBreakdown = async (params) => {
    const res = await axios.get(`${API_URL}/breakdown`, { ...getAuthConfig(), params });
    return res.data;
};

export const getReminders = async () => {
    const res = await axios.get(`${API_URL}/reminders`, getAuthConfig());
    return res.data;
};