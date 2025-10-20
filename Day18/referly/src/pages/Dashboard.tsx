import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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
        navigate("/reports");
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
        <h1 className="text-6xl font-bold animate-pulse font-style: italic text-center">
          Hi, Welcome
          <br /> {user.name} 👋
        </h1>
      </div>
    );
  }
}
