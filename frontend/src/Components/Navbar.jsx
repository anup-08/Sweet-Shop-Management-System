import React, { useState } from "react";
import { Diamond, User, LogOut, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { logout } from "../api";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const token = typeof window !== "undefined" && localStorage.getItem("accessToken");
  const user = token ? { name: "You" } : { name: "Guest" };

  return (
    <nav className="relative w-full bg-[#0f1216] text-white px-4 md:px-20 py-4 flex items-center justify-between shadow-lg">
      <div className="flex items-center gap-2">
        <div className="p-2 bg-pink-600 rounded-full">
          <Diamond size={20} />
        </div>
        <h1 className="text-xl font-semibold hidden sm:block">Sweet Shop</h1>
      </div>

      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="p-2 rounded-full border-2 border-pink-600 hover:bg-pink-600 transition"
        >
          <User size={22} />
        </button>

        {open && (
          <div className="absolute right-0 mt-3 w-64 bg-[#161a20] rounded-xl shadow-xl border border-gray-700 z-50">
            <div className="px-4 py-3 border-b border-gray-700">
              <p className="text-sm font-semibold text-white">{user.name}</p>
            </div>

            <Link
              to="/admin"
              className="w-full flex items-center gap-2 px-4 py-3 text-sm text-green-400 hover:bg-red-500/10 rounded-b-xl transition"
            >
              <Shield size={16} />
              Switch to Admin
            </Link>

            {token ? (
              <button
                onClick={() => {
                  logout();
                  window.location.href = "/";
                }}
                className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 rounded-b-xl transition text-left"
              >
                <LogOut size={16} />
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="w-full flex items-center gap-2 px-4 py-3 text-sm text-green-400 hover:bg-red-500/10 rounded-b-xl transition"
              >
                <LogOut size={16} />
                Login
              </Link>
            )}
            
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
