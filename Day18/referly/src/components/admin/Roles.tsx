import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import Select from "react-select";
import { FaUserCircle } from "react-icons/fa";
import { FaSignOutAlt } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdAdminPanelSettings } from "react-icons/md";

//Typescript job interface
interface Job {
  id: string;
  title: string;
  department: string;
  summary: string;
  type: string;
  location: string;
  salary: number;
  noOfOpenPos: number;
  postedAt: string;
  recruiterName: string;
  recruiterId: string;
}

//function for job management
const Roles = () => {
  const { user, logout } = useAuth();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [newJob, setNewJob] = useState({
    title: "",
    department: "",
    summary: "",
    type: "",
    location: "",
    salary: "",
    noOfOpenPos: "",
  });
  
  //geoapify location result save
  const [locationOptions, setLocationOptions] = useState<
    { label: string; value: string }[]
  >([]);

  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const navItems = [
    { path: "/reports", label: "🧮 Users Management" },
    { path: "/roles", label: "⚙️ Jobs Management" },
    { path: "/referalconversion", label: "📊 Referral Management" },
  ];

  const API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY;

  useEffect(() => {
    const allJobsObj = JSON.parse(
      localStorage.getItem("jobs") || "{}"
    ) as Record<string, Job[]>;
    const allJobs: Job[] = Object.values(allJobsObj).flat();

    setJobs(allJobs);
  }, []);

  const saveJobsToLocalStorage = (updatedJobs: Job[]) => {
    const grouped: Record<string, Job[]> = {};
    updatedJobs.forEach((job) => {
      if (!grouped[job.recruiterId]) grouped[job.recruiterId] = [];
      grouped[job.recruiterId].push(job);
    });
    localStorage.setItem("jobs", JSON.stringify(grouped));
    setJobs(updatedJobs);
  };

  //location fetching
  const handleLocationInput = (inputValue: string) => {
    if (!inputValue) return;

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
      .catch(console.error);
  };

  const handleAddJob = (e: React.FormEvent) => {
    e.preventDefault();

    const jobData = editingJob || newJob;

    if (
      !jobData.title ||
      !jobData.department ||
      !jobData.location ||
      !jobData.salary ||
      !jobData.summary ||
      !jobData.type ||
      !jobData.noOfOpenPos
    ) {
      toast.error("Please fill all fields");
      return;
    }
    //update job and editing job
    if (editingJob) {
      const updatedJobs = jobs.map((job) =>
        job.id === editingJob.id ? editingJob : job
      );
      setJobs(updatedJobs);
      localStorage.setItem("jobs", JSON.stringify(updatedJobs));
      setEditingJob(null);
      toast.success("Job edited succesfully");
      return;
    } else {
      const newJobData: Job = {
        ...newJob,
        id: Date.now().toString(),
        postedAt: new Date().toISOString(),
        recruiterName: user?.name || "Admin",
        recruiterId: user?.id || "admin",
        salary: Number(newJob.salary),
        noOfOpenPos: Number(newJob.noOfOpenPos),
      };

      const updatedJobs = [...jobs, newJobData];
      setJobs(updatedJobs);
      localStorage.setItem("jobs", JSON.stringify(updatedJobs));
      setNewJob({
        title: "",
        department: "",
        location: "",
        salary: "",
        summary: "",
        type: "Full Time",
        noOfOpenPos: "",
      });
    }
  };

  const handleEdit = (job: Job) => setEditingJob(job);

  const handleDelete = (id: string) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    const updated = jobs.filter((j) => j.id !== id);
    saveJobsToLocalStorage(updated);
    toast.success("Job deleted sucessfully!");
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

          {/* Desktop Links */}
          <ul className="hidden md:flex items-center space-x-6 text-sm md:text-base">
            {/* Links */}
            {navItems.map((item) => (
              <li key={item.path}>
               <Link
                  to={item.path}
                  className={`transition ${
                    location.pathname === item.path
                      ? "text-blue-400 font-semibold border-b-2 border-blue-400 pb-1"
                      : "text-white hover:text-blue-400"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}

            {/*  user menu */}
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
                  {/* User Info */}
                  <div className="px-4 py-2 border-b border-gray-700">
                    <p className="font-semibold">{user?.name}</p>
                    <p className="text-sm text-gray-400">
                      {user?.role || "Employee"}
                    </p>
                  </div>

                  {/* Logout Button */}
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

          {/* Mobile menu */}
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
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setDropdownOpen(false)}
                      className={`block px-4 py-2 rounded-md transition ${
                        location.pathname === item.path
                          ? "bg-blue-700 text-white font-semibold"
                          : "hover:bg-gray-700"
                      }`}
                    >
                      {item.label}
                    </Link>
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

      <h1 className="text-3xl font-bold mt-20 mb-6">⚙️ Manage Jobs</h1>

      {/* Job Form */}
      <form
        onSubmit={handleAddJob}
        className="bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-lg mb-10"
      >
        <h2 className="text-xl font-semibold mb-4">
          {editingJob ? "Edit Job" : "Post New Job (Admin)"}
        </h2>
        <input
          type="text"
          placeholder="Title"
          className="w-full mb-3 p-2 rounded bg-gray-700 focus:outline-none"
          value={editingJob?.title || newJob.title}
          onChange={(e) =>
            editingJob
              ? setEditingJob({ ...editingJob, title: e.target.value })
              : setNewJob({ ...newJob, title: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Department"
          className="w-full mb-3 p-2 rounded bg-gray-700 focus:outline-none"
          value={editingJob?.department || newJob.department}
          onChange={(e) =>
            editingJob
              ? setEditingJob({ ...editingJob, department: e.target.value })
              : setNewJob({ ...newJob, department: e.target.value })
          }
        />
        <textarea
          placeholder="Summary"
          className="w-full mb-3 p-2 rounded bg-gray-700 focus:outline-none"
          value={editingJob?.summary || newJob.summary}
          onChange={(e) =>
            editingJob
              ? setEditingJob({ ...editingJob, summary: e.target.value })
              : setNewJob({ ...newJob, summary: e.target.value })
          }
        />

        {/* Job Type */}
        <select
          className="w-full mb-3 p-2 rounded bg-gray-700 text-white focus:outline-none"
          value={editingJob?.type || newJob.type}
          onChange={(e) =>
            editingJob
              ? setEditingJob({ ...editingJob, type: e.target.value })
              : setNewJob({ ...newJob, type: e.target.value })
          }
        >
          <option value="" disabled>
            Select Type
          </option>
          <option value="Full Time">Full Time</option>
          <option value="Trainee">Trainee</option>
          <option value="Internship">Internship</option>
        </select>

        {/* Location  */}
        <Select
          placeholder={"Search location..."}
          isSearchable
          options={locationOptions}
          value={
            editingJob
              ? editingJob.location
                ? { label: editingJob.location, value: editingJob.location }
                : null
              : newJob.location
              ? { label: newJob.location, value: newJob.location }
              : null
          }
          onInputChange={handleLocationInput} // use the synchronous handler
          onChange={(selectedOption) =>
            editingJob
              ? setEditingJob({
                  ...editingJob,
                  location: selectedOption?.value || "",
                })
              : setNewJob({ ...newJob, location: selectedOption?.value || "" })
          }
          className="mb-3 text-black"
        />

        {/* salary */}

        <input
          type="number"
          placeholder="Salary"
          min="0"
          required
          className="w-full mb-3 p-2 rounded bg-gray-700 focus:outline-none"
          value={editingJob?.salary || newJob.salary}
          onChange={(e) =>
            editingJob
              ? setEditingJob({ ...editingJob, salary: Number(e.target.value) })
              : setNewJob({ ...newJob, salary: e.target.value })
          }
        />

        {/* noOfOpenPos */}

        <input
          type="number"
          placeholder="No Of Open Position"
          min="0"
          required
          className="w-full mb-3 p-2 rounded bg-gray-700 focus:outline-none"
          value={editingJob?.noOfOpenPos || newJob.noOfOpenPos}
          onChange={(e) =>
            editingJob
              ? setEditingJob({
                  ...editingJob,
                  noOfOpenPos: Number(e.target.value),
                })
              : setNewJob({ ...newJob, noOfOpenPos: e.target.value })
          }
        />

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 w-full py-2 rounded font-semibold"
        >
          {editingJob ? "Save Job" : "Add Job"}
        </button>
      </form>

      {/* Job Listings */}
      <div className="w-full max-w-4xl px-10">
        <h2 className="text-2xl font-semibold mb-4">All Posted Jobs</h2>
        {jobs.length === 0 ? (
          <p>No jobs found.</p>
        ) : (
          jobs.map((job) => (
            <div
              key={job.id}
              className="bg-gray-800 p-5 rounded-lg mb-4 shadow-md"
            >
              <h3 className="text-xl font-bold">{job.title}</h3>
              <p className="text-gray-300">
                <strong>Recruiter:</strong> {job.recruiterName}
              </p>
              <p>
                <strong>Title:</strong> {job.title}
              </p>

              <p>
                <strong>Department:</strong> {job.department}
              </p>
              <p>
                <strong>Summary:</strong> {job.summary}
              </p>
              <p>
                <strong>Type:</strong> {job.type}
              </p>

              <p>
                <strong>Location:</strong> {job.location}
              </p>
              <p>
                <strong>Salary:</strong> ₹{job.salary}
              </p>
              <p>
                <strong>No Of Open Position:</strong> {job.noOfOpenPos}
              </p>
              <p className="text-sm text-gray-400">
                Posted at: {new Date(job.postedAt).toLocaleString()}
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => handleEdit(job)}
                  className="bg-yellow-500 hover:bg-yellow-600 px-3 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(job.id)}
                  className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Roles;
