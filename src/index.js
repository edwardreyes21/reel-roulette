import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import LoginButton from './LoginButton';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
    <LoginButton />
    <App />
  </>
);
