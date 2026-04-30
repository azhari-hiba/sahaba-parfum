import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { doc, onSnapshot } from 'firebase/firestore';
import { Link } from 'react-router-dom'; // Import du Link

const Footer = () => {
  const [whatsappPhone, setWhatsappPhone] = useState("212693312011");

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "settings", "whatsapp"), (doc) => {
      if (doc.exists()) {
        setWhatsappPhone(doc.data().phone);
      }
    });
    return () => unsub();
  }, []);

  return (
    <footer className="bg-black text-white py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-10 text-center md:text-left">
        <div>
          <h3 className="text-[#D4AF37] font-bold mb-4 uppercase tracking-widest text-sm">Sahaba Parfum 306</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Spécialiste des parfums haut de gamme. Qualité et tenue longue durée garanties.
          </p>
        </div>
        <div>
          <h4 className="font-bold mb-4 text-sm uppercase">Livraison</h4>
          <p className="text-gray-400 text-sm">Livraison rapide partout au Maroc pour seulement 40 DH.</p>
        </div>
        <div>
          <h4 className="font-bold mb-4 text-sm uppercase">Contact</h4>
          <p className="text-gray-400 text-sm mb-1 uppercase font-bold text-[10px] tracking-widest text-green-500">WhatsApp direct</p>
          <a 
            href={`https://wa.me/${whatsappPhone}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-400 text-sm hover:text-white transition-colors block"
          >
            +{whatsappPhone}
          </a>
          <p className="text-gray-400 text-sm mt-2">Email: sahabaparfum@gmail.com</p>
        </div>
      </div>

      <div className="border-t border-gray-800 mt-10 pt-6 text-center text-[10px] text-gray-500 uppercase tracking-widest">
        &copy; 2026 
        <Link 
          to="/admin" 
          className="cursor-default hover:text-gray-500 transition-none select-none ml-1"
          style={{ color: 'inherit', textDecoration: 'none' }}
        >
          Sahaba Parfum 306
        </Link>
        . Powered by Hipatya Dev.
      </div>
    </footer>
  );
};

export default Footer;