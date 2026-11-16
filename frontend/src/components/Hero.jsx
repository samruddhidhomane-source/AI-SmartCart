import { useEffect, useState } from "react";

const offers = [
  {
    badge: "🔥 LIMITED TIME OFFER",
    title: "Big Deals Are Here",
    subtitle: "Save more on your favorite products today.",
    button: "View Deals",
  },
  {
    badge: "🤖 SMART SHOPPING",
    title: "Shop Smarter With AI",
    subtitle: "Discover products recommended specially for you.",
    button: "Explore Products",
  },
  {
    badge: "⚡ MEGA SALE",
    title: "Upgrade Your Lifestyle",
    subtitle: "Latest technology at prices you'll love.",
    button: "Shop Now",
  },
];

function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % offers.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const offer = offers[current];

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-700 text-white">

      {/* Decorative circles */}

      <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/10 rounded-full blur-2xl"></div>

      <div className="absolute -bottom-32 -left-20 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl"></div>


      <div className="relative max-w-7xl mx-auto px-8 py-20">

        <div className="grid md:grid-cols-2 items-center gap-12">

          {/* LEFT SIDE */}

          <div>

            <span className="inline-block bg-white/15 backdrop-blur-md px-4 py-2 rounded-full text-sm font-semibold mb-6">
              {offer.badge}
            </span>

            <p className="text-lg mb-4">
              🤖 Welcome to AI SmartCart
            </p>

            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
              {offer.title}
            </h1>

            <p className="text-xl text-blue-100 mb-8 max-w-xl">
              {offer.subtitle}
            </p>

            <button className="bg-white text-blue-700 font-bold px-8 py-4 rounded-xl hover:scale-105 hover:shadow-xl transition duration-300">
              {offer.button} →
            </button>

          </div>


          {/* RIGHT SIDE */}

          <div className="hidden md:flex justify-center">

            <div className="relative">

              <div className="w-72 h-72 bg-white/10 backdrop-blur-lg rounded-full flex items-center justify-center">

                <div className="text-8xl">
                  🛍️
                </div>

              </div>

              <div className="absolute -top-5 -right-5 bg-white text-blue-700 px-4 py-2 rounded-xl shadow-lg font-bold">
                ⚡ Smart Deals
              </div>

              <div className="absolute -bottom-5 -left-5 bg-white text-purple-700 px-4 py-2 rounded-xl shadow-lg font-bold">
                🤖 AI Powered
              </div>

            </div>

          </div>

        </div>


        {/* SLIDER DOTS */}

        <div className="flex gap-2 mt-12">

          {offers.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`h-3 rounded-full transition-all ${
                current === index
                  ? "w-8 bg-white"
                  : "w-3 bg-white/50"
              }`}
            />
          ))}

        </div>

      </div>

    </section>
  );
}

export default Hero;