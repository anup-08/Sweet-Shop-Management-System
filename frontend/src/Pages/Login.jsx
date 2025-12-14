import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login, getCurrentUser } from "../api";

const Login = () => {

  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    (async () => {
      try {
        await login(username, password);
        const current = getCurrentUser();
        const roles = (current && current.roles) || [];
        const isAdmin = roles.some((r) => String(r).toUpperCase().includes("ADMIN"));
        if (isAdmin) navigate("/admin");
        else navigate("/dashboard");
      } catch (err) {
        console.error(err);
        alert("Login failed — check credentials or server connection.");
      }
    })();
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f1216] px-4">
      <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-200">
            Sweet Delights 🍩
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Login to explore our signature creations
          </p>
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              className="w-full text-gray-200 px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full text-gray-200 px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
          </div>

          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full py-2.5 rounded-xl bg-rose-500 text-white font-semibold hover:bg-rose-600 transition"
          >
            Login
          </button>
        </form>

        <div className="flex items-center gap-3 my-6">
          <div className="h-px bg-gray-300 flex-1"></div>
          <span className="text-sm text-gray-400">OR</span>
          <div className="h-px bg-gray-300 flex-1"></div>
        </div>

        <p className="text-center text-sm text-gray-300">
          Don’t have an account?
          <Link
            to="/register"
            className="text-rose-500 font-semibold cursor-pointer hover:underline ml-1"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;