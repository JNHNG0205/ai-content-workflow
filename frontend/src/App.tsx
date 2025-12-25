import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { WriterDashboard } from './pages/WriterDashboard';
import { ReviewerDashboard } from './pages/ReviewerDashboard';
import { useState } from 'react';

function AppContent() {
  const { user, loading } = useAuth();
  const [showRegister, setShowRegister] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return showRegister ? (
      <div>
        <Register />
        <div className="text-center mt-4">
          <button
            onClick={() => setShowRegister(false)}
            className="text-blue-600 hover:underline"
          >
            Already have an account? Login
          </button>
        </div>
      </div>
    ) : (
      <div>
        <Login />
        <div className="text-center mt-4">
          <button
            onClick={() => setShowRegister(true)}
            className="text-blue-600 hover:underline"
          >
            Don't have an account? Register
          </button>
        </div>
      </div>
    );
  }

  if (user.role === 'REVIEWER' || user.role === 'ADMIN') {
    return <ReviewerDashboard />;
  }

  return <WriterDashboard />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
