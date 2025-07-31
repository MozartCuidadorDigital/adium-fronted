import React from 'react';
import ReactDOM from 'react-dom/client';
import TotemApp from './TotemApp';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('totem-root'));

root.render(
  <React.StrictMode>
    <TotemApp />
  </React.StrictMode>
); 