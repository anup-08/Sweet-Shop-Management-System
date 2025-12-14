import React from "react";

const items = [
  {
    title: "Velvet Chocolate Lava Cake",
    desc: "Decadent dark chocolate molten cake, served warm with a scoop of artisan vanilla bean ice cream and a dusting of cocoa.",
    img: "https://plus.unsplash.com/premium_photo-1723867522131-af9733323bc1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8VmVsdmV0JTIwQ2hvY29sYXRlJTIwTGF2YSUyMENha2V8ZW58MHx8MHx8fDA%3D",
  },
  {
    title: "Parisian Macaron Collection",
    desc: "A delightful assortment of light and airy French macarons, featuring exotic fruit, rich chocolate, and classic cream fillings.",
    img: "https://images.unsplash.com/photo-1634560604992-7784a29bc419?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8TWFjYXJvbnxlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    title: "Classic Apple Crumble Pie",
    desc: "Our timeless recipe of spiced apples baked under a buttery, flaky crumble crust, perfect for sharing with loved ones.",
    img: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?q=80&w=800&auto=format&fit=crop",
  },
  {
    title: "New York Cheesecake",
    desc: "Rich and creamy New York–style cheesecake, baked to perfection on a graham cracker crust and topped with a fresh berry compote.",
    img: "https://images.unsplash.com/photo-1708175313856-8573b2bf8a3a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Y2hlZXNlY2FrZXxlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    title: "Gourmet Éclairs",
    desc: "Elegant choux pastry filled with luscious vanilla bean cream, topped with a rich chocolate glaze — a true French classic.",
    img: "https://images.unsplash.com/photo-1709451148221-44474af7373a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8R291cm1ldCUyMCVDMyU4OWNsYWlyc3xlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    title: "Artisan Cookie Selection",
    desc: "A delightful assortment of our finest handcrafted cookies, from classic chocolate chip to gourmet shortbread.",
    img: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?q=80&w=800&auto=format&fit=crop",
  },
];

const SignatureCreations = () => {
  return (
    <section className="bg-[#0f1216] text-white py-16 px-4 md:px-20">
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-3">
          Our Signature Creations
        </h2>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Discover a world of unique flavors and handcrafted delights,
          perfected over generations.
        </p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
        {items.map((item, i) => (
          <div
            key={i}
            className="bg-[#1a1d21] rounded-xl border border-white/10 overflow-hidden shadow-lg hover:shadow-xl transition"
          >
            <img
              src={item.img}
              alt={item.title}
              className="w-full h-44 object-cover hover:scale-105 transition-all"
            />
            <div className="p-5">
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SignatureCreations;
