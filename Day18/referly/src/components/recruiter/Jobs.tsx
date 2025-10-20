import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaUserCircle } from "react-icons/fa";
import { FaSignOutAlt } from "react-icons/fa";

const jobSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  department: z.string().min(1, { message: "Department is required" }),
  summary: z.string().min(10, "Summary must be at least 10 characters"),
  type: z.enum(["Full Time", "Internship", "Trainee"], {
    message: "Type required",
  }),
  location: z.string().min(1, { message: "Location is required" }),
  salary: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number().optional()
  ),
});

export type JobData = z.infer<typeof jobSchema>;

const Jobs = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [locationOptions, setLocationOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<JobData>({
    resolver: zodResolver(jobSchema),
  });

  const API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY;

  // Fetch cities dynamically from Geoapify
  const fetchLocations = async (inputValue: string) => {
    if (!inputValue) return;
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
          inputValue
        )}&limit=10&apiKey=${API_KEY}`
      );
      const data = await res.json();
      const options = (data.features || []).map((item: any) => ({
        label: item.properties.formatted,
        value: item.properties.formatted,
      }));
      setLocationOptions(options);
    } catch (err) {
      console.error("Error fetching locations:", err);
      setLocationOptions([]); // fallback empty
    } finally {
      setLoading(false);
    }
  };

  // Save job post to localStorage
  const onSubmit = (data: JobData) => {
    if (!user || !user.id) {
      toast.error("⚠️ User not found. Please log in again.");
      navigate("/login");
      return;
    }

    const allJobs = JSON.parse(localStorage.getItem("jobs") || "{}");
    const userJobs = allJobs[user.id] || [];

    const newJob = {
      id: crypto.randomUUID(),
      recruiterId: user.id,
      recruiterName: user.name || "Unknown Recruiter",
      recruiterEmail: user.email || "N/A",
      ...data,
      postedAt: new Date().toISOString(),
    };

    allJobs[user.id] = [...userJobs, newJob];
    localStorage.setItem("jobs", JSON.stringify(allJobs));

    toast.success("✅ Job successfully posted!", {
      position: "top-center",
      autoClose: 2000,
      theme: "colored",
    });

    setTimeout(() => navigate("/Dashboard"), 2500);
  };

  // Navbar links
  const navItems = [
    { path: "/jobs", label: "📋 Job Postings" },
    { path: "/Referals", label: "👥 Candidate Referrals" },
    { path: "/poststatus", label: "🧾 Candidate Status" },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white w-full">
      <ToastContainer />

      {/* ✅ Unified Navbar */}
      <nav className="bg-gray-800/80 backdrop-blur-md fixed w-full top-0 z-50 border-b border-gray-700 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Title */}
          <div className="flex items-center space-x-2">
            <FaUserCircle className="text-blue-400 text-3xl" />
          </div>
          <span className="text-xl md:text-2xl font-semibold text-white tracking-wide">
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
                  ⋮
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

      {/* ✅ Job Posting Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-gray-800 p-8 rounded-lg w-full max-w-sm shadow-lg mt-20"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Post a Job</h2>

        {/* Title */}
        <div className="mb-4">
          <label className="block mb-1">Title</label>
          <input
            type="text"
            placeholder="Enter the title"
            {...register("title")}
            className="w-full p-2 rounded bg-gray-700 focus:outline-none"
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title.message}</p>
          )}
        </div>

        {/* Department */}
        <div className="mb-4">
          <label className="block mb-1">Department</label>
          <input
            type="text"
            placeholder="Enter the department"
            {...register("department")}
            className="w-full p-2 rounded bg-gray-700 focus:outline-none"
          />
          {errors.department && (
            <p className="text-red-500 text-sm">{errors.department.message}</p>
          )}
        </div>

        {/* Summary */}
        <div className="mb-4">
          <label className="block mb-1">Summary</label>
          <input
            type="text"
            placeholder="Enter job details"
            {...register("summary")}
            className="w-full p-2 rounded bg-gray-700 focus:outline-none"
          />
          {errors.summary && (
            <p className="text-red-500 text-sm">{errors.summary.message}</p>
          )}
        </div>

        {/* Type */}
        <div className="mb-4">
          <label className="block mb-1">Type</label>
          <select
            {...register("type")}
            className="w-full p-2 rounded bg-gray-700 focus:outline-none"
            defaultValue=""
          >
            <option value="" disabled>
              Select Type
            </option>
            <option value="Full Time">Full Time</option>
            <option value="Internship">Internship</option>
            <option value="Trainee">Trainee</option>
          </select>
          {errors.type && (
            <p className="text-red-500 text-sm">{errors.type.message}</p>
          )}
        </div>

        {/* Location */}
        {/* Location (Geoapify Autocomplete) */}
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
          {errors.location && (
            <p className="text-red-500 text-sm">{errors.location.message}</p>
          )}
        </div>

        {/* Salary */}
        <div className="mb-4">
          <label className="block mb-1">Salary (CTC)</label>
          <input
            type="number"
            step="0.01"
            placeholder="Enter the salary"
            {...register("salary")}
            className="w-full p-2 rounded bg-gray-700 focus:outline-none"
          />
          {errors.salary && (
            <p className="text-red-500 text-sm">{errors.salary.message}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded font-semibold"
        >
          Post Job
        </button>
      </form>
    </div>
  );
};

export default Jobs;
