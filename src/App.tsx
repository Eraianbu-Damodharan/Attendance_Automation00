import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AttendanceProvider } from './context/AttendanceContext';
import LoginPage from './components/auth/LoginPage';
import TeacherDashboard from './components/dashboards/TeacherDashboard';
import StudentDashboard from './components/dashboards/StudentDashboard';
import AdminDashboard from './components/dashboards/AdminDashboard';
import Header from './components/layout/Header';
import LoadingSpinner from './components/ui/LoadingSpinner';

function AppContent() {
  const { user, loading } = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Simulate app initialization
    const timer = setTimeout(() => setIsInitialized(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading || !isInitialized) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      <main className="pt-16">
        {user.role === 'teacher' && <TeacherDashboard />}
        {user.role === 'student' && <StudentDashboard />}
        {user.role === 'admin' && <AdminDashboard />}
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AttendanceProvider>
        <AppContent />
      </AttendanceProvider>
    </AuthProvider>
  );
}

export default App;