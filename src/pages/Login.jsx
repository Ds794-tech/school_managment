import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login({ setIsAdmin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (username === "admin" && password === "admin123") {
      setIsAdmin(true);
      localStorage.setItem("isAdmin", "true");
      navigate("/admin-dashboard");
    } else {
      alert("Invalid admin credentials");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        {/* Admin Login */}
        <form onSubmit={handleAdminLogin} className="space-y-4">
          <input
            type="text"
            placeholder="Admin Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 border rounded-lg"
          />
          <input
            type="password"
            placeholder="Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded-lg"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
          >
            Admin Login
          </button>
        </form>

        {/* School Login / Signup */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 mb-2">School Access</p>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => navigate("/school-login")}
              className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700"
            >
              School Login
            </button>
            <button
              onClick={() => navigate("/school-signup")}
              className="w-full bg-yellow-600 text-white p-3 rounded-lg hover:bg-yellow-700"
            >
              School Signup
            </button>
          </div>
        </div>

        {/* Vendor Login */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 mb-2">Vendor Access</p>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => navigate("/vendor-login")}
              className="w-full bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700"
            >
              Vendor Login
            </button>
            <button
              onClick={() => navigate("/vendor-signup")}
              className="w-full bg-yellow-600 text-white p-3 rounded-lg hover:bg-yellow-700"
            >
              Vendor Signup
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
