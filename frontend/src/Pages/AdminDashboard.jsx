import React, { useState } from "react";
import Navbar from "../Components/Navbar";
import { Pencil, Trash2 } from "lucide-react";

const AdminDashboard = () => {
  const [sweets, setSweets] = useState([
    {
      id: 1,
      name: "Chocolate Barfi",
      price: 250,
      image:
        "https://images.unsplash.com/photo-1606313564200-e75d5e30476c",
    },
    {
      id: 2,
      name: "Rasgulla",
      price: 180,
      image:
        "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f",
    },
  ]);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    image: "",
  });

  const [editId, setEditId] = useState(null);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Add / Update sweet
  const handleSubmit = (e) => {
    e.preventDefault();

    if (editId) {
      setSweets((prev) =>
        prev.map((sweet) =>
          sweet.id === editId
            ? { ...sweet, ...formData, price: Number(formData.price) }
            : sweet
        )
      );
      setEditId(null);
    } else {
      setSweets((prev) => [
        ...prev,
        {
          id: Date.now(),
          name: formData.name,
          price: Number(formData.price),
          image: formData.image,
        },
      ]);
    }

    setFormData({ name: "", price: "", image: "" });
  };

  // Edit sweet
  const handleEdit = (sweet) => {
    setEditId(sweet.id);
    setFormData({
      name: sweet.name,
      price: sweet.price,
      image: sweet.image,
    });
  };

  // Delete sweet
  const handleDelete = (id) => {
    setSweets((prev) => prev.filter((sweet) => sweet.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#0f1216] text-white">
      <Navbar />

      <div className="px-4 sm:px-6 md:px-10 lg:px-20 py-8">
        <h1 className="text-2xl font-semibold mb-6">
          Admin – Manage Sweets 🍬
        </h1>

        {/* Add / Edit Form */}
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
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            required
            className="px-4 py-2 rounded-xl bg-[#0f1216] border border-gray-700 focus:outline-none focus:border-pink-500"
          />

          <input
            type="text"
            name="image"
            placeholder="Image URL"
            value={formData.image}
            onChange={handleChange}
            required
            className="px-4 py-2 rounded-xl bg-[#0f1216] border border-gray-700 focus:outline-none focus:border-pink-500"
          />

          <button
            type="submit"
            className="md:col-span-3 bg-pink-600 hover:bg-pink-700 py-2 rounded-xl font-semibold transition"
          >
            {editId ? "Update Sweet" : "Add Sweet"}
          </button>
        </form>

        {/* Sweet List */}
        <div className="overflow-x-auto">
          <table className="w-full bg-[#161a20] rounded-2xl overflow-hidden">
            <thead className="bg-[#1f2430]">
              <tr>
                <th className="text-left px-4 py-3">Image</th>
                <th className="text-left px-4 py-3">Name</th>
                <th className="text-left px-4 py-3">Price</th>
                <th className="text-center px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sweets.map((sweet) => (
                <tr
                  key={sweet.id}
                  className="border-t border-gray-700"
                >
                  <td className="px-4 py-3">
                    <img
                      src={sweet.image}
                      alt={sweet.name}
                      className="w-14 h-14 object-cover rounded-lg"
                    />
                  </td>
                  <td className="px-4 py-3">{sweet.name}</td>
                  <td className="px-4 py-3 text-pink-400">
                    ₹{sweet.price}
                  </td>
                  <td className="px-4 py-3 flex justify-center gap-4">
                    <button
                      onClick={() => handleEdit(sweet)}
                      className="text-yellow-400 hover:text-yellow-500"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(sweet.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {sweets.length === 0 && (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center py-6 text-gray-400"
                  >
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
