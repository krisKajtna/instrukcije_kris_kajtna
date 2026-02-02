import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TutorDashboard from './pages/TutorDashboard';
import StudentDashboard from './pages/StudentDashboard';
import ProfilePage from './pages/ProfilePage';
import WalletPage from './pages/WalletPage';
import ReservationsPage from './pages/ReservationsPage';

// Simple protected route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F7]">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
        <div className="w-full mx-auto px-6 h-16 grid grid-cols-3 items-center">
          <div className="flex justify-start">
            <Link to="/dashboard" className="font-semibold text-xl tracking-tight text-[#1D1D1F] hover:opacity-80 transition-opacity">
              Instrukcije
            </Link>
          </div>

          <nav className="flex justify-center items-center gap-10 text-sm font-medium">
            <Link to="/dashboard" className="text-[#1D1D1F] hover:text-[#0071E3] transition-colors">Find Tutors</Link>
            <Link to="/reservations" className="text-[#86868B] hover:text-[#1D1D1F] transition-colors">Reservations</Link>
          </nav>

          <div className="flex justify-end items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-semibold text-[#1D1D1F]">{user?.firstName}</div>
                <div className="text-[10px] text-[#86868B] uppercase tracking-wide font-medium">{user?.role}</div>
              </div>

              <Link to="/wallet" className="bg-[#F5F5F7] hover:bg-[#E8E8ED] transition-colors px-4 py-2 rounded-full flex items-center gap-2 group">
                <span className="text-sm font-medium text-[#1D1D1F]">{user?.balance}</span>
                <span className="w-2 h-2 rounded-full bg-[#0071E3] group-hover:animate-pulse"></span>
              </Link>

              <div className="relative group">
                <Link to="/profile">
                  <div className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden ring-2 ring-transparent group-hover:ring-[#0071E3]/20 transition-all shadow-sm">
                    {user?.avatarUrl ? (
                      <img src={`http://localhost:3000${user.avatarUrl}`} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-500">
                        {user?.firstName?.[0]}
                      </div>
                    )}
                  </div>
                </Link>
              </div>
            </div>

            <button
              onClick={logout}
              className="text-[#86868B] hover:text-red-500 transition-colors ml-2"
              title="Sign out"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            </button>
          </div>
        </div>
      </header>
      <main className="flex-1 w-full mx-auto">
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
          <Route path="/wallet" element={
            <ProtectedRoute>
              <Layout>
                <WalletPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/reservations" element={
            <ProtectedRoute>
              <Layout>
                <ReservationsPage />
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
