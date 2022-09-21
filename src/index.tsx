import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.hydrateRoot(
  document.getElementById('root') as HTMLElement, <React.StrictMode>
  <App {...(window as any).__APP_INITIAL_STATE__} />
</React.StrictMode>
);

