import React, { createContext, useState, useContext, useEffect } from "react";

type UserRole = "admin" | "student" | null;

interface AuthContextType {
  isLoggedIn: boolean;
  userRole: UserRole;
  login: (role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<UserRole>(null);

  // Load user role from localStorage on initial render
  useEffect(() => {
    const storedRole = localStorage.getItem("userRole") as UserRole;
    if (storedRole) {
      setIsLoggedIn(true);
      setUserRole(storedRole);
    }
  }, []);

  // Handle login
  const login = (token: string, role: UserRole) => {
  if (token && role) {
    setIsLoggedIn(true);
    setUserRole(role);
    localStorage.setItem("authToken", token); // Store the token separately
    localStorage.setItem("userRole", role);  // Store the role explicitly
  }
};


  // Handle logout
  const logout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    localStorage.removeItem("userRole");
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};