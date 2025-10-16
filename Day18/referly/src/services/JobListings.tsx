import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";

interface Job {
  id: string;
  title: string;
  department: string;
  summary: string;
  type: string;
  location: string;
  salary?: number;
  postedAt: string;
}

const JobListings = () => {
  const { logout } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    // Get all jobs object from localStorage
    const allJobs = JSON.parse(localStorage.getItem("jobs") || "{}");

    // Flatten all users' jobs into a single array
    const jobsArray: Job[] = Object.values(allJobs).flat();

    setJobs(jobsArray);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white w-full">
      <nav className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            Employee Dashboard
          </span>
          <div className="hidden md:flex md:w-auto md:order-1">
            <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium md:flex-row md:mt-0">
              <li>
                <a
                  href="/JobListings"
                  className="block py-2 px-3 text-white bg-blue-700 rounded-sm md:bg-transparent md:text-blue-700 md:p-0"
                >
                  📋 Job Listings
                </a>
              </li>
              <li>
                <a
                  href="/postReferals"
                  className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:text-blue-700 md:p-0 dark:text-white"
                >
                  👥 Refer Candidates
                </a>
              </li>
              <li>
                <a
                  href="/Status"
                  className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:text-blue-700 md:p-0 dark:text-white"
                >
                  🧾 Referal Status
                </a>
              </li>
              <li>
                <button
                  onClick={logout}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded font-semibold"
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="mt-20 w-full max-w-3xl px-4">
        {jobs.length === 0 ? (
          <p className="text-center text-xl mt-10">No jobs posted yet.</p>
        ) : (
          jobs.map((job) => (
            <div
              key={job.id}
              className="bg-gray-800 p-6 rounded-lg mb-4 shadow-md"
            >
              <h3 className="text-2xl font-bold">{job.title}</h3>
              <p className="text-gray-300">
                <strong>Department:</strong> {job.department}
              </p>
              <p className="text-gray-300">
                <strong>Summary:</strong> {job.summary}
              </p>
              <p className="text-gray-300">
                <strong>Type:</strong> {job.type}
              </p>
              <p className="text-gray-300">
                <strong>Location:</strong> {job.location}
              </p>
              {job.salary && (
                <p className="text-gray-300">
                  <strong>Salary:</strong> {job.salary}
                </p>
              )}
              <p className="text-gray-400 text-sm">
                Posted on: {new Date(job.postedAt).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default JobListings;
