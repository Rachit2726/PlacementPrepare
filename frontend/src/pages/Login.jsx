import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Login.css';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    // Where to redirect after login
    const from = location.state?.from?.pathname || '/companies';

    const login = async () => {
        try {
            const res = await axios.post('https://placementprepare.onrender.com/api/auth/login', { email, password });

            // Store token + role
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('role', res.data.user.role); // 'admin' or 'user'

            // Redirect based on role
            if (res.data.user.role === 'admin') {
                navigate('/admin/dashboard', { replace: true });
            } else {
                navigate(from, { replace: true });
            }
        } catch (err) {
            alert('Invalid credentials');
        }
    };


    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Login to <span>CodeChamp</span></h2>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
                <button onClick={login}>Login</button>

                <p className="register-link">
                    Don’t have an account? <Link to="/register">Register now</Link>
                </p>
            </div>
        </div>
    );
}
