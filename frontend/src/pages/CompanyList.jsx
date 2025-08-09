import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './CompanyList.css';

const CompanyList = () => {
    const [companies, setCompanies] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetch("http://localhost:5001/api/company/companies")
            .then((res) => res.json())
            .then((data) => setCompanies(data))
            .catch((err) => console.error("Error fetching companies:", err));
    }, []);

    // Filter companies based on search term (case-insensitive)
    const filteredCompanies = companies.filter(company =>
        company.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="company-list-container">
            <h2>Companies</h2>
            <input
                type="text"
                placeholder="Search companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="company-search-input"
            />
            <ul>
                {filteredCompanies.length > 0 ? (
                    filteredCompanies.map(company => (
                        <li
                            key={company}
                            onClick={() => navigate(`/companies/${encodeURIComponent(company)}`)}
                        >
                            {company}
                        </li>
                    ))
                ) : (
                    <li style={{ padding: '15px', color: '#ccc' }}>No companies found.</li>
                )}
            </ul>
        </div>
    );
};

export default CompanyList;
