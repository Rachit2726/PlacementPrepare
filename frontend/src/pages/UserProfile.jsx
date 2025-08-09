import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './UserProfile.css';

export default function UserProfile() {
    const [profile, setProfile] = useState(null);
    const [subs, setSubs] = useState([]);

    useEffect(() => {
        // Fetch profile data
        axios.get('http://localhost:5001/api/profile', {
            headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
        }).then(res => setProfile(res.data));

        // Fetch submission history
        axios.get('http://localhost:5001/api/history', {
            headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
        }).then(res => setSubs(res.data));
    }, []);

    if (!profile)
        return (
            <p className="loading-text">
                Loading your profile...
            </p>
        );

    return (
        <section className="profile-page">
            <header className="profile-header">
                <h1>Welcome, <span className="username-highlight">{profile.username}</span></h1>
                <p className="profile-subtitle">Here is your performance overview</p>
            </header>

            <div className="profile-stats">
                <div className="stat-block">
                    <h3>Role</h3>
                    <p>{profile.role}</p>
                </div>
                <div className="stat-block">
                    <h3>Email</h3>
                    <p>{profile.email}</p>
                </div>
                <div className="stat-block">
                    <h3>Rating</h3>
                    <p>{profile.rating}</p>
                </div>
                <div className="stat-block">
                    <h3>Solved Problems</h3>
                    <p>{profile.solvedCount}</p>
                </div>
            </div>

            <section className="profile-motivation">
                <p>
                    Keep pushing your limits! Each solved problem boosts your skills and rating.
                </p>
            </section>

            {/* Submission History Section */}
            <section className="submission-history">
                <h2>My Submissions</h2>
                {subs.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Problem</th>
                                <th>Language</th>
                                <th>Verdict</th>
                                <th>Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subs.map(s => (
                                <tr key={s._id}>
                                    <td>{s.problemId?.title || "Deleted Problem"}</td>
                                    <td>{s.language}</td>
                                    <td>{s.verdict}</td>
                                    <td>{new Date(s.submittedAt).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No submissions found.</p>
                )}
            </section>
        </section>
    );
}
