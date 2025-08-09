import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function SubmissionHistory() {
    const [subs, setSubs] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchSubs = async () => {
        try {
            const res = await axios.get('https://placementprepare.onrender.com/api/history', {
                headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
            });
            setSubs(res.data);
        } catch (err) {
            console.error("Failed to load submissions", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubs();
    }, []);

    if (loading) return <p>Loading submissions...</p>;

    return (
        <div>
            <h2>My Submissions</h2>
            {subs.length === 0 ? (
                <p>No submissions found.</p>
            ) : (
                <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse' }}>
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
                                <td>{s.problemId?.title || "N/A"}</td>
                                <td>{s.language}</td>
                                <td style={{ color: s.verdict === "Accepted" ? "green" : "red" }}>
                                    {s.verdict}
                                </td>
                                <td>{new Date(s.submittedAt).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
