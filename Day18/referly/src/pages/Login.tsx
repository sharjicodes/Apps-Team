import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RiAccountCircleFill } from "react-icons/ri";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { useState } from "react";

//zod validation schema for
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const Login = () => {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = (data: any) => {
    const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const adminUser = JSON.parse(localStorage.getItem("adminUser") || "null");

    // Check admin first
    if (
      adminUser &&
      data.email === adminUser.email &&
      data.password === adminUser.password
    ) {
      login(adminUser);
      toast.success("✅ Admin logged in successfully!");
      return;
    }

    // Check among registered users
    const foundUser = storedUsers.find(
      (user: any) =>
        user.email === data.email && user.password === data.password
    );

    if (foundUser) {
      login(foundUser);
      toast.success("✅ Login successful!");
    } else {
      toast.error("⚠️ Invalid email or password!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white w-full">
      <ToastContainer position="top-right" autoClose={2000} />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-gray-800 p-8 rounded-2xl w-full max-w-sm shadow-lg"
      >
        <h2 className="text-4xl font-bold mb-6 text-center text-blue-400">
          Login
        </h2>
        <div className="flex justify-center mb-6">
          <RiAccountCircleFill className="text-blue-400 text-6xl animate-bounce" />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Email</label>
          <input
            placeholder="Enter your Email"
            type="email"
            {...register("email")}
            className="w-full p-3 rounded-lg bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="mb-4 relative">
          <label className="block mb-1 font-medium">Password</label>

          <input
            placeholder="Enter your Password"
            type={showPassword ? "text" : "password"} 
            {...register("password")}
            className="w-full p-3 pr-10 rounded-lg bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-14 transform -translate-y-1/2 text-gray-300 hover:text-blue-400"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>

          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <button className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-semibold transition">
          Login
        </button>

        <p className="text-center text-sm mt-4 text-gray-300">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-400 hover:underline">
            Register
          </a>
        </p>
      </form>
    </div>
  );
};

export default Login;
