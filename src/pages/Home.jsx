import React, { useEffect, useState } from 'react';
import { db } from '../firebase/config';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const querySnapshot = await getDocs(collection(db, "products"));
        const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const available = docs.filter(p => (Number(p.stock30) > 0 || Number(p.stock25) > 0));
        setProducts(available);

        const q = query(collection(db, "products"), orderBy("createdAt", "desc"), limit(2));
        const newSnap = await getDocs(q);
        setNewArrivals(newSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredProducts = products.filter(p => 
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const femmeLimit = filteredProducts.filter(p => p.category?.toLowerCase() === 'femme').slice(0, 4);
  const hommeLimit = filteredProducts.filter(p => p.category?.toLowerCase() === 'homme').slice(0, 4);

  if (loading) return <div className="flex justify-center items-center h-screen animate-pulse uppercase font-black tracking-widest text-xs">Chargement...</div>;

  return (
    <div className="bg-white min-h-screen">
      <HeroSection />

      <div className="max-w-md mx-auto px-6 mt-10 mb-4">
        <div className="relative group border-b border-gray-100">
          <input 
            type="text"
            placeholder="RECHERCHER UN PARFUM..."
            className="w-full py-3 px-2 focus:border-black outline-none transition-all text-center text-[11px] font-bold tracking-[0.2em] uppercase bg-transparent"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-black">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h2 className="text-xl font-black uppercase tracking-[0.4em] mb-3">Nouveautés</h2>
          <div className="w-10 h-1 bg-black mx-auto"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {newArrivals.map(product => <ProductCard key={product.id} product={product} />)}
        </div> 
      </div>

      {searchTerm && (
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h2 className="text-[10px] font-black uppercase mb-6 tracking-widest text-red-600 px-2">Résultats pour: "{searchTerm}"</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {filteredProducts.length > 0 ? (
              filteredProducts.map(product => <ProductCard key={product.id} product={product} />)
            ) : (
              <p className="col-span-full text-center py-10 text-gray-400 italic text-xs uppercase tracking-widest">Aucun parfum trouvé.</p>
            )}
          </div>
          <div className="my-12 border-t border-dashed border-gray-100"></div>
        </div>
      )}

      {!searchTerm && (
        <>
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex justify-between items-end mb-8 border-b border-gray-100 pb-4">
              <h2 className="text-lg font-bold uppercase italic tracking-tighter">Collection Femme</h2>
              <Link to="/femme" className="text-[9px] font-black border-b border-black pb-1 hover:text-gray-500 uppercase tracking-[0.2em]">
                Voir Tout
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              {femmeLimit.map(product => <ProductCard key={product.id} product={product} />)}
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 py-12 bg-gray-50/30">
            <div className="flex justify-between items-end mb-8 border-b border-gray-100 pb-4">
              <h2 className="text-lg font-bold uppercase italic tracking-tighter">Collection Homme</h2>
              <Link to="/homme" className="text-[9px] font-black border-b border-black pb-1 hover:text-gray-500 uppercase tracking-[0.2em]">
                Voir Tout
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              {hommeLimit.map(product => <ProductCard key={product.id} product={product} />)}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;