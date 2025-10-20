import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { FaSignOutAlt } from "react-icons/fa";
import { FaUserTie } from "react-icons/fa";

interface refer {
  id: string;
  name: string;
  place: string;
  aboutyou: string;
  resume: string;
  postedAt: string;
  jobId?: string;
  recruiterId?: string;
}
const Referals = () => {
  const { logout, user } = useAuth();
  const [refers, setrefers] = useState<refer[]>([]);
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    // Get all jobs object from localStorage
    const allrefers = JSON.parse(localStorage.getItem("refers") || "{}");
    const refersArray = Object.values(allrefers).flat() as refer[];

    // Flatten all users' jobs into a single array
    const filtered = refersArray.filter((r) => r.recruiterId === user?.id);
    setrefers(filtered);
  }, [user]);
  const navItems = [
    { path: "/jobs", label: "📋 Job Postings" },
    { path: "/Referals", label: "👥 Candidate Referrals" },
    { path: "/poststatus", label: "🧾 Candidate Status" },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white w-full">
      <nav className="bg-gray-800/80 backdrop-blur-md fixed w-full top-0 z-50 border-b border-gray-700 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Title */}
          <div className="flex items-center space-x-2">
            <FaUserTie className="text-blue-400 text-3xl" />
          </div>
          <span className="text-xl md:text-2xl font-semibold text-white tracking-wide font-style: italic">
            Recruiter Dashboard
          </span>

          {/* Desktop nav links */}
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

            {/* 3-dot dropdown */}
            <li>
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!isDropdownOpen)}
                  className="text-white hover:text-blue-400 px-3 py-2 rounded-full focus:outline-none"
                >
                  <FaUserCircle className="text-blue-400 text-3xl" />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-gray-800 text-white rounded-lg shadow-lg border border-gray-700 z-50">
                    {/* Mobile nav inside dropdown (hidden on desktop) */}
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
                        {user?.role || "Recruiter"}
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
            </li>
          </ul>

          {/* Mobile view — only ⋮ button */}
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

                {/* User Info */}
                <div className="px-4 py-2 border-b border-gray-700">
                  <div className="flex items-center space-x-2">
                    <FaUserCircle className="text-blue-400 text-3xl" />
                  </div>
                  <p className="font-semibold">{user?.name}</p>
                  <p className="text-sm text-gray-400">
                    {user?.role || "Recruiter"}
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

      <div className="mt-20 w-full max-w-3xl px-4">
        {refers.length === 0 ? (
          <p className="text-center text-xl mt-10">
            No referred candidates for your jobs yet.
          </p>
        ) : (
          refers.map((refer) => (
            <div
              key={refer.id}
              className="bg-gray-800 p-6 rounded-lg mb-4 shadow-md"
            >
              <h3 className="text-2xl font-bold">{refer.name}</h3>
              <p className="text-gray-300">
                <strong>Place:</strong> {refer.place}
              </p>
              <p className="text-gray-300">
                <strong>About:</strong> {refer.aboutyou}
              </p>
              <a className="text-gray-300" href={refer.resume}>
                {" "}
                <strong>Resume url:</strong> {refer.resume}
              </a>
              <p className="text-gray-400 text-sm">
                Posted on: {new Date(refer.postedAt).toLocaleString()}
              </p>
              
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Referals;
