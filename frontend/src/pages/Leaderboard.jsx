import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Leaderboard.css';

export default function Leaderboard() {
    const [data, setData] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5001/api/leaderboard/global')
            .then(res => setData(res.data))
            .catch(() => setData([]));
    }, []);

    return (
        <section className="leaderboard-page">
            <header className="leaderboard-header">
                <h1>Global Leaderboard</h1>
                <p>Top coders ranked by rating</p>
            </header>

            <table className="leaderboard-table">
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Name</th>
                        <th>Rating</th>
                    </tr>
                </thead>
                <tbody>
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan="3" className="loading-text">Loading leaderboard...</td>
                        </tr>
                    ) : (
                        data.map((entry, i) => (
                            <tr key={entry._id || i}>
                                <td>{i + 1}</td>
                                <td className="username">{entry.username}</td>
                                <td>{entry.rating}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </section>
    );
}
