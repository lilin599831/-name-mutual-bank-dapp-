import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { Stake } from './pages/Stake';
import Referral from './pages/Referral';
import { Profile } from './pages/Profile';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/stake" element={<Stake />} />
      <Route path="/referral" element={<Referral />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}; 