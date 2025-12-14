import React, { useEffect, useState, useCallback } from "react";
import Navbar from "../Components/Navbar";
import { Pencil, Trash2 } from "lucide-react";
import { getMySweets, initAuth, getCurrentUser, addSweetForm, API_URL, refreshAccessToken, updateSweetForm, deleteSweet } from "../api";

const AdminDashboard = () => {
  const initialDummy = [
    {
      id: -1,
      name: "Chocolate Barfi",
      price: 250,
      image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c",
      description: "Rich chocolate barfi with nuts",
      quantity: 12,
      isDummy: true,
    },
    {
      id: -2,
      name: "Rasgulla",
      price: 180,
      image: "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f",
      description: "Soft spongy rasgullas in sugar syrup",
      quantity: 20,
      isDummy: true,
    },
  ];

  const [sweets, setSweets] = useState(initialDummy);

  const mapServer = (m) => ({
    id: m.id,
    name: m.name,
    price: m.price,
    image: m.image ? `${API_URL}/api/sweets/images/${m.image}` : "",
    description: m.description || "",
    quantity: m.quantity ?? 0,
    category: m.category || "",
  });

  const loadMy = useCallback(async () => {
    const mergeAndSet = (mapped) => {
      const merged = [...initialDummy];
      const existingIds = new Set(merged.map((s) => String(s.id)));
      for (const m of mapped) {
        if (!existingIds.has(String(m.id))) {
          merged.push(m);
          existingIds.add(String(m.id));
        }
      }
      setSweets(merged);
    };

    try {
      const my = await getMySweets();
      mergeAndSet((my || []).map(mapServer));
      return true;
    } catch (err) {
      // try refresh once and retry
      try {
        await refreshAccessToken();
        const my = await getMySweets();
        mergeAndSet((my || []).map(mapServer));
        return true;
      } catch (e) {
        console.error("Failed to load admin sweets after refresh:", e);
        return false;
      }
    }
  }, []);

  useEffect(() => {
    initAuth();
    (async () => {
      try {
        const current = getCurrentUser();
        const isAdmin = current && current.roles && current.roles.some((r) => String(r).toUpperCase().includes("ADMIN"));
        if (!isAdmin) return;
        await loadMy();
      } catch (err) {
        console.error("Failed to initialize admin sweets:", err);
      }
    })();
  }, [loadMy]);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    quantity: "",
    image: "",
    imageFile: null,
  });

  const [preview, setPreview] = useState("");
  const [editId, setEditId] = useState(null);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setFormData((prev) => ({ ...prev, imageFile: file }));
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPreview(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  // Add / Update sweet
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      fd.append("name", formData.name);
      fd.append("category", formData.category || "");
      fd.append("description", formData.description);
      fd.append("price", formData.price);
      fd.append("quantity", formData.quantity || "0");
      if (formData.imageFile) fd.append("image", formData.imageFile);

      if (editId) {
        // if editing a demo item, update locally without calling backend
        const target = sweets.find((s) => String(s.id) === String(editId));
        if (target && target.isDummy) {
          setSweets((prev) => prev.map((s) => (String(s.id) === String(editId) ? {
            ...s,
            name: formData.name,
            category: formData.category || s.category,
            price: formData.price,
            description: formData.description,
            quantity: formData.quantity || s.quantity,
            image: preview || s.image,
          } : s)));
        } else {
          // real item: call backend (updateSweetForm handles token refresh)
          await updateSweetForm(editId, fd);
        }
      } else {
        await addSweetForm(fd);
      }

      // refresh list from server
      await loadMy();
      setEditId(null);
    } catch (err) {
      console.error("Failed to add/update sweet:", err, err?.response || null);
      if (err?.response) {
        console.error("Response status:", err.response.status, "data:", err.response.data);
        alert(`Failed to add/update sweet: ${err.response.status} - ${JSON.stringify(err.response.data)}`);
      } else {
        alert(`Failed to add/update sweet: ${err?.message || err}`);
      }
    } finally {
      setFormData({ name: "", category: "", price: "", description: "", quantity: "", image: "", imageFile: null });
      setPreview("");
    }
  };

  const handleEdit = (sweet) => {
    setEditId(sweet.id);
    setFormData({
      name: sweet.name,
      category: sweet.category || "",
      price: sweet.price,
      description: sweet.description || "",
      quantity: sweet.quantity || "",
      image: sweet.image || "",
      imageFile: null,
    });
    setPreview(sweet.image || "");
  };

  const handleDelete = async (id) => {
    const target = sweets.find((s) => s.id === id);
    if (target?.isDummy) {
      if (!confirm("Remove this demo item from the list?")) return;
      setSweets((prev) => prev.filter((s) => s.id !== id));
      return;
    }
    if (!confirm("Delete this sweet?")) return;
    try {
      await deleteSweet(id);
      await loadMy();
    } catch (err) {
      console.error("Failed to delete sweet:", err);
      alert("Failed to delete sweet. See console for details.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1216] text-white">
      <Navbar />

      <div className="px-4 sm:px-6 md:px-10 lg:px-20 py-8">
        <h1 className="text-2xl font-semibold mb-6">
          Admin – Manage Sweets 🍬
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-[#161a20] p-6 rounded-2xl mb-8 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <input
            type="text"
            name="name"
            placeholder="Sweet Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="px-4 py-2 rounded-xl bg-[#0f1216] border border-gray-700 focus:outline-none focus:border-pink-500"
          />

          <input
            type="text"
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
            required
            className="px-4 py-2 rounded-xl bg-[#0f1216] border border-gray-700 focus:outline-none focus:border-pink-500"
          />

          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            required
            className="px-4 py-2 rounded-xl bg-[#0f1216] border border-gray-700 focus:outline-none focus:border-pink-500"
          />

          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
            className="px-4 py-2 rounded-xl bg-[#0f1216] border border-gray-700 focus:outline-none focus:border-pink-500"
          />

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            required
            className="md:col-span-3 px-4 py-2 rounded-xl bg-[#0f1216] border border-gray-700 focus:outline-none focus:border-pink-500 text-gray-200"
          />

          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-300">Upload Image</label>

            <label
              htmlFor="image-upload"
              className="inline-flex items-center gap-2 px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-xl cursor-pointer transition shadow-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm5 3a1 1 0 112 0v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6z" />
              </svg>
              Choose Image
            </label>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            {(preview || formData.image) && (
              <img src={preview || formData.image} alt="preview" className="w-28 h-20 object-cover rounded-md mt-2 border border-gray-700" />
            )}
          </div>

          <button
            type="submit"
            className="md:col-span-3 bg-pink-600 hover:bg-pink-700 py-2 rounded-xl font-semibold transition"
          >
            {editId ? "Update Sweet" : "Add Sweet"}
          </button>
        </form>

        <div className="overflow-x-auto">
          <table className="w-full bg-[#161a20] rounded-2xl overflow-hidden">
            <thead className="bg-[#1f2430]">
              <tr>
                <th className="text-left px-4 py-3">Image</th>
                <th className="text-left px-4 py-3">Name</th>
                <th className="text-left px-4 py-3">Description</th>
                <th className="text-left px-4 py-3">Price</th>
                <th className="text-left px-4 py-3">Quantity</th>
                <th className="text-center px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sweets.map((sweet) => (
                <tr key={sweet.id} className="border-t border-gray-700">
                  <td className="px-4 py-3">
                    <img src={sweet.image} alt={sweet.name} className="w-14 h-14 object-cover rounded-lg" />
                  </td>
                  <td className="px-4 py-3">{sweet.name}</td>
                  <td className="px-4 py-3 text-gray-300 max-w-xs truncate">{sweet.description}</td>
                  <td className="px-4 py-3 text-pink-400">₹{sweet.price}</td>
                  <td className="px-4 py-3">{sweet.quantity ?? '-'}</td>
                  <td className="px-4 py-3 flex justify-center gap-4">
                    <button onClick={() => handleEdit(sweet)} className="text-yellow-400 hover:text-yellow-500">
                      <Pencil size={18} />
                    </button>
                    <button onClick={() => handleDelete(sweet.id)} className="text-red-500 hover:text-red-600">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {sweets.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-gray-400">
                    No sweets added yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
