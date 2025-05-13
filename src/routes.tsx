import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { Stake } from './pages/Stake';
import ReferralPage from './pages/Referral';
import { Profile } from './pages/Profile';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/stake" element={<Stake />} />
      <Route path="/referral" element={<ReferralPage />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}; 