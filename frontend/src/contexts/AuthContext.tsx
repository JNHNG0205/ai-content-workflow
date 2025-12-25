import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '@/lib/api';

interface User {
  id: string;
  email: string;
  role: 'WRITER' | 'REVIEWER' | 'ADMIN';
}

interface AuthContextType {
  user: User | null;
  sessionId: string | null;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  register: (email: string, password: string, role?: string) => Promise<{ error?: string }>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedSessionId = api.getSessionId();
    if (storedSessionId) {
      setSessionId(storedSessionId);
      // In a real app, you'd fetch user data here
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await api.login(email, password);
    if (response.data) {
      const userRole = response.data.user.role as 'WRITER' | 'REVIEWER' | 'ADMIN';
      setUser({
        ...response.data.user,
        role: userRole,
      });
      setSessionId(response.data.sessionId);
      return {};
    }
    return { error: response.error || 'Login failed' };
  };

  const register = async (email: string, password: string, role?: string) => {
    const response = await api.register(email, password, role);
    if (response.data) {
      // Auto-login after registration
      return await login(email, password);
    }
    return { error: response.error || 'Registration failed' };
  };

  const logout = () => {
    api.logout();
    setUser(null);
    setSessionId(null);
  };

  return (
    <AuthContext.Provider value={{ user, sessionId, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

