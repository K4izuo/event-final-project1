import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import './index.css';
import { ProtectedRoute } from './auth/ProtectedRoute';
import LoginForm from './admin/admin_login';
import Dashboard from './main/dashboard';
import AdminRegister from './admin/admin_register';

const App = () => {
  return (
    <AuthProvider>
      <Router basename="/event-final-project1">
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/register" element={<AdminRegister />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;