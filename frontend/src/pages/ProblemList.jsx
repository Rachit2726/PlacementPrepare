import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function ProblemList() {
    const [problems, setProblems] = useState([]);
    const { company } = useParams(); // grabs company from route

    useEffect(() => {
        axios.get('/api/problems')
            .then(res => setProblems(res.data))
            .catch(err => console.error(err));
    }, []);

    // Apply filtering
    const filteredProblems = company && company !== 'All'
        ? problems.filter(problem =>
            problem.tags && problem.tags.includes(company)
        )
        : problems;

    return (
        <div>
            <h2>{company === 'All' || !company ? 'All Problems' : `${company} Problems`}</h2>
            <ul>
                {filteredProblems.map(problem => (
                    <li key={problem._id}>
                        <strong>{problem.title}</strong> - Tags: {problem.tags.join(', ')}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ProblemList;
