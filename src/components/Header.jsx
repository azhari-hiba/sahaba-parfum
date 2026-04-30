import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Header = () => {
  const { cartItems } = useCart();

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-20 flex justify-between items-center">
        
        <nav className="hidden md:flex gap-8 items-center flex-1">
          <Link 
            to="/femme" 
            className="text-[10px] font-black uppercase tracking-[0.2em] hover:text-red-600 transition"
          >
            Femme
          </Link>
          <Link 
            to="/homme" 
            className="text-[10px] font-black uppercase tracking-[0.2em] hover:text-red-600 transition"
          >
            Homme
          </Link>
        </nav>

        <Link to="/" className="flex justify-center items-center">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-50 shadow-sm">
            <img 
              src="/logo.jpeg" 
              alt="Sahaba 306 Logo" 
              className="w-full h-full object-cover" 
            />
          </div>
        </Link>

        <div className="flex-1 flex justify-end">
          <Link to="/cart" className="relative p-2 group">
            <svg className="w-6 h-6 group-hover:text-red-600 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            
            {cartItems?.length > 0 && (
              <span className="absolute top-0 right-0 bg-red-600 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center animate-bounce">
                {cartItems.length}
              </span>
            )}
          </Link>
        </div>
      </div>

      <div className="md:hidden flex justify-center gap-10 pb-3 border-t pt-2 bg-gray-50/50">
          <Link to="/femme" className="text-[10px] font-black uppercase tracking-widest hover:text-red-600 transition">Femme</Link>
          <Link to="/homme" className="text-[10px] font-black uppercase tracking-widest hover:text-red-600 transition">Homme</Link>
      </div>
    </header>
  );
};

export default Header;