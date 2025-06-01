import { Link, useNavigate } from 'react-router-dom';

export default function NavBar() {
    const navigate = useNavigate();
    const isLoggedIn = !!localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/signin');
    };

    return (
        <nav style={{ display: 'flex', gap: 16, padding: 16 }}>
            {!isLoggedIn && <Link to="/signin">Sign In</Link>}
            {!isLoggedIn && <Link to="/signup">Sign Up</Link>}
            {isLoggedIn && <button onClick={handleLogout}>Logout</button>}
            <Link to="/">Dashboard</Link>
        </nav>
    );
}
