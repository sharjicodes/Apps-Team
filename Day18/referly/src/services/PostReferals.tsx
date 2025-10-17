import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import Select from "react-select";

const referSchema = z.object({
  name: z.string().min(1, { message: "name is required" }),
  place: z.string().min(1, { message: "Location is required" }),
  aboutyou: z.string().min(10, "Summary must be at least 10 characters"),
  resume: z.string().url(),
});

type referData = z.infer<typeof referSchema>;
const PostReferals = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [locationOptions, setLocationOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<referData>({
    resolver: zodResolver(referSchema),
  });

  const API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY; // Replace with your key

  // Fetch cities dynamically from Geoapify as user types
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
      const options = data.features.map((item: any) => ({
        label: item.properties.formatted,
        value: item.properties.formatted,
      }));
      setLocationOptions(options);
    } catch (err) {
      console.error("Error fetching locations:", err);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (data: referData) => {
    if (!user || !user.id) {
      alert("⚠️ User not found. Please log in again.");
      navigate("/login");
      return;
    }

    // Retrieve all posted jobs from localStorage
    const allrefers = JSON.parse(localStorage.getItem("refers") || "{}");

    // If user has existing jobs, append to them; otherwise create a new array
    const userrefers = allrefers[user.id] || [];

    // Add timestamp or job id
    const newrefer = {
      id: crypto.randomUUID(), // unique job id
      ...data,
      postedAt: new Date().toISOString(),
    };

    // Update that user's jobs
    allrefers[user.id] = [...userrefers, newrefer];

    // Save back to localStorage
    localStorage.setItem("refers", JSON.stringify(allrefers));

    alert("✅ Referal successfully posted!");
    navigate("/Dashboard");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white w-full">
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
                  aria-current="page"
                >
                  📋 Job Listings
                </a>
              </li>
              <li>
                <a
                  href="/postReferals"
                  className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                >
                  👥 Candidate Referrals
                </a>
              </li>
              <li>
                <a
                  href="/status"
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

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-gray-800 p-8 rounded-lg w-full max-w-sm shadow-lg mt-20"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Refer Candidate</h2>

        {/* Title */}
        <div className="mb-4">
          <label className="block mb-1">Name</label>
          <input
            type="text"
            placeholder="Enter the Name"
            {...register("name")}
            className="w-full p-2 rounded bg-gray-700 focus:outline-none"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block mb-1">place</label>
          <Controller
            name="place"
            control={control}
            render={({ field }) => (
              <Select
                options={locationOptions}
                value={
                  field.value
                    ? { label: field.value, value: field.value }
                    : null
                }
                onChange={(selectedOption) =>
                  field.onChange(selectedOption?.value || "")
                }
                onInputChange={(inputValue) => {
                  fetchLocations(inputValue);
                }}
                placeholder={loading ? "Loading..." : "Search location..."}
                isSearchable
              />
            )}
          />

          {errors.place && (
            <p className="text-red-500 text-sm">{errors.place.message}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block mb-1">About You</label>
          <input
            type="text"
            placeholder="Enter about yourself"
            {...register("aboutyou")}
            className="w-full p-2 rounded bg-gray-700 focus:outline-none"
          />
          {errors.aboutyou && (
            <p className="text-red-500 text-sm">{errors.aboutyou.message}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block mb-1">Resume</label>
          <input
            
            placeholder="Enter the url to the resume"
            {...register("resume")}
            className="w-full p-2 rounded bg-gray-700 focus:outline-none"
          />
          {errors.resume && (
            <p className="text-red-500 text-sm">{errors.resume.message}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded font-semibold"
        >
          Post
        </button>
      </form>
    </div>
  );
};
export default PostReferals;
