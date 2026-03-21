import React from 'react';
import Navbar from './Navbar';

const Summary = () => {
  return (
    <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ padding: '3rem 40px', maxWidth: '1400px', width: '100%', margin: '0 auto', flex: 1 }}>
        <h1 style={{ color: '#A7ABDE' }}>AI Summary</h1>
        <p>Your AI generated summaries.</p>
      </div>
    </div>
  );
};

export default Summary;
