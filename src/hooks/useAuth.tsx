import { useState, useEffect, createContext, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  deviceId: string | null;
  login: (token: string, deviceId: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(sessionStorage.getItem('auth_token'));
  const [deviceId, setDeviceId] = useState<string | null>(sessionStorage.getItem('user_device_id'));
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!token);

  const login = (newToken: string, newDeviceId: string) => {
    sessionStorage.setItem('auth_token', newToken);
    sessionStorage.setItem('user_device_id', newDeviceId);
    setToken(newToken);
    setDeviceId(newDeviceId);
    setIsAuthenticated(true);
  };

  const logout = () => {
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('user_device_id');
    setToken(null);
    setDeviceId(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, deviceId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};