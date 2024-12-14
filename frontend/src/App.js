// src/App.js
import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import PersonalInfo from './pages/PersonalInfo';
// import ManagePassengerInfo from './pages/ManagePassengerInfo';
// import ManageBills from './pages/ManageBills';
// import MA_Customer from './pages/MA_Customer';
// import MA_Staff from './pages/MA_Staff';
import AppRoutes from './routes'
import {BrowserRouter} from 'react-router-dom';


const App = () => {


  return (
    <BrowserRouter>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header /> {/* Header sẽ quản lý Sidebar */}
        <div style={{ flexGrow: 1 }}>
          <AppRoutes /> {/* Nội dung các trang */}
        </div>
        <Footer />
      </div>
    </BrowserRouter>

    

  );
};

export default App;
