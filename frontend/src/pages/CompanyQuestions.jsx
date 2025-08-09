// src/pages/CompanyQuestions.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import './CompanyQuestions.css';


export default function CompanyQuestions() {
  const { companyName } = useParams();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`https://placementprepare.onrender.com/api/company/${companyName}/questions`)
      .then((res) => {
        setQuestions(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("API Error:", err);
        setLoading(false);
      });
  }, [companyName]);

  if (loading) return <h2>Loading...</h2>;

  if (!questions.length) return <h2>No questions found for {companyName}</h2>;

  return (
    <div className="company-questions-container">
      <h1>Questions for {companyName}</h1>
      <ul>
        {questions.map((q) => (
          <li key={q._id}>
            <Link to={`/problems/${q._id}`}>
              {(q.question || q.title || "Untitled Question")} (Frequency: {q.frequency})
            </Link>
          </li>

        ))}
      </ul>
    </div>
  );
}
