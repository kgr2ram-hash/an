import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.exp * 1000 > Date.now()) {
          setAdmin(payload);
        } else {
          logout();
        }
      } catch {
        logout();
      }
    }
  }, [token]);

  function login(tokenStr, adminData) {
    localStorage.setItem('token', tokenStr);
    setToken(tokenStr);
    setAdmin(adminData);
  }

  function logout() {
    localStorage.removeItem('token');
    setToken(null);
    setAdmin(null);
  }

  return (
    <AuthContext.Provider value={{ admin, token, login, logout, isAuthenticated: !!admin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
