import React, { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import SweetCard from "../Components/SweetCard";
import Footer from "../Components/Footer";
import PurchaseModal from "../Components/PurchaseModal";
import { getSweets, purchaseSweet, initAuth, isTokenExpired, refreshAccessToken, API_URL } from "../api";

function Dashboard() {
  const initialDummy = [
    {
      id: "sample-1",
      name: "Chocolate Barfi",
      price: 250,
      image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c",
      description: "Rich chocolate-flavored barfi, made with premium cocoa and cashews.",
      quantity: 12,
    },
    {
      id: "sample-2",
      name: "Rasgulla",
      price: 180,
      image: "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f",
      description: "Soft, spongy syrupy delights topped with pistachio crumbs.",
      quantity: 20,
    },
    {
      id: "sample-3",
      name: "Kaju Katli",
      price: 420,
      image: "https://images.unsplash.com/photo-1699708263762-00ca477760bd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8a2FqdSUyMGthdGxpfGVufDB8fDB8fHww",
      description: "Silky smooth cashew fudge with a delicate silver finish.",
      quantity: 8,
    },
  ];

  const [sweets, setSweets] = useState(initialDummy);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSweet, setSelectedSweet] = useState(null);

  useEffect(() => {
    initAuth();
    (async () => {
      try {
        const data = await getSweets();
        const mapped = (data || []).map((s) => ({
          id: s.id,
          name: s.name,
          price: s.price,
          image: s.image && !s.image.startsWith("http") ? `${API_URL}/api/sweets/images/${s.image}` : s.image || "",
          description: s.description,
          quantity: s.quantity ?? 0,
        }));

        // merge with dummy while avoiding duplicates
        const merged = [...initialDummy];
        const existing = new Set(merged.map((d) => String(d.id)));
        for (const m of mapped) {
          if (!existing.has(String(m.id))) {
            merged.push(m);
            existing.add(String(m.id));
          }
        }
        setSweets(merged);
      } catch (err) {
        console.error("Failed to load sweets:", err);
      }
    })();
  }, []);

  const handlePurchaseConfirm = async (id, qty) => {
    // client-side validation: ensure requested qty does not exceed available stock
    const s = sweets.find((x) => x.id === id) || selectedSweet;
    if (!s) {
      alert("Selected sweet not found.");
      return;
    }
    if (qty > s.quantity) {
      alert("Not enough quantity in stock to make this purchase.");
      return;
    }

    // ensure user is authenticated and token is fresh; try to refresh if expired
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("You must be logged in to make a purchase. Please login.");
      return;
    }
    if (isTokenExpired(token)) {
      try {
        await refreshAccessToken();
      } catch (err) {
        console.error("Refresh failed:", err);
        alert("Session expired — please login again.");
        return;
      }
    }

    try {
      const updated = await purchaseSweet(id, qty);
      setSweets((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
      setModalOpen(false);
      alert("Purchase confirmed — thank you!");
    } catch (err) {
      console.error(err);
      
      if (err?.response) {
        const status = err.response.status;
        const data = err.response.data;
        if (status === 401) {
          alert("You must be logged in to make a purchase. Please login.");
          return;
        }
        
        if (typeof data === "string") {
          alert(data);
          return;
        }
        if (data && data.message) {
          alert(data.message);
          return;
        }
      }
      alert("Purchase failed — please try again.");
    }
  };

  const openPurchaseModal = (sweet) => {
    setSelectedSweet(sweet);
    setModalOpen(true);
  };

  const closePurchaseModal = () => {
    setModalOpen(false);
    setSelectedSweet(null);
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
              description={sweet.description}
              quantity={sweet.quantity}
              onPurchase={() => openPurchaseModal(sweet)}
            />
          ))}
        </div>
      </div>

      <Footer />
      <PurchaseModal
        sweet={selectedSweet}
        open={modalOpen}
        onClose={closePurchaseModal}
        onConfirm={(qty) => selectedSweet && handlePurchaseConfirm(selectedSweet.id, qty)}
      />
    </div>
  );
}

export default Dashboard;
