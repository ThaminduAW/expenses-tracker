import axios from 'axios';

// API calls for authentication (login, signup)
const API_URL = (import.meta.env.VITE_API_URL || 'https://expenses-tracker-server-f9n8.onrender.com/api') + '/auth';

export const register = async (email, password) => {
    const res = await axios.post(`${API_URL}/register`, { email, password });
    return res.data;
};

export const login = async (email, password) => {
    const res = await axios.post(`${API_URL}/login`, { email, password });
    return res.data;
};