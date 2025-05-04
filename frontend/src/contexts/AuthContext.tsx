
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { User, Vendor, ApiResponse, ErrorResponse } from '@/types';
import { toast } from 'sonner';

type AuthUser = {
  user: User | Vendor | null;
  token: string | null;
  role: 'user' | 'vendor' | null;
}

interface AuthContextType {
  authUser: AuthUser;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, role: 'user' | 'vendor') => Promise<void>;
  register: (data: any, role: 'user' | 'vendor') => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authUser, setAuthUser] = useState<AuthUser>({
    user: null,
    token: null,
    role: null
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for token in localStorage on initial load
    const token = localStorage.getItem('token');
    const userString = localStorage.getItem('user');
    const role = localStorage.getItem('userRole') as 'user' | 'vendor' | null;
    
    if (token && userString && role) {
      try {
        const user = JSON.parse(userString);
        setAuthUser({ user, token, role });
      } catch (error) {
        // Invalid stored data, clear it
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('userRole');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, role: 'user' | 'vendor') => {
    setIsLoading(true);
    try {
      const endpoint = role === 'user' ? '/users/login' : '/vendors/login';
      const response = await fetch(`http://localhost:3002/api${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json() as ApiResponse<User | Vendor> | ErrorResponse;
      
      if (!data.success) {
        toast.error('Login failed: ' + (data as ErrorResponse).error);
        return;
      }

      const { token, data: userData } = data as ApiResponse<User | Vendor>;
      
      // Save to localStorage
      localStorage.setItem('token', token!);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('userRole', role);
      
      setAuthUser({ 
        user: userData, 
        token: token!, 
        role 
      });
      
      toast.success('Login successful!');
      
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An error occurred during login.');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: any, role: 'user' | 'vendor') => {
    setIsLoading(true);
    try {
      const endpoint = role === 'user' ? '/users/register' : '/vendors/register';
      const reqBody = role === 'user' ? { user: userData } : { vendor: userData };
      
      const response = await fetch(`http://localhost:3002/api${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reqBody)
      });

      const data = await response.json() as ApiResponse<User | Vendor> | ErrorResponse;
      
      if (!data.success) {
        toast.error('Registration failed: ' + (data as ErrorResponse).error);
        return;
      }
      
      const { token, data: newUserData } = data as ApiResponse<User | Vendor>;

      // Save to localStorage
      localStorage.setItem('token', token!);
      localStorage.setItem('user', JSON.stringify(newUserData));
      localStorage.setItem('userRole', role);
      
      setAuthUser({ 
        user: newUserData, 
        token: token!, 
        role 
      });
      
      toast.success('Registration successful!');
      
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('An error occurred during registration.');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    
    // Reset auth state
    setAuthUser({
      user: null,
      token: null,
      role: null
    });
    
    toast.info('You have been logged out.');
  };

  const value = {
    authUser,
    isAuthenticated: !!authUser.token,
    isLoading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
