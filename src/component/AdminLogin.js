// src/pages/AdminLogin.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminLogin = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:5001/api/admin/login", {
        userId,
        password,
      });

      if (res.data.token) {
        // Save JWT token
        localStorage.setItem("token", res.data.token);

        // Save admin details (optional)
        localStorage.setItem("adminData", JSON.stringify(res.data.admin));

        // Redirect to dashboard
        navigate("/Dashboard");
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.msg || "Login failed. Please try again.");
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-purple-900 via-indigo-900 to-black">
      <div className="absolute top-10 left-10 w-72 h-72 bg-purple-600 rounded-full blur-3xl opacity-40 animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-indigo-600 rounded-full blur-3xl opacity-40 animate-pulse"></div>

      <div className="relative z-10 bg-white/10 backdrop-blur-lg p-10 rounded-2xl shadow-2xl w-[90%] sm:w-[400px] border border-white/20">
        <h1 className="text-3xl font-bold text-white text-center mb-6">Admin Login</h1>

        {error && <p className="text-red-400 text-center mb-3 text-sm">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="text-white block mb-1">User ID</label>
            <input
              type="text"
              placeholder="Enter admin userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="text-white block mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold shadow-lg hover:scale-105 transform transition duration-300"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
