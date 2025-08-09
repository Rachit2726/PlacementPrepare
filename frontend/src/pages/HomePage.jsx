// src/pages/HomePage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

export default function HomePage() {
    const navigate = useNavigate();

    return (
        <div className="home-container">
            <h1 className="title">Code<span>Champ</span></h1>
            <p className="tagline">A platform for <span>champions</span></p>
            <button className="start-btn" onClick={() => navigate('/login')}>Get Started</button>
        </div>
    );
}
