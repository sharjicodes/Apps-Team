
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';


interface User {
  id?: string;
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
  id: uuidv4(),
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
  // Get existing users array from localStorage
  const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");

  // Check if email already exists
  const userExists = existingUsers.some((user: User) => user.email === userData.email);
  if (userExists) {
    alert("User already registered with this email!");
    return;
  }
   const newUser = { ...userData, id: uuidv4() };

  // Add new user to array
  const updatedUsers = [...existingUsers, newUser];

  //  Save updated array back to localStorage
  localStorage.setItem("users", JSON.stringify(updatedUsers));
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
