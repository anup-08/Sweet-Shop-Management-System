
const Hero = () => {
  return (
    <section className="relative w-full">
      <div className="absolute inset-0 md:px-20 px-4 bg-[#0f1216]">
        <img
          src="https://plus.unsplash.com/premium_photo-1729038877250-3af682084f07?q=80&w=885&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="sweets"
          className="w-full h-[67vh] md:h-[83vh] object-cover rounded-2xl"
        />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="text-center text-white">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight drop-shadow-lg">
            Sweet Indulgence:
            <br />
            <span className="block">Where Every Bite is a Delight</span>
          </h1>

          <p className="mt-4 text-gray-100 max-w-2xl mx-auto text-sm sm:text-base">
            Crafting exquisite treats with passion and precision, made to sweeten your moments.
          </p>

          <div className="mt-8 flex items-center justify-center gap-4">
            <a
              href="/shop"
              className="px-6 py-3 rounded-full bg-pink-600 hover:bg-pink-700 text-white font-medium text-lg transition"
            >
              Explore Sweets
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
