
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface User {
  name: string;
  email: string;
  password: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  register: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  
  useEffect(() => {
    const storedUser = localStorage.getItem("loggedInUser");
    
const hardcodedAdmin = {
  name: "Admin",
  email: "admin@gmail.com",
  password: "admin1", 
  role: "Admin",
};


if (!localStorage.getItem("adminUser")) {
  localStorage.setItem("adminUser", JSON.stringify(hardcodedAdmin));
}


    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  useEffect(() => {
    if (user) localStorage.setItem("loggedInUser", JSON.stringify(user));
    else localStorage.removeItem("loggedInUser");
  }, [user]);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem("loggedInUser", JSON.stringify(userData));
    navigate("/dashboard"); 
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("loggedInUser");
    navigate("/login");
  };

  const register = (userData: User) => {
    localStorage.setItem("user", JSON.stringify(userData)); // save registered user
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
