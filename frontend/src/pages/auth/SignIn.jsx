import { useState } from 'react';
import { login } from '../../services/authService';

export default function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const data = await login(email, password);
            setToken(data.token);
            // Store token in localStorage or context for real app
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: '2rem auto' }}>
            <h2>Sign In</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    style={{ width: '100%', marginBottom: 8 }}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    style={{ width: '100%', marginBottom: 8 }}
                />
                <button type="submit" disabled={loading} style={{ width: '100%' }}>
                    {loading ? 'Signing in...' : 'Sign In'}
                </button>
                {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
                {token && <div style={{ color: 'green', marginTop: 8 }}>Signed in! Token: {token}</div>}
            </form>
        </div>
    );
}
