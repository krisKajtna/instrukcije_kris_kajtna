import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TutorDashboard from './pages/TutorDashboard';
import StudentDashboard from './pages/StudentDashboard';

// Simple protected route wrapper
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

// Dashboard route
const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div>
      <header className="bg-white shadow p-4 mb-4 flex justify-between items-center">
        <h1 className="font-bold text-xl text-indigo-600">Instrukcije</h1>
        <div className="flex items-center gap-4">
          <span>{user?.firstName} ({user?.role})</span>
          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm font-medium">
            {user?.balance} tokens
          </span>
          <button onClick={logout} className="text-red-500 hover:text-red-700 text-sm">Logout</button>
        </div>
      </header>
      <main className="container mx-auto">
        {user?.role === 'TUTOR' ? <TutorDashboard /> : <StudentDashboard />}
      </main>
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
