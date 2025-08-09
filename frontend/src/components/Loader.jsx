import React from 'react';

const Loader = () => {
  return (
    <div style={styles.loader}>
      <p>Loading...</p>
    </div>
  );
};

const styles = {
  loader: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '60vh',
    fontSize: '20px',
  },
};

export default Loader;
