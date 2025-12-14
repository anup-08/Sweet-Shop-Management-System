import React from "react";

const SweetStory = () => {
  return (
    <section className="bg-[#0f1216] text-white py-6 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Our Sweet Story
        </h2>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          At Sweet Indulgence, we believe in bringing joy through exceptional
          desserts. Each treat is a labor of love, made with the finest
          ingredients and a touch of magic, inspired by generations of cherished
          family recipes. We invite you to experience the difference and find
          your perfect moment of sweet bliss.
        </p>
      </div>

      <div className="border-b border-white/10 mt-16"></div>

      <footer className="text-center text-gray-400 text-xs sm:text-sm mt-6">
        © 2024 Sweet Indulgence. All rights reserved.
      </footer>
    </section>
  );
};

export default SweetStory;
