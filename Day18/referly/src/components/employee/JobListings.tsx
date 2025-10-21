import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaUserCircle } from "react-icons/fa";
import { FaSignOutAlt } from "react-icons/fa";
import { FaUsers } from "react-icons/fa";

//Typescript Job interface
interface Job {
  id: string;
  title: string;
  department: string;
  summary: string;
  type: "Full Time" | "Internship" | "Trainee";
  location: string;
  salary?: number;
  postedAt: string;
  recruiterId?: string;
}

//function for joblisting
const JobListings = () => {
  const { logout, user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const navigate = useNavigate();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const navItems = [
    { path: "/joblistings", label: "📋 Job Listings" },
    { path: "/status", label: "🧾 Candidate Status" },
  ];

  useEffect(() => {
    const allJobs = JSON.parse(localStorage.getItem("jobs") || "{}");
    const jobsArray = Object.values(allJobs).flat() as Job[];
    setJobs(jobsArray);
  }, []);

  const handleRefer = (job: Job) => {
    localStorage.setItem(
      "selectedJob",
      JSON.stringify({
        jobId: job.id,
        jobTitle: job.title,
        recruiterId: job.recruiterId || "",
      })
    );
    toast.info(`You’re referring a candidate for ${job.title}`);
    setTimeout(() => navigate("/postReferals"), 1000);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center w-full">
      <ToastContainer position="top-right" autoClose={2000} />

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
                  <div className="flex items-center space-x-2">
                    <FaUserCircle className="text-blue-400 text-3xl" />
                  </div>
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
                      <div className="flex items-center space-x-2"></div>
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

      {/* Job List */}
      <div className="mt-24 w-full max-w-5xl px-4 pb-10">
        {jobs.length === 0 ? (
          <p className="text-center text-lg md:text-xl mt-10 text-gray-300">
            No jobs posted yet.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transform transition-all duration-300 p-6 flex flex-col justify-between border border-gray-700"
              >
                <div>
                  <h3 className="text-xl font-bold mb-2 text-blue-400">
                    {job.title}
                  </h3>
                  <p className="text-gray-300 text-sm mb-1">
                    <strong>Department:</strong> {job.department}
                  </p>
                  <p className="text-gray-300 text-sm mb-1">
                    <strong>Type:</strong> {job.type}
                  </p>
                  <p className="text-gray-300 text-sm mb-1">
                    <strong>Location:</strong> {job.location}
                  </p>
                  {job.salary && (
                    <p className="text-gray-300 text-sm mb-1">
                      <strong>Salary:</strong> ₹{job.salary}
                    </p>
                  )}
                  <p className="text-gray-400 text-xs mt-2">
                    Posted on: {new Date(job.postedAt).toLocaleString()}
                  </p>
                </div>

                <div className="mt-4">
                  <button
                    onClick={() => handleRefer(job)}
                    className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg text-sm font-semibold transition"
                  >
                    Refer Candidate
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobListings;
