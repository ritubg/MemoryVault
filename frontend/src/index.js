import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import logger from './services/logger';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Capture web vitals in the structured log
reportWebVitals((metric) => {
  logger.info('WebVitals', metric.name, { value: metric.value, rating: metric.rating });
});
