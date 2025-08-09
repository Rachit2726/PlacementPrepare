import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const NavBar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role'); // ✅ get role from localStorage

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role'); // ✅ clear role too
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <h2 style={styles.logo}>
        <Link to="/" style={styles.link}>CodeChamp</Link>
      </h2>

      <div style={styles.links}>
        <Link to="/companies" style={styles.link}>Problems</Link>
        <Link to="/leaderboard" style={styles.link}>Leaderboard</Link>

        {/* ✅ Only logged-in users can see Profile */}
        {token && <Link to="/profile" style={styles.link}>Profile</Link>}

        {/* ✅ Show Admin Dashboard if role is 'admin' */}
        {token && role === 'admin' && (
          <Link to="/admin/dashboard" style={styles.link}>Admin Dashboard</Link>
        )}

        {token ? (
          <button onClick={handleLogout} style={styles.btn}>Logout</button>
        ) : (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.link}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 30px',
    backgroundColor: '#282c34',
    alignItems: 'center'
  },
  logo: {
    fontWeight: 'bold',
    fontSize: '1.5rem'
  },
  links: {
    display: 'flex',
    gap: '20px',
    alignItems: 'center',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '1rem',
  },
  btn: {
    background: 'transparent',
    border: '1px solid white',
    color: 'white',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
  }
};

export default NavBar;
