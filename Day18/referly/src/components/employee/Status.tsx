import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { FaSignOutAlt } from "react-icons/fa";
import { FaUsers } from "react-icons/fa";

interface Refer {
  id: string;
  name: string;
  place: string;
  aboutyou?: string;
  resume?: string;
  postedAt: string;
  status: string;
  jobTitle?: string;
}

const Status = () => {
  const { logout, user } = useAuth();
  const [refers, setRefers] = useState<Refer[]>([]);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const navItems = [
    { path: "/joblistings", label: "📋 Job Listings" },
    { path: "/status", label: "🧾 Candidate Status" },
  ];

  useEffect(() => {
    if (!user || !user.id) return;

    const allRefers = JSON.parse(localStorage.getItem("refers") || "{}");
    const userRefers: Refer[] = allRefers[user.id] || [];
    setRefers(userRefers);
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center px-4 md:px-0 w-full">
      {/* Navbar */}
      <nav className="bg-gray-800/80 backdrop-blur-md fixed w-full top-0 z-50 border-b border-gray-700 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Left: Title */}
          <div className="flex items-center space-x-2">
            <FaUsers className="text-blue-400 text-3xl" />
          </div>
          <span className="text-xl md:text-2xl font-semibold text-white tracking-wide font-style: italic">
            Employee Dashboard
          </span>

          {/* Right: Desktop Nav Links */}
          <ul className="hidden md:flex items-center space-x-6 text-sm md:text-base">
            {navItems.map((item) => (
              <li key={item.path}>
                <a
                  href={item.path}
                  className={`transition ${
                    location.pathname === item.path
                      ? "text-blue-400 font-semibold border-b-2 border-blue-400 pb-1"
                      : "text-white hover:text-blue-400"
                  }`}
                >
                  {item.label}
                </a>
              </li>
            ))}

            {/* 3-dot menu */}
            <li>
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!isDropdownOpen)}
                  className="text-white hover:text-blue-400 px-3 py-2 rounded-full focus:outline-none"
                  title="User Menu"
                >
                  <FaUserCircle className="text-blue-400 text-3xl" />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-gray-800 text-white rounded-lg shadow-lg border border-gray-700 z-50">
                    {/* Mobile nav items (hidden on desktop) */}
                    <div className="flex flex-col md:hidden p-2 border-b border-gray-700">
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

                    {/* User info */}
                    <div className="px-4 py-2 border-b border-gray-700">
                      <div className="flex items-center space-x-2">
                        
                      </div>
                      <p className="font-semibold">{user?.name}</p>
                      <p className="text-sm text-gray-400">
                        {user?.role || "Employee"}
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
            </li>
          </ul>

          {/* Mobile view (only 3-dot visible) */}
          <div className="md:hidden relative">
            <button
              onClick={() => setDropdownOpen(!isDropdownOpen)}
              className="text-white hover:text-blue-400 px-3 py-2 rounded-full focus:outline-none"
              title="Menu"
            >
              ⋮
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-gray-800 text-white rounded-lg shadow-lg border border-gray-700 z-50">
                {/* All nav links */}
                <div className="flex flex-col p-2 border-b border-gray-700">
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

                {/* User info */}
                <div className="px-4 py-2 border-b border-gray-700">
                  <div className="flex items-center space-x-2">
                    <FaUserCircle className="text-blue-400 text-3xl" />
                  </div>
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
          </div>
        </div>
      </nav>

      {/* Referrals Display */}
      <div className="mt-24 w-full max-w-3xl px-2 md:px-0">
        {refers.length === 0 ? (
          <p className="text-center text-xl mt-10 text-gray-400">
            No referrals submitted yet.
          </p>
        ) : (
          refers.map((refer) => (
            <div
              key={refer.id}
              className="bg-gray-800 p-6 rounded-2xl mb-4 shadow-lg hover:shadow-xl transition"
            >
              <h3 className="text-2xl font-bold mb-2 text-blue-400">
                {refer.name}
              </h3>
              {refer.jobTitle && (
                <p className="text-gray-300 mb-1">
                  <strong>Job:</strong> {refer.jobTitle}
                </p>
              )}
              <p className="text-gray-300 mb-1">
                <strong>Place:</strong> {refer.place}
              </p>
              {refer.aboutyou && (
                <p className="text-gray-300 mb-1">
                  <strong>About:</strong> {refer.aboutyou}
                </p>
              )}
              {refer.resume && (
                <a
                  href={refer.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 underline mb-1 inline-block"
                >
                  View Resume
                </a>
              )}
              <p className="text-gray-300 mb-1">
                <strong>Status:</strong> {refer.status || "Pending"}
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Posted on: {new Date(refer.postedAt).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Status;
