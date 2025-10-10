import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("employee");
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    const newUser = { email, password, role };
    localStorage.setItem("user", JSON.stringify(newUser));

    alert("Account created successfully!");
    navigate("/login");
  };

  return (
    <div className="w-full max-w-md bg-gray-900 p-8 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-4">Register</h2>

      <form onSubmit={handleRegister} className="flex flex-col gap-4">
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

        <select
          className="p-2 rounded bg-gray-800 text-white"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="employee">Employee</option>
          <option value="recruiter">Recruiter</option>
          <option value="admin">Admin</option>
        </select>

        <button className="bg-green-500 hover:bg-green-600 py-2 rounded font-semibold">
          Register
        </button>
      </form>

      <p className="text-gray-400 mt-4 text-sm text-center">
        Already have an account?{" "}
        <Link to="/login" className="text-green-400 hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
}
