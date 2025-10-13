import { useNavigate } from "react-router-dom";
import EmployeeDashboard from "../components/EmployeeDashboard";
import RecruiterDashboard from "../components/RecruiterDashboard";
import AdminDashboard from "../components/AdminDashboard";

export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!user) {
    navigate("/login");
    return null;
  }

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950 text-white">
      <div className="flex justify-between w-full max-w-2xl mb-6">
        <h1 className="text-3xl font-bold">Welcome, {user.role}</h1>
        
      </div>

      {renderDashboard()}
    </div>
  );
}

