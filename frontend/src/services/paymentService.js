import axios from 'axios';

// API calls for recurring payments
const API = `${import.meta.env.VITE_API_BASE_URL}/api/payments`;

export const getRecurringPayments = async () => {
    const res = await axios.get(API, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
    return res.data;
};

export const addRecurringPayment = async (data) => {
    const res = await axios.post(API, data, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
    return res.data;
};

export const updateRecurringPayment = async (id, data) => {
    const res = await axios.put(`${API}/${id}`, data, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
    return res.data;
};

export const deleteRecurringPayment = async (id) => {
    const res = await axios.delete(`${API}/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
    return res.data;
};

export const getPaymentSchedule = async (id) => {
    const res = await axios.get(`${API}/${id}/schedule`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
    return res.data;
};

export const markInstallmentPaid = async (id, installmentId) => {
    const res = await axios.post(`${API}/${id}/installments/${installmentId}/pay`, {}, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
    return res.data;
};

export const getInstallmentReminders = async () => {
    const res = await axios.get(`${API}/reminders`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
    return res.data;
};