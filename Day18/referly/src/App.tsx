import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Jobs from "./services/Jobs";
import Referals from "./services/Referals";
import Status from "./services/Status";
import PostReferals from "./services/PostReferals";
import PostStatus from "./services/PostStatus";
import JobListings from "./services/JobListings";
function AppRoutes() {
  const { user } = useAuth();
  const loggedInUser = JSON.parse(
    localStorage.getItem("loggedInUser") || "null"
  );

  const currentUser = user || loggedInUser;

  return (
    <div className="min-h-screen bg-cyan-500 text-white flex items-center justify-center">
      <Routes>
        <Route
          path="/"
          element={!currentUser ? <Navigate to="/login" /> : <Dashboard />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/jobs"
          element={currentUser ? <Jobs /> : <Navigate to="/login" />}
        />
        <Route
          path="/referals"
          element={currentUser ? <Referals /> : <Navigate to="/login" />}
        />
        <Route
          path="/status"
          element={currentUser ? <Status /> : <Navigate to="/login" />}
        />
        <Route
          path="/postReferals"
          element={currentUser ? <PostReferals /> : <Navigate to="/login" />}
        />
        <Route
          path="/poststatus"
          element={currentUser ? <PostStatus /> : <Navigate to="/login" />}
        />
        <Route
          path="/joblistings"
          element={currentUser ? <JobListings /> : <Navigate to="/login" />}
        />
        <Route
          path="/dashboard"
          element={currentUser ? <Dashboard /> : <Navigate to="/login" />}
        />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
