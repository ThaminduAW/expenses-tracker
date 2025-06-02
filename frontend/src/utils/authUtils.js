// Utility functions for authentication debugging

export const getTokenInfo = () => {
    const token = localStorage.getItem('token');
    if (!token) {
        return { hasToken: false, message: 'No token found in localStorage' };
    }

    try {
        // Decode JWT payload (without verification - just for debugging)
        const payload = JSON.parse(atob(token.split('.')[1]));
        const now = Date.now() / 1000;
        const isExpired = payload.exp < now;
        
        return {
            hasToken: true,
            isExpired,
            expiresAt: new Date(payload.exp * 1000).toISOString(),
            userId: payload.id,
            message: isExpired ? 'Token is expired' : 'Token is valid'
        };
    } catch (error) {
        return {
            hasToken: true,
            isExpired: true,
            message: 'Invalid token format'
        };
    }
};

export const logAuthStatus = () => {
    const info = getTokenInfo();
    console.log('Authentication Status:', info);
    return info;
};

export const clearAuthAndRedirect = () => {
    localStorage.removeItem('token');
    window.location.href = '/signin';
}; 