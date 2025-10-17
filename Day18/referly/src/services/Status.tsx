import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";

interface Refer {
  id: string;
  name: string;
  place: string;
  aboutyou: string;
  resume: string;
  postedAt: string;
  status: string;
}

const Status = () => {
  const { logout, user } = useAuth(); // ✅ get logged-in user
  const [refers, setRefers] = useState<Refer[]>([]);

  useEffect(() => {
    if (!user || !user.id) return; // safety check

    // ✅ Get all referrals from localStorage
    const allRefers = JSON.parse(localStorage.getItem("refers") || "{}");

    // ✅ Get only this user's referrals by their unique ID
    const userRefers: Refer[] = allRefers[user.id] || [];

    // console.log("Current user:", user.id);
    // console.log("User-specific referrals:", userRefers);

    setRefers(userRefers);
  }, [user]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white w-full">
      {/* Navbar */}
      <nav className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <a className="flex items-center space-x-3 rtl:space-x-reverse">
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              Employee Dashboard
            </span>
          </a>
          <div
            className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
            id="navbar-sticky"
          >
            <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              <li>
                <a
                  href="/joblistings"
                  className="block py-2 px-3 text-white bg-blue-700 rounded-sm md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500"
                >
                  📋 Job Listings
                </a>
              </li>
              <li>
                <a
                  href="/postReferals"
                  className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white"
                >
                  👥 Candidate Referrals
                </a>
              </li>
              <li>
                <a
                  href="/status"
                  className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white"
                >
                  🧾 Candidate Status
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

      {/* Referrals Display */}
      <div className="mt-20 w-full max-w-3xl px-4">
        {refers.length === 0 ? (
          <p className="text-center text-xl mt-10">No referrals submitted yet.</p>
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
                <strong>Status:</strong> {refer.status || "Pending"}
              </p>
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

export default Status;
