import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const windowAny: any = window
const initialState = windowAny.__APP_INITIAL_STATE__;

const root = ReactDOM.hydrateRoot(
  document.getElementById('root') as HTMLElement, <React.StrictMode>
  <App isHome={initialState.isHome} name={initialState.name} date={initialState.date} />
</React.StrictMode>
);

