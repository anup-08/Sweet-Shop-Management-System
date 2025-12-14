import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../api";

const Register = () => {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("user");
  const [password, setPassword] = useState("");

  const handleSubmit = (e)=>{
    e.preventDefault();
    (async () => {
      try {
        await register({ username, password, role });
        if (role === "admin") navigate("/admin");
        else navigate("/dashboard");
      } catch (err) {
        console.error(err);
        alert("Registration failed — check the server or input values.");
      }
    })();
  }

  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f1216] px-4">
      <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-200">
            Create Account 🍰
          </h1>
          <p className="text-sm text-gray-300 mt-1">
            Join us & enjoy our signature sweets
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
              placeholder="your username"
              className="w-full text-gray-200 px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Role
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                aria-pressed={role === "user"}
                onClick={() => setRole("user")}
                className={`flex-1 py-1.5 rounded-lg text-sm transition font-semibold ${
                  role === "user"
                    ? "bg-pink-600 text-white"
                    : "bg-transparent border border-gray-700 text-gray-300"
                }`}
              >
                User
              </button>

              <button
                type="button"
                aria-pressed={role === "admin"}
                onClick={() => setRole("admin")}
                className={`flex-1 py-1.5 rounded-lg text-sm transition font-semibold ${
                  role === "admin"
                    ? "bg-pink-600 text-white"
                    : "bg-transparent border border-gray-700 text-gray-300"
                }`}
              >
                Admin
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2">Select account role (default: user).</p>
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
            Register
          </button>
        </form>

        <div className="flex items-center gap-3 my-6">
          <div className="h-px bg-gray-300 flex-1"></div>
          <span className="text-sm text-gray-400">OR</span>
          <div className="h-px bg-gray-300 flex-1"></div>
        </div>

        <p className="text-center text-sm text-gray-300">
          Already have an account?
          <Link
            to="/login"
            className="text-rose-500 font-semibold cursor-pointer hover:underline ml-1"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
