import React from "react";
import { Diamond} from "lucide-react";
import { Link } from "react-router-dom";

const Nav = () => {
  return (
    <nav className="w-full bg-[#0f1216] text-white px-4 md:px-20 py-4 flex items-center justify-between shadow-lg">
      <div className="flex items-center gap-2">
        <div className="p-2 bg-pink-600 rounded-full">
          <Diamond size={20} className="text-white"/>
        </div>
        <h1 className="text-xl font-semibold hidden sm:block">Sweet Shop</h1>
      </div>

      <div className="flex items-center gap-2 text-gray-300">
        <Link to="/register" className="px-4 py-1.5 rounded-xl  hover:bg-pink-700 text-white transition border-pink-600 border-2">Register</Link>
        <Link to="/login" className="px-4 py-1.5 rounded-xl bg-pink-600 hover:bg-pink-700 border-pink-600 border-2 text-white transition">Login</Link>
      </div>
    </nav>
  );
};

export default Nav;
