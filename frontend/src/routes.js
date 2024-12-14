import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PersonalInfo from './pages/PersonalInfo';
import ManagePassengerInfo from './pages/ManagePassengerInfo';
import ManageBills from './pages/ManageBills';
import MA_Staff from './pages/MA_Staff';
import MA_Customer from './pages/MA_Customer';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/personal-info" element={<PersonalInfo />} />
      <Route path="/manage-passenger-info" element={<ManagePassengerInfo />} />
      <Route path="/manage-bills" element={<ManageBills />} />
      <Route path="/manage-staff" element={<MA_Staff />} />
      <Route path="/manage-customer" element={<MA_Customer />} />
    </Routes>
  );
};

export default AppRoutes;
