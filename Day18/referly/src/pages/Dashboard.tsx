
import { useAuth } from "../context/AuthContext";

import EmployeeDashboard from "../components/EmployeeDashboard";
import RecruiterDashboard from "../components/RecruiterDashboard";
import AdminDashboard from "../components/AdminDashboard";

export default function Dashboard() {
  
  const { user } = useAuth();

  
  

  // 🧠 Choose dashboard based on role
  const renderDashboard = () => {
    if (!user) return null;

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

  if (!user) return null; // prevents rendering before redirect

  return (
    
        
<div className="min-h-screen bg-cyan-500 text-white flex items-center justify-center">
       
      
{renderDashboard()}
<h1 className="text-9xl font-bold">Hi Welcome<br></br> {user.role}👋</h1>
</div>
  );
}
