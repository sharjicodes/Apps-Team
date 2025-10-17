import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";

interface Refer {
  id: string;
  name: string;
  place: string;
  aboutyou: string;
  resume: string;
  postedAt: string;
  status?: string; 
}

const PostStatus = () => {
  const { logout } = useAuth();
  const [refers, setRefers] = useState<Refer[]>([]);

  useEffect(() => {
    const allRefers = JSON.parse(localStorage.getItem("refers") || "{}");
    const refersArray: Refer[] = Object.values(allRefers).flat();
    setRefers(refersArray);
  }, []);

  // Function to handle status change
  const handleStatusChange = (id: string, newStatus: string) => {
    setRefers((prev) =>
      prev.map((ref) => (ref.id === id ? { ...ref, status: newStatus } : ref))
    );
  };

  // Save all updates back to localStorage
  const handleSubmit = () => {
    const allRefers = JSON.parse(localStorage.getItem("refers") || "{}");

    // Flatten all arrays, find and update status in matching object
    const updated = Object.fromEntries(
      Object.entries(allRefers).map(([userId, userRefers]: [string, any]) => {
        const updatedList = userRefers.map((ref: Refer) => {
          const updatedRef = refers.find((r) => r.id === ref.id);
          return updatedRef || ref;
        });
        return [userId, updatedList];
      })
    );

    localStorage.setItem("refers", JSON.stringify(updated));
    alert("✅ Candidate statuses updated successfully!");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white w-full">
      <nav className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <a className="flex items-center space-x-3 rtl:space-x-reverse">
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              Recruiter Dashboard
            </span>
          </a>
          <div
            className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
            id="navbar-sticky"
          >
            <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              <li>
                <a
                  href="/jobs"
                  className="block py-2 px-3 text-white bg-blue-700 rounded-sm md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500"
                  aria-current="page"
                >
                  📋 Job Postings
                </a>
              </li>
              <li>
                <a
                  href="/Referals"
                  className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                >
                  👥 Candidate Referrals
                </a>
              </li>
              <li>
                <a
                  href="/poststatus"
                  className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                >
                  🧾 Candidate Status{" "}
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

      {/* Candidate List */}
      <div className="mt-24 w-full max-w-3xl px-4">
        {refers.length === 0 ? (
          <p className="text-center text-xl mt-10">No candidates referred yet.</p>
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
              <a
                className="text-blue-400 underline"
                href={refer.resume}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Resume
              </a>
              <p className="text-gray-400 text-sm mt-2">
                Posted on: {new Date(refer.postedAt).toLocaleString()}
              </p>

              {/* Status Dropdown */}
              <div className="mt-3">
                <label className="block text-sm text-gray-300 mb-1">
                  Status:
                </label>
                <select
                  value={refer.status || ""}
                  onChange={(e) => handleStatusChange(refer.id, e.target.value)}
                  className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none"
                >
                  <option value="">Select status</option>
                  <option value="Interviewing">Interviewing</option>
                  <option value="Offer">Offer</option>
                  <option value="Hired">Hired</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>
          ))
        )}

        {refers.length > 0 && (
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 hover:bg-blue-700 py-2 mt-4 rounded font-semibold"
          >
            Save All Status Updates
          </button>
        )}
      </div>
    </div>
  );
};

export default PostStatus;
