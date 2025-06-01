import { useState } from 'react';
import { register } from '../../services/authService';

export default function SignUp() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);
        try {
            await register(email, password);
            setSuccess('Registration successful! You can now sign in.');
            setEmail('');
            setPassword('');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: '2rem auto' }}>
            <h2>Sign Up</h2>
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
                    {loading ? 'Signing up...' : 'Sign Up'}
                </button>
                {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
                {success && <div style={{ color: 'green', marginTop: 8 }}>{success}</div>}
            </form>
        </div>
    );
}
