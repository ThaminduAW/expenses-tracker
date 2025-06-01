import axios from 'axios';

// API calls for managing subscriptions

const API_URL = import.meta.env.VITE_API_URL + '/subscriptions';

export const getSubscriptions = async () => {
    const res = await axios.get(API_URL);
    return res.data;
};

export const addSubscription = async (data) => {
    const res = await axios.post(API_URL, data);
    return res.data;
};

export const updateSubscription = async (id, data) => {
    const res = await axios.put(`${API_URL}/${id}`, data);
    return res.data;
};

export const deleteSubscription = async (id) => {
    const res = await axios.delete(`${API_URL}/${id}`);
    return res.data;
};

export const getBreakdown = async (params) => {
    const res = await axios.get(`${API_URL}/breakdown`, { params });
    return res.data;
};

export const getReminders = async () => {
    const res = await axios.get(`${API_URL}/reminders`);
    return res.data;
};