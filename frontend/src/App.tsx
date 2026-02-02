import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Simple protected route wrapper
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

// Dashboard placeholder
const Dashboard = () => {
  const { user, logout } = useAuth();
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Welcome, {user?.firstName}!</h1>
      <p>Role: {user?.role}</p>
      <p>Balance: {user?.balance} tokens</p>
      <button onClick={logout} className="mt-4 px-4 py-2 bg-red-500 text-white rounded">Logout</button>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
