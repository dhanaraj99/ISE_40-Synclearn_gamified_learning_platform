import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import PublicRoute from './components/PublicRoute';
import PrivateRoute from './components/PrivateRoute';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import MissionControlPage from './pages/MissionControlPage';
import AnnouncementsPage from './pages/AnnouncementsPage';
import ManageTeachersPage from './pages/ManageTeachersPage';
import ManageStudentsPage from './pages/ManageStudentsPage';

const App = () => {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />

        <Route path="/home" element={<PrivateRoute><HomePage /></PrivateRoute>} />
        <Route path="/missions" element={<PrivateRoute><MissionControlPage /></PrivateRoute>} />
        <Route path="/announcements" element={<PrivateRoute><AnnouncementsPage /></PrivateRoute>} />
        <Route path="/teachers" element={<PrivateRoute><ManageTeachersPage /></PrivateRoute>} />
        <Route path="/students" element={<PrivateRoute><ManageStudentsPage /></PrivateRoute>} />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;