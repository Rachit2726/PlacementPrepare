import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

export default function AdminDashboard() {
    const [stats, setStats] = useState({ totalUsers: 0, totalProblems: 0, totalCompanyQuestions: 0 });
    const [problem, setProblem] = useState({
        title: '', description: '', inputFormat: '',
        outputFormat: '', constraints: '', difficulty: '',
        tags: '', sampleIO: [], testCases: [], company: ''
    });

    const [sampleInput, setSampleInput] = useState('');
    const [sampleOutput, setSampleOutput] = useState('');
    const [testInput, setTestInput] = useState('');
    const [testOutput, setTestOutput] = useState('');

    // Fetch dashboard stats
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get('http://localhost:5001/api/admin/dashboard-stats', {
                    headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
                });
                setStats(res.data);
            } catch {
                alert("Failed to load stats");
            }
        };
        fetchStats();
    }, []);

    const addSample = () => {
        setProblem(prev => ({
            ...prev,
            sampleIO: [...prev.sampleIO, { input: sampleInput, output: sampleOutput }]
        }));
        setSampleInput(''); setSampleOutput('');
    };

    const addTestcase = () => {
        setProblem(prev => ({
            ...prev,
            testCases: [...prev.testCases, { input: testInput, output: testOutput }]
        }));
        setTestInput(''); setTestOutput('');
    };

    const handleSubmit = async () => {
        const payload = {
            ...problem,
            tags: problem.tags.split(',').map(t => t.trim())
        };
        try {
            await axios.post('https://placementprepare.onrender.com/api/company/admin/add-problem', payload, {
                headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
            });
            alert("Problem Added");
        } catch {
            alert("Failed to add");
        }
    };

    return (
        <div className="admin-dashboard">
            <h1>Admin Dashboard</h1>

            {/* Stats Section */}
            <div className="stats-container">
                <div className="stat-card">
                    <h3>Total Users</h3>
                    <p>{stats.totalUsers}</p>
                </div>
                <div className="stat-card">
                    <h3>Total Problems</h3>
                    <p>{stats.totalProblems}</p>
                </div>
            </div>

            {/* Add Problem Form */}
            <div className="form-container">
                <h2>Add New Problem</h2>
                <input placeholder="Title" onChange={e => setProblem({ ...problem, title: e.target.value })} />
                <input
                    placeholder="Company Name"
                    onChange={e => setProblem({ ...problem, company: e.target.value })} />
                <textarea placeholder="Description" onChange={e => setProblem({ ...problem, description: e.target.value })} />
                <input placeholder="Input Format" onChange={e => setProblem({ ...problem, inputFormat: e.target.value })} />
                <input placeholder="Output Format" onChange={e => setProblem({ ...problem, outputFormat: e.target.value })} />
                <input placeholder="Constraints" onChange={e => setProblem({ ...problem, constraints: e.target.value })} />
                <input placeholder="Difficulty (Easy/Medium/Hard)" onChange={e => setProblem({ ...problem, difficulty: e.target.value })} />
                <input placeholder="Tags (comma separated)" onChange={e => setProblem({ ...problem, tags: e.target.value })} />

                <div className="io-section">
                    <h4>Sample IO</h4>
                    <input placeholder="Sample Input" value={sampleInput} onChange={e => setSampleInput(e.target.value)} />
                    <input placeholder="Sample Output" value={sampleOutput} onChange={e => setSampleOutput(e.target.value)} />
                    <button onClick={addSample}>Add Sample</button>
                </div>

                <div className="io-section">
                    <h4>Testcases</h4>
                    <input placeholder="Testcase Input" value={testInput} onChange={e => setTestInput(e.target.value)} />
                    <input placeholder="Testcase Output" value={testOutput} onChange={e => setTestOutput(e.target.value)} />
                    <button onClick={addTestcase}>Add Testcase</button>
                </div>

                <button className="submit-btn" onClick={handleSubmit}>Submit Problem</button>
            </div>
        </div>
    );
}
