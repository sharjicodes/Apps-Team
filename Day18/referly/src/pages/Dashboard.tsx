import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import EmployeeDashboard from "../components/EmployeeDashboard";
import RecruiterDashboard from "../components/RecruiterDashboard";
import AdminDashboard from "../components/AdminDashboard";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    if (!user) return;

    const timer = setTimeout(() => {
      setShowSplash(false);

      // Navigate based on user role
      if (user.role === "Recruiter") {
        navigate("/jobs");
      } else if (user.role === "Employee") {
        navigate("/joblistings");
      } else if (user.role === "Admin") {
        navigate("/admin");
      } else {
        navigate("/login");
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [user, navigate]);

  if (!user) return null; // avoid render before login

  // Splash Screen
  if (showSplash) {
    return (
      <div className="min-h-screen bg-cyan-500 text-white flex items-center justify-center transition-opacity duration-500">
        <h1 className="text-6xl font-bold animate-pulse text-center">
          Hi, Welcome
          <br /> {user.role} 👋
        </h1>
      </div>
    );
  }

  // Once splash ends, render role-specific dashboard
  const renderDashboard = () => {
    switch (user.role) {
      case "Employee":
        return <EmployeeDashboard />;
      case "Recruiter":
        return <RecruiterDashboard />;
      case "Admin":
        return <AdminDashboard />;
      default:
        return <div>Invalid Role</div>;
    }
  };

  return (
    <div className="min-h-screen bg-cyan-500 text-white flex items-center justify-center">
      {renderDashboard()}
    </div>
  );
}
