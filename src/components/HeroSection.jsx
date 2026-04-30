import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="w-full bg-black">
      <div className="relative w-full overflow-hidden">
        <img 
          src="/hero.jpg" 
          alt="Sahaba Parfum 306" 
          className="w-full h-auto block" 
        />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
          <h1 className="text-2xl sm:text-4xl md:text-6xl font-black uppercase tracking-[0.2em] md:tracking-[0.4em] mb-2 drop-shadow-2xl">
            SAHABA PARFUM 306
          </h1>
          <p className="text-[8px] sm:text-xs md:text-lg font-light uppercase tracking-widest mb-4 md:mb-8 opacity-90">
            L'essence de l'élégance
          </p>

          <Link 
            to="/shop" 
            className="bg-white text-black px-5 py-2 md:px-12 md:py-4 font-bold uppercase text-[9px] md:text-xs tracking-[0.2em] hover:bg-black hover:text-white transition-all duration-500 shadow-2xl"
          >
            SHOP NOW
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;