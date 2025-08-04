import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MySessions from './pages/MySessions';
import SessionEditor from './pages/SessionEditor';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading">
        <div>Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="App">
      {isAuthenticated && <Navbar />}
      <Routes>
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/my-sessions" element={
          <ProtectedRoute>
            <MySessions />
          </ProtectedRoute>
        } />
        <Route path="/editor" element={
          <ProtectedRoute>
            <SessionEditor />
          </ProtectedRoute>
        } />
        <Route path="/editor/:id" element={
          <ProtectedRoute>
            <SessionEditor />
          </ProtectedRoute>
        } />
        <Route path="/" element={
          <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
        } />
      </Routes>
    </div>
  );
}

export default App; 