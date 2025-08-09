// src/pages/ProblemSolve.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import CodeEditor from "./CodeEditor";
import { useParams } from "react-router-dom";
import "./ProblemSolve.css";

export default function ProblemSolve() {
    const { id } = useParams();
    const [problem, setProblem] = useState(null);
    const [code, setCode] = useState("");
    const [result, setResult] = useState(null);
    const [language, setLanguage] = useState("cpp");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        axios.get(`http://localhost:5001/api/company/company-questions/${id}`)
            .then(res => {
                setProblem(res.data.problemId); // problem details are inside problemId
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching problem:", err);
                alert("Problem not found.");
                setLoading(false);
            });
    }, [id]);

    const submitCode = async () => {
        const token = localStorage.getItem("token");
        console.log("Token being sent:", token);
        if (!token) {
            alert("No auth token found. Please login.");
            return;
        }

        try {
            const res = await axios.post(
                "http://localhost:5001/api/submissions",
                {
                    problemId: problem._id,
                    code,
                    language,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setResult(res.data);
        } catch (error) {
            console.error("Submission error:", error);
            alert("Error submitting code.");
        }
    };

    if (loading) return <p className="loading-text">Loading Problem...</p>;
    if (!problem) return <p>Problem not found.</p>;

    return (
        <div className="solve-layout">
            <div className="problem-panel glass">
                <h1>{problem.title || problem.question}</h1>
                <div className="meta">
                    <span className={`difficulty ${problem.difficulty?.toLowerCase()}`}>
                        {problem.difficulty || "Unknown"}
                    </span>
                    {problem.tags && (
                        <span className="tags">{problem.tags.join(" | ")}</span>
                    )}
                </div>

                <div className="section">
                    <h3>Description</h3>
                    <div dangerouslySetInnerHTML={{ __html: problem.description || "No description available." }} />
                </div>

                <div className="section">
                    <h3>Input Format</h3>
                    <pre>{problem.inputFormat || problem.input || "N/A"}</pre>
                </div>

                <div className="section">
                    <h3>Output Format</h3>
                    <pre>{problem.outputFormat || problem.output || "N/A"}</pre>
                </div>
            </div>

            <div className="editor-panel glass">
                <div className="lang-select">
                    <label>Select Language: </label>
                    <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                        <option value="cpp">C++</option>
                        <option value="c">C</option>
                        <option value="java">Java</option>
                        <option value="python">Python</option>
                    </select>
                </div>

                <CodeEditor code={code} setCode={setCode} language={language} />

                <button className="submit-btn" onClick={submitCode}>
                    🚀 Submit Code
                </button>

                {result && (
                    <div className="verdict">
                        <h4>
                            Verdict:{" "}
                            <span className={`verdict-text ${result.verdict?.toLowerCase()}`}>
                                {result.verdict}
                            </span>
                        </h4>
                        {result.details && <pre>{result.details}</pre>}
                    </div>
                )}
            </div>
        </div>
    );
}
