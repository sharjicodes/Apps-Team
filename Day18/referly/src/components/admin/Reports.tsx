import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useLocation } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { FaSignOutAlt } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdAdminPanelSettings } from "react-icons/md";

//Typescript user interface
interface User {
  id: string;
  name: string;
  email: string;
  role: "Employee" | "Recruiter" | "Admin";
}

//function for user management
const Reports = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "Recruiter",
  });
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const navItems = [
    { path: "/reports", label: "🧮 Users Management" },
    { path: "/roles", label: "⚙️ Jobs Management" },
    { path: "/referalconversion", label: "📊 Referral Management" },
  ];

  // Load users from localStorage
  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
    setUsers(storedUsers);
  }, []);

  // Add a new recruiter
  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email || !newUser.password) {
      toast.error("Please fill all fields");
      return;
    }
    //for preventing duplicate users
    const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
    if (storedUsers.some((u: User) => u.email === newUser.email)) {
      toast.error("User with this email already exists!");
      return;
    }
    //creating new user recruite
    const userData = {
      id: crypto.randomUUID(),
      name: newUser.name,
      email: newUser.email,
      password: newUser.password,
      role: newUser.role as "Recruiter",
    };
    const updatedUsers = [...storedUsers, userData];
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
    setNewUser({ name: "", email: "", password: "", role: "Recruiter" });
    toast.success("New recruiter added");
    return;
  };

  const handleDeleteUser = (id: string) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    const updated = users.filter((u) => u.id !== id);
    localStorage.setItem("users", JSON.stringify(updated));
    setUsers(updated);
    toast.success("User deleted sucessfully!");
    return;
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-900 text-white w-full">
      <ToastContainer position="top-right" autoClose={2000} />
      {/* Navbar */}
      <nav className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
        <div className="max-w-screen-xl flex items-center justify-between mx-auto p-4">
          {/* Title */}
          <div className="flex items-center space-x-2">
            <MdAdminPanelSettings className="text-blue-400 text-3xl" />
          </div>
          <span className="text-xl sm:text-xl font-semibold text-gray-900 dark:text-white font-style: italic">
            Admin Dashboard
          </span>

          {/* Right - Desktop Links */}
          <ul className="hidden md:flex items-center space-x-6 text-sm md:text-base">
            {/* Links */}
            {navItems.map((item) => (
              <li key={item.path}>
                <a
                  href={item.path}
                  className={`transition ${
                    location.pathname === item.path
                      ? "text-blue-500 font-semibold border-b-2 border-blue-500 pb-1"
                      : "text-gray-700 dark:text-white hover:text-blue-500"
                  }`}
                >
                  {item.label}
                </a>
              </li>
            ))}

            {/* user menu */}
            <li className="relative">
              <button
                onClick={() => setDropdownOpen(!isDropdownOpen)}
                className="text-gray-700 dark:text-white hover:text-blue-500 px-3 py-2 rounded-full focus:outline-none"
                title="User Menu"
              >
                <div className="flex items-center space-x-2">
                  <FaUserCircle className="text-blue-400 text-3xl" />
                </div>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-gray-800 text-white rounded-lg shadow-lg border border-gray-700 z-50">
                  {/* User */}
                  <div className="px-4 py-2 border-b border-gray-700">
                    <p className="font-semibold">{user?.name}</p>
                    <p className="text-sm text-gray-400">
                      {user?.role || "Employee"}
                    </p>
                  </div>

                  {/* Logout */}
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      logout();
                    }}
                    className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-600 hover:text-white transition rounded-b-lg"
                  >
                    <FaSignOutAlt className="text-lg" />
                    Logout
                  </button>
                </div>
              )}
            </li>
          </ul>

          {/* Mobile  */}
          <div className="md:hidden relative">
            <button
              onClick={() => setDropdownOpen(!isDropdownOpen)}
              className="text-gray-700 dark:text-white hover:text-blue-500 text-2xl font-bold px-3 py-1 rounded-full"
              title="Menu"
            >
              ⋮
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-60 bg-gray-800 text-white rounded-lg shadow-lg border border-gray-700 z-50">
                {/* links */}
                <div className="flex flex-col p-2">
                  {navItems.map((item) => (
                    <a
                      key={item.path}
                      href={item.path}
                      onClick={() => setDropdownOpen(false)}
                      className={`block px-4 py-2 rounded-md transition ${
                        location.pathname === item.path
                          ? "bg-blue-700 text-white font-semibold"
                          : "hover:bg-gray-700"
                      }`}
                    >
                      {item.label}
                    </a>
                  ))}
                </div>

                <hr className="border-gray-700 my-1" />

                {/* User info */}
                <div className="px-4 py-2 text-sm border-b border-gray-700">
                  <div className="flex items-center space-x-2">
                    <FaUserCircle className="text-blue-400 text-3xl" />
                  </div>
                  <p className="font-semibold">{user?.name || "Admin"}</p>
                  <p className="text-gray-400">
                    {user?.role || "Administrator"}
                  </p>
                </div>

                {/* Logout button */}
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    logout();
                  }}
                  className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-600 hover:text-white transition rounded-b-lg"
                >
                  <FaSignOutAlt className="text-lg" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <h1 className="text-3xl font-bold mt-20 mb-6">🧮 Manage Users</h1>

      {/* Add Recruiter Form */}
      <form
        onSubmit={handleAddUser}
        className="bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md mb-8"
      >
        <h2 className="text-xl font-semibold mb-4">Add Recruiter</h2>
        <input
          type="text"
          placeholder="Name"
          className="w-full mb-3 p-2 rounded bg-gray-700 focus:outline-none"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 p-2 rounded bg-gray-700 focus:outline-none"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-3 p-2 rounded bg-gray-700 focus:outline-none"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 w-full py-2 rounded font-semibold"
        >
          Add Recruiter
        </button>
      </form>

      {/* User List */}
      <div className="w-full max-w-3xl overflow-x-auto">
        <h2 className="text-2xl font-semibold mb-4">All Users</h2>
        {users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <table className="w-full border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-gray-800 text-left">
                <th className="p-3 border-b border-gray-700">Name</th>
                <th className="p-3 border-b border-gray-700">Email</th>
                <th className="p-3 border-b border-gray-700">Role</th>
                <th className="p-3 border-b border-gray-700 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr
                  key={u.id}
                  className="border-b border-gray-800 hover:bg-gray-800/40"
                >
                  <td className="p-3">{u.name}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">{u.role}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleDeleteUser(u.id)}
                      className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Reports;
