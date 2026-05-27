import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import PrivateRoute    from './components/PrivateRoute';
import Login           from './pages/Login';
import Register        from './pages/Register';
import Dashboard       from './pages/Dashboard';
import ProfileSetup    from './pages/ProfileSetup';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            <Route path="/"              element={<Navigate to="/dashboard" replace />} />
            <Route path="/login"         element={<Login />} />
            <Route path="/register"      element={<Register />} />
            <Route path="/profile/setup" element={<PrivateRoute><ProfileSetup isEdit={false} /></PrivateRoute>} />
            <Route path="/profile/edit"  element={<PrivateRoute><ProfileSetup isEdit={true}  /></PrivateRoute>} />
            <Route path="/dashboard"     element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="*"              element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
