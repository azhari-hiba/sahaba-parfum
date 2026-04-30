import React from 'react';

const CategorySection = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="group relative h-[300px] md:h-[450px] cursor-pointer overflow-hidden border border-gray-100 shadow-sm">
          <img src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=800" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Femme" />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-all flex items-center justify-center">
            <span className="bg-white px-10 py-4 text-xs font-black uppercase tracking-widest shadow-2xl">Femme</span>
          </div>
        </div>
        
        <div className="group relative h-[300px] md:h-[450px] cursor-pointer overflow-hidden border border-gray-100 shadow-sm">
          <img src="https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=800" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Homme" />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-all flex items-center justify-center">
            <span className="bg-white px-10 py-4 text-xs font-black uppercase tracking-widest shadow-2xl">Homme</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategorySection;