import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Register.css';

export default function Register() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const register = async () => {
        try {
            const res = await axios.post('http://localhost:5001/api/auth/register', {
                username, email, password
            });
            localStorage.setItem('token', res.data.token);
            window.location.href = '/';
        } catch (err) {
            alert('Registration failed');
        }
    };

    return (
        <div className="register-container">
            <div className="register-box">
                <h2>Create your <span>CodeChamp</span> Account</h2>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                />
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
                <button onClick={register}>Register</button>

                <p className="login-link">
                    Already have an account? <Link to="/login">Login here</Link>
                </p>
            </div>
        </div>
    );
}
