import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useCart } from '../context/CartContext';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('30ML');
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, "products", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
    </div>
  );
  
  if (!product) return <div className="p-10 text-center font-bold">Produit introuvable</div>;

  const handleAddToCart = () => {
    addToCart(product, selectedSize, quantity);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-12 flex flex-col md:flex-row gap-8 md:gap-16 bg-white min-h-screen">
      <div className="w-full md:w-1/2">
        <div className="aspect-[4/5] bg-gray-50 rounded-sm overflow-hidden shadow-sm">
          <img 
            src={product.imageUrl || product.image || 'https://via.placeholder.com/600'} 
            alt={product.name} 
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            onError={(e) => { e.target.src = 'https://via.placeholder.com/600'; }}
          />
        </div>
      </div>

      <div className="w-full md:w-1/2 space-y-6 md:space-y-8 flex flex-col justify-center">
        <div>
          <p className="text-[10px] text-gray-400 uppercase tracking-[0.4em] mb-3">{product.category || "Parfum"}</p>
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-gray-900 leading-none">
            {product.name}
          </h1>
          <div className="mt-6 flex items-baseline gap-4">
            <span className="text-3xl font-bold text-red-600">{product.price} DH</span>
            {product.oldPrice && (
              <span className="text-lg text-gray-400 line-through font-medium">{product.oldPrice} DH</span>
            )}
          </div>
        </div>

        <p className="text-gray-600 leading-relaxed text-base md:text-lg border-l-2 border-gray-100 pl-4">
          {product.description || "Une fragrance exceptionnelle de la collection Sahaba Parfum 306."}
        </p>

        <div className="space-y-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-900">Format:</p>
          <div className="grid grid-cols-2 gap-3">
            {['30ML', '25ML'].map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`py-4 rounded-none text-xs font-black transition-all duration-300 border-2 ${
                  selectedSize === size 
                    ? 'bg-black text-white border-black shadow-lg shadow-black/10' 
                    : 'bg-white text-black border-gray-100 hover:border-black'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between bg-gray-50 rounded-none p-1 h-14 w-full border border-gray-200">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                className="w-12 h-full flex items-center justify-center hover:bg-white transition-all font-bold text-xl rounded-none"
              >-</button>
              <span className="font-black text-sm uppercase tracking-widest">Qté: {quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)} 
                className="w-12 h-full flex items-center justify-center hover:bg-white transition-all font-bold text-xl rounded-none"
              >+</button>
            </div>
            
            <button 
              onClick={handleAddToCart}
              className="w-full bg-black text-white h-16 rounded-none font-black uppercase tracking-[0.2em] text-xs hover:bg-zinc-800 transition-all active:scale-[0.98] shadow-xl shadow-black/5 flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Ajouter au panier
            </button>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-50 flex items-center gap-4 text-gray-400">
           <div className="w-10 h-10 bg-gray-50 flex items-center justify-center">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
           </div>
           <p className="text-[10px] font-bold uppercase tracking-widest">En stock - Livraison rapide 40 DH</p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;