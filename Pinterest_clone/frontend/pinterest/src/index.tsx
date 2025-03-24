import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter
import './index.css';
import "./styles/header.css"
import App from './App.tsx';
import "./styles/profile.css"
import "./styles/login.css"
import "./styles/home.css"
import "./styles/postDetail.css"
import "./styles/CreatePin.css"



const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
