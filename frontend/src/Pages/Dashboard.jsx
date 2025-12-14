import React, { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import SweetCard from "../Components/SweetCard";
import Footer from "../Components/Footer";
import { getSweets, purchaseSweet, initAuth } from "../api";

function Dashboard() {
  const [sweets, setSweets] = useState([]);

  useEffect(() => {
    initAuth();
    (async () => {
      try {
        const data = await getSweets();
        setSweets(data);
      } catch (err) {
        console.error("Failed to load sweets:", err);
      }
    })();
  }, []);

  const handlePurchase = async (id) => {
    try {
      const updated = await purchaseSweet(id, 1);
      setSweets((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
      alert("Purchase successful");
    } catch (err) {
      console.error(err);
      alert("Purchase failed — ensure you're logged in and have sufficient quantity.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1216]">
      <Navbar />

      {/* Page Content */}
      <div className="px-4 sm:px-6 md:px-10 lg:px-20 py-8">
        <h1 className="text-white text-2xl font-semibold mb-6">Our Sweets 🍬</h1>

        {/* Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sweets.map((sweet) => (
            <SweetCard
              key={sweet.id}
              image={sweet.image}
              name={sweet.name}
              price={sweet.price}
              quantity={sweet.quantity}
              onPurchase={() => handlePurchase(sweet.id)}
            />
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Dashboard;
