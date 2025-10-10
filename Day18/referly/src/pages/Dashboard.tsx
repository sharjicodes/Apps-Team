import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950 text-white">
      <h1 className="text-3xl font-bold mb-4">Welcome, {user.role}!</h1>

      <p className="text-gray-400 mb-6">
        You are logged in as <span className="text-purple-400">{user.email}</span>
      </p>

      <button
        onClick={() => {
          localStorage.removeItem("user");
          navigate("/login");
        }}
        className="bg-red-500 hover:bg-red-600 py-2 px-4 rounded"
      >
        Logout
      </button>
    </div>
  );
}
