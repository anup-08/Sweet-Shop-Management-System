import React from "react";
import { Diamond, Instagram, Facebook, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#0f1216] text-gray-400 mt-16">
      <div className="px-4 sm:px-6 md:px-10 lg:px-20 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-pink-600 rounded-full">
              <Diamond size={18} className="text-white" />
            </div>
            <h2 className="text-lg font-semibold text-white">
              Sweet Shop
            </h2>
          </div>
          <p className="text-sm leading-relaxed">
            Serving happiness with handcrafted sweets made from the finest ingredients.
          </p>
        </div>

       
        <div>
          <h3 className="text-white font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-pink-400 cursor-pointer">Home</li>
            <li className="hover:text-pink-400 cursor-pointer">Sweets</li>
            <li className="hover:text-pink-400 cursor-pointer">Cart</li>
            <li className="hover:text-pink-400 cursor-pointer">Contact</li>
          </ul>
        </div>

      
        <div>
          <h3 className="text-white font-semibold mb-3">Support</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-pink-400 cursor-pointer">Help Center</li>
            <li className="hover:text-pink-400 cursor-pointer">Privacy Policy</li>
            <li className="hover:text-pink-400 cursor-pointer">Terms & Conditions</li>
          </ul>
        </div>

      
        <div>
          <h3 className="text-white font-semibold mb-3">Follow Us</h3>
          <div className="flex gap-4">
            <div className="p-2 rounded-full border border-gray-600 hover:bg-pink-600 transition cursor-pointer">
              <Instagram size={18} />
            </div>
            <div className="p-2 rounded-full border border-gray-600 hover:bg-pink-600 transition cursor-pointer">
              <Facebook size={18} />
            </div>
            <div className="p-2 rounded-full border border-gray-600 hover:bg-pink-600 transition cursor-pointer">
              <Twitter size={18} />
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700 py-4 text-center text-sm">
        © {new Date().getFullYear()} Sweet Shop. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
