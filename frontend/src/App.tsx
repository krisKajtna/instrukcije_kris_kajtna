import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TutorDashboard from './pages/TutorDashboard';
import StudentDashboard from './pages/StudentDashboard';
import ProfilePage from './pages/ProfilePage';

// Simple protected route wrapper
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAuth();
  return (
    <div>
      <header className="bg-white shadow p-4 mb-4 flex justify-between items-center">
        <Link to="/dashboard" className="font-bold text-xl text-indigo-600">Instrukcije</Link>
        <div className="flex items-center gap-4">
          <span>{user?.firstName} ({user?.role})</span>
          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm font-medium">
            {user?.balance} tokens
          </span>
          <Link to="/profile" className="text-gray-600 hover:text-indigo-600 font-medium">Profile</Link>
          <button onClick={logout} className="text-red-500 hover:text-red-700 text-sm">Logout</button>
        </div>
      </header>
      <main className="container mx-auto">
        {children}
      </main>
    </div>
  );
};

// Dashboard route wrapper
const Dashboard = () => {
  const { user } = useAuth();
  return (
    <Layout>
      {user?.role === 'TUTOR' ? <TutorDashboard /> : <StudentDashboard />}
    </Layout>
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
          <Route path="/profile" element={
            <ProtectedRoute>
              <Layout>
                <ProfilePage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
