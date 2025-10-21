import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

import { FaUserCircle } from "react-icons/fa";
import { FaSignOutAlt } from "react-icons/fa";
import { MdAdminPanelSettings } from "react-icons/md";

// Typescript interface for referals
interface Referral {
  id: string;
  name: string; 
  referredBy: string; 
  place: string;
  aboutyou: string;
  resume: string;
  status?: string; 
  recruiterId?: string; 
  recruiterName?: string; 
  postedAt: string;
}

const statusOptions = ["Pending", "Interviewing", "Offer", "Hired", "Rejected"];

//function for referral management
export default function ReferralConversion() {
  const { user, logout } = useAuth();

  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Referral>>({});
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const navItems = [
    { path: "/reports", label: "🧮 Users Management" },
    { path: "/roles", label: "⚙️ Jobs Management" },
    { path: "/referalconversion", label: "📊 Referal Management" },
  ];

  useEffect(() => {
    const allReferralsObj = JSON.parse(
      localStorage.getItem("refers") || "{}"
    ) as Record<string, Referral[]>;

    const allReferrals: Referral[] = Object.values(allReferralsObj).flat();

    const processedReferrals = allReferrals.map((r) => ({
      ...r,
      status: r.status || "Pending",
      recruiterName: r.recruiterName || "Not Assigned",
    }));

    setReferrals(processedReferrals);
  }, []);

  const handleChange = (id: string, field: keyof Referral, value: any) => {
    setFormData({ ...formData, [field]: value, id });
  };

  const handleSave = () => {
    if (!formData.id) return;

    const updatedReferrals = referrals.map((r) =>
      r.id === formData.id
        ? {
            ...r,
            ...formData,
            recruiterName: user?.name || r.recruiterName,
            recruiterId: user?.id || r.recruiterId,
          }
        : r
    );

    setReferrals(updatedReferrals);

    const allReferralsObj = JSON.parse(localStorage.getItem("refers") || "{}");
    for (const key in allReferralsObj) {
      allReferralsObj[key] = allReferralsObj[key].map((r: Referral) =>
        r.id === formData.id
          ? {
              ...r,
              ...formData,
              recruiterName: user?.name || r.recruiterName,
              recruiterId: user?.id || r.recruiterId,
            }
          : r
      );
    }
    localStorage.setItem("refers", JSON.stringify(allReferralsObj));

    setEditId(null);
    setFormData({});
  };

  const handleDelete = (id: string) => {
    if (!window.confirm("Are you sure you want to delete this referral?"))
      return;

    const updatedReferrals = referrals.filter((r) => r.id !== id);
    setReferrals(updatedReferrals);

    const allReferralsObj = JSON.parse(localStorage.getItem("refers") || "{}");
    for (const key in allReferralsObj) {
      allReferralsObj[key] = allReferralsObj[key].filter(
        (r: Referral) => r.id !== id
      );
    }
    localStorage.setItem("refers", JSON.stringify(allReferralsObj));
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-900 text-white w-full">
      {/* Navbar */}
      <nav className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
        <div className="max-w-screen-xl flex items-center justify-between mx-auto p-4">
          {/*  Title */}
          <div className="flex items-center space-x-2">
            <MdAdminPanelSettings className="text-blue-400 text-3xl" />
          </div>
          <span className="text-xl sm:text-xl font-semibold  text-gray-900 dark:text-white font-style: italic">
            Admin Dashboard
          </span>

          {/*  Links */}
          <ul className="hidden md:flex items-center space-x-6 text-sm md:text-base">
            {/* Nav Links */}
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
      {/* Title */}
      <h1 className="text-2xl sm:text-3xl font-bold mt-20 mb-6 text-center">
        📊 Referral Management
      </h1>

      {/* Referral */}
      <div className="w-full max-w-5xl px-4 sm:px-6 md:px-8">
        {referrals.length === 0 ? (
          <p className="text-center text-xl mt-10">No referrals found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {referrals.map((ref) => (
              <div
                key={ref.id}
                className="bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition duration-200 flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-blue-400 mb-2">
                    {ref.name}
                  </h3>
                  <p className="text-gray-300 text-sm sm:text-base">
                    <strong>Referred By:</strong> {ref.referredBy}
                  </p>
                  <p className="text-gray-300 text-sm sm:text-base">
                    <strong>Recruiter:</strong> {ref.recruiterName}
                  </p>

                  <p className="text-gray-300 text-sm sm:text-base mt-2">
                    <strong>Place:</strong>{" "}
                    {editId === ref.id ? (
                      <input
                        type="text"
                        value={formData.place || ref.place}
                        onChange={(e) =>
                          handleChange(ref.id, "place", e.target.value)
                        }
                        className="bg-gray-700 p-1 rounded w-full mt-1 text-black"
                      />
                    ) : (
                      ref.place
                    )}
                  </p>

                  <p className="text-gray-300 text-sm sm:text-base mt-2">
                    <strong>About Candidate:</strong>{" "}
                    {editId === ref.id ? (
                      <textarea
                        value={formData.aboutyou || ref.aboutyou}
                        onChange={(e) =>
                          handleChange(ref.id, "aboutyou", e.target.value)
                        }
                        className="bg-gray-700 p-1 rounded w-full mt-1 text-black"
                      />
                    ) : (
                      ref.aboutyou
                    )}
                  </p>

                  <a
                    className="text-blue-400 underline text-sm sm:text-base mt-2 block"
                    href={ref.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Resume
                  </a>

                  <p className="text-gray-300 text-sm sm:text-base mt-2">
                    <strong>Status:</strong>{" "}
                    {editId === ref.id ? (
                      <select
                        value={formData.status || ref.status}
                        onChange={(e) =>
                          handleChange(ref.id, "status", e.target.value)
                        }
                        className="bg-gray-700 p-1 rounded w-full mt-1 text-black"
                      >
                        {statusOptions.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span
                        className={`px-2 py-1 rounded text-sm ${
                          ref.status === "Pending"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : ref.status === "Hired"
                            ? "bg-green-500/20 text-green-400"
                            : ref.status === "Rejected"
                            ? "bg-red-500/20 text-red-400"
                            : "bg-blue-500/20 text-blue-400"
                        }`}
                      >
                        {ref.status}
                      </span>
                    )}
                  </p>

                  <p className="text-gray-400 text-xs mt-2">
                    Posted on: {new Date(ref.postedAt).toLocaleString()}
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap gap-2 justify-end">
                  {editId === ref.id ? (
                    <button
                      onClick={handleSave}
                      className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => setEditId(ref.id)}
                      className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(ref.id)}
                    className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
