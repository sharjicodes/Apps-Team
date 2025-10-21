import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";
import Select from "react-select";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaUserCircle } from "react-icons/fa";
import { FaSignOutAlt } from "react-icons/fa";
import { FaUsers } from "react-icons/fa";

//zod validation schema for candidate referal form
const referSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  place: z.string().min(1, { message: "Location is required" }),
  aboutyou: z.string().min(10, "Summary must be at least 10 characters"),
  resume: z.string().url(),
});

//typescript type for form data
type referData = z.infer<typeof referSchema>;

const PostReferals = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [locationOptions, setLocationOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [selectedJob, setSelectedJob] = useState<{
    jobId: string;
    jobTitle: string;
    recruiterId?: string;
    recruiterName?: string;
  } | null>(null);

  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const navItems = [
    { path: "/joblistings", label: "📋 Job Listings" },
    { path: "/postReferals", label: "👥 Candidate Referrals" },
    { path: "/status", label: "🧾 Candidate Status" },
  ];

  useEffect(() => {
    const job = localStorage.getItem("selectedJob");
    if (job) setSelectedJob(JSON.parse(job));
  }, []);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<referData>({
    resolver: zodResolver(referSchema),//connect validation with zod schema
  });

  const API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY;

  const onSubmit = (data: referData) => {
    if (!user || !user.id) {
      toast.error("⚠️ User not found. Please log in again.");
      navigate("/login");
      return;
    }

    const allRefers = JSON.parse(localStorage.getItem("refers") || "{}");
    const userRefers = allRefers[user.id] || [];

    //object forr new referal
    const newRefer = {
      id: crypto.randomUUID(),
      ...data,
      jobId: selectedJob?.jobId || "N/A",
      jobTitle: selectedJob?.jobTitle || "Unassigned Job",
      recruiterId: selectedJob?.recruiterId || "",
      recruiterName: selectedJob?.recruiterName || "",
      referredBy: user.name,
      postedAt: new Date().toISOString(),
      status: "Pending",
    };

    allRefers[user.id] = [...userRefers, newRefer];
    localStorage.setItem("refers", JSON.stringify(allRefers));

    toast.success("✅ Referral successfully posted!");
    localStorage.removeItem("selectedJob");
    setTimeout(() => navigate("/status"), 1500);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center px-4 md:px-0 w-full">
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

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-gray-800 p-8 rounded-2xl w-full max-w-md shadow-lg mt-24"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-400">
          Refer Candidate
        </h2>

        {selectedJob && (
          <p className="mb-4 text-center text-sm text-gray-400">
            Referring for <strong>{selectedJob.jobTitle}</strong>
          </p>
        )}

        {/* Name */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Name</label>
          <input
            type="text"
            placeholder="Enter the Name"
            {...register("name")}
            className="w-full p-2 rounded-lg bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        
        {/* Place */}
        <div className="mb-4">
          <label className="block mb-1">Place</label>
          <Controller
            name="place"
            control={control}
            render={({ field }) => (
              <Select
                placeholder={loading ? "Loading..." : "Search location..."}
                isSearchable
                options={locationOptions}
                value={
                  field.value
                    ? { label: field.value, value: field.value }
                    : null
                }
                onInputChange={(inputValue) => {
                  if (!inputValue) return;
                  setLoading(true);
                  fetch(
                    `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
                      inputValue
                    )}&limit=10&apiKey=${API_KEY}`
                  )
                    .then((res) => res.json())
                    .then((data) => {
                      const options = data.features.map((item: any) => ({
                        label: item.properties.formatted,
                        value: item.properties.formatted,
                      }));
                      setLocationOptions(options);
                    })
                    .catch(console.error)
                    .finally(() => setLoading(false));
                }}
                onChange={(selectedOption) =>
                  field.onChange(selectedOption?.value || "")
                }
                className="text-black"
              />
            )}
          />
          {errors.place && (
            <p className="text-red-500 text-sm">{errors.place.message}</p>
          )}
        </div>

        {/* About You */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Details</label>
          <input
            type="text"
            placeholder="Enter about yourself"
            {...register("aboutyou")}
            className="w-full p-2 rounded-lg bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.aboutyou && (
            <p className="text-red-500 text-sm mt-1">
              {errors.aboutyou.message}
            </p>
          )}
        </div>

        {/* Resume */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Resume URL</label>
          <input
            type="text"
            placeholder="Enter the URL to your resume"
            {...register("resume")}
            className="w-full p-2 rounded-lg bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.resume && (
            <p className="text-red-500 text-sm mt-1">{errors.resume.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg font-semibold mt-3 transition"
        >
          Post Referral
        </button>
      </form>
    </div>
  );
};

export default PostReferals;
