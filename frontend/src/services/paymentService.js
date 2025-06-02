import axios from 'axios';

// API calls for recurring payments
const API = `${import.meta.env.VITE_API_URL || 'https://expenses-tracker-server-f9n8.onrender.com/api'}/payments`;

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

export const getRecurringPayments = async () => {
    try {
        const res = await axios.get(API, getAuthConfig());
        return res.data;
    } catch (error) {
        handleAuthError(error);
    }
};

export const addRecurringPayment = async (data) => {
    try {
        const res = await axios.post(API, data, getAuthConfig());
        return res.data;
    } catch (error) {
        handleAuthError(error);
    }
};

export const updateRecurringPayment = async (id, data) => {
    try {
        const res = await axios.put(`${API}/${id}`, data, getAuthConfig());
        return res.data;
    } catch (error) {
        handleAuthError(error);
    }
};

export const deleteRecurringPayment = async (id) => {
    try {
        const res = await axios.delete(`${API}/${id}`, getAuthConfig());
        return res.data;
    } catch (error) {
        handleAuthError(error);
    }
};

export const getPaymentSchedule = async (id) => {
    try {
        const res = await axios.get(`${API}/${id}/schedule`, getAuthConfig());
        return res.data;
    } catch (error) {
        handleAuthError(error);
    }
};

export const markInstallmentPaid = async (id, installmentId) => {
    try {
        const res = await axios.post(`${API}/${id}/installments/${installmentId}/pay`, {}, getAuthConfig());
        return res.data;
    } catch (error) {
        handleAuthError(error);
    }
};

export const getInstallmentReminders = async () => {
    try {
        const res = await axios.get(`${API}/reminders`, getAuthConfig());
        return res.data;
    } catch (error) {
        handleAuthError(error);
    }
};