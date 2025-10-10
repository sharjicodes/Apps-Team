import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const userData = JSON.parse(localStorage.getItem("user") || "null");

    if (userData && userData.email === email && userData.password === password) {
      alert(`Welcome back, ${userData.role}!`);
      navigate("/dashboard");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="w-full max-w-md bg-gray-900 p-8 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-4">Login</h2>

      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          className="p-2 rounded bg-gray-800 text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="p-2 rounded bg-gray-800 text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="bg-purple-500 hover:bg-purple-600 py-2 rounded font-semibold">
          Login
        </button>
      </form>

      <p className="text-gray-400 mt-4 text-sm text-center">
        Don’t have an account?{" "}
        <Link to="/register" className="text-purple-400 hover:underline">
          Register
        </Link>
      </p>
    </div>
  );
}
