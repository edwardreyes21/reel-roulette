import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import App from './App';
import Watchlist from './Watchlist';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
        <Route path="*" element={<App />} />
        <Route path="/watchlist" element={<Watchlist />} />
    </Routes>
  </BrowserRouter>
);
