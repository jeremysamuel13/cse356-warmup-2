import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.hydrateRoot(
  document.getElementById('root') as HTMLElement, <React.StrictMode>
  <App isHome={true} name={"default"} date={new Date()} />
</React.StrictMode>
);

