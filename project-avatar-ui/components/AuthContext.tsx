// 'use client';
// import React, { createContext, ReactNode, useContext, useState } from 'react';

// interface AuthState {
//   isAuthenticated: boolean;
// }

// interface AuthContextType {
//   auth: AuthState;
//   login: () => void;
//   logout: () => void;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
//   const [auth, setAuth] = useState<AuthState>({ isAuthenticated: false });

//   // Define the login and logout functions to modify the auth state
//   const login = () => setAuth({ isAuthenticated: true });
//   const logout = () => {
//     localStorage.removeItem('token'); // Remove the token from local storage
//     setAuth({ isAuthenticated: false });
//   };

//   return (
//     <AuthContext.Provider value={{ auth, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };


'use client'; // Ensures the context runs client-side

import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface AuthState {
  isAuthenticated: boolean;
}

interface AuthContextType {
  auth: AuthState;
  login: () => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [auth, setAuth] = useState<AuthState>({ isAuthenticated: false });
  const [isLoading, setIsLoading] = useState(true); // To check auth status on initial load

  // Login function to set auth state and store token
  const login = () => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuth({ isAuthenticated: true });
    }
  };

  // Logout function to clear auth state and remove token
  const logout = () => {
    localStorage.removeItem('token');
    setAuth({ isAuthenticated: false });
  };

  // Check token on initial load to persist authentication across refreshes
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuth({ isAuthenticated: true });
    }
    setIsLoading(false); // Stop loading after checking the token
  }, []);

  return (
    <AuthContext.Provider value={{ auth, login, logout, isLoading }}>
      {!isLoading && children} {/* Prevents rendering while loading */}
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
