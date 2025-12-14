import React from "react";

const PurchaseModal = ({ sweet, open, onClose, onConfirm }) => {
  if (!open || !sweet) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md bg-[#0f1216] rounded-2xl p-6 shadow-xl border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Purchase {sweet.name}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
        </div>

        <div className="flex gap-4">
          <img src={sweet.image} alt={sweet.name} className="w-24 h-24 object-cover rounded-lg" />

          <div className="flex-1">
            <p className="text-sm text-gray-300 mb-2">{sweet.description}</p>
            <p className="text-pink-400 font-bold">₹{sweet.price}</p>
            <p className="text-xs text-gray-400">Available: {sweet.quantity}</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3">
          <label className="text-sm text-gray-300">Quantity</label>
          <input
            type="number"
            min="1"
            max={sweet.quantity}
            defaultValue={1}
            id="purchase-qty"
            className="w-full px-3 py-2 rounded-xl bg-[#161a20] border border-gray-700 text-gray-200 focus:outline-none"
          />

          <div className="flex gap-3 mt-2">
            <button
              onClick={() => {
                    const v = Number(document.getElementById("purchase-qty").value || 1);

                    if (v > sweet.quantity) {
                      alert("Entered quantity is more than available stock");
                      return;
                    }
                
                    if (v < 1) {
                      alert("Quantity must be at least 1");
                      return;
                    }
                    onConfirm(v);
            }}
              className="flex-1 bg-pink-600 hover:bg-pink-700 text-white py-2 rounded-xl font-semibold transition"
            >
              Confirm Purchase
            </button>

            <button
              onClick={onClose}
              className="flex-1 bg-transparent border border-gray-700 text-gray-300 py-2 rounded-xl hover:bg-gray-800 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseModal;
