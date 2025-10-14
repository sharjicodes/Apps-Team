import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Jobs from "./services/Jobs";

function AppRoutes() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-cyan-500 text-white flex items-center justify-center">
      
      <Routes>
        <Route path="/" element={!user ? <Navigate to="/login" /> : <Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/jobs" element={<Jobs/>} />
        <Route
          path="/dashboard"
          element={user ? <Dashboard /> : <Navigate to="/login" />}
        />
      </Routes>
      
    </div>
    
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
