import React from "react";
import { ShoppingCart } from "lucide-react";

const SweetCard = ({ image, name, price, quantity = 0, description = "", onPurchase }) => {
  return (
    <div className="bg-[#161a20] text-white rounded-2xl shadow-lg overflow-hidden hover:shadow-pink-500/20 transition duration-300 w-full max-w-sm mx-auto">
      
      <div className="h-44 sm:h-48 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover hover:scale-105 transition duration-300"
        />
      </div>

      <div className="p-4 flex flex-col gap-2">
        <h2 className="text-lg font-semibold truncate">
          {name}
        </h2>

        <p className="text-sm text-gray-300 truncate">{description}</p>

        <p className="text-pink-400 font-bold text-base">₹{price}</p>

        <p className="text-xs text-gray-400">Quantity left: {quantity}</p>

        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => onPurchase && onPurchase()}
            disabled={quantity <= 0}
            className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl transition text-white ${
              quantity > 0 ? "bg-pink-600 hover:bg-pink-700" : "bg-gray-600 cursor-not-allowed"
            }`}
          >
            <ShoppingCart size={18} />
            {quantity > 0 ? "Purchase" : "Sold Out"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SweetCard;
