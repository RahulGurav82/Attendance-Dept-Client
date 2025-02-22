import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import DepartmentDashboard from './components/DepartmentDashboard';

// Protected Route wrapper for admin
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Protected Route wrapper for department
const ProtectedDepartmentRoute = ({ children }) => {
  const token = localStorage.getItem('deptToken');
  
  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Dashboard />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/department-dashboard"
          element={
            <ProtectedDepartmentRoute>
              <DepartmentDashboard />
            </ProtectedDepartmentRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;