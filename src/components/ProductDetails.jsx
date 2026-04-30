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
    // L'alerte SweetAlert "Ajouté !" est déjà gérée à l'intérieur de addToCart (CartContext)
    addToCart(product, selectedSize, quantity);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-12 flex flex-col md:flex-row gap-12 bg-white">
      {/* Image Section */}
      <div className="w-full md:w-1/2">
        <div className="aspect-[4/5] bg-gray-50 rounded-2xl overflow-hidden shadow-sm">
          <img 
            src={product.imageUrl || product.image || 'https://via.placeholder.com/600'} 
            alt={product.name} 
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            onError={(e) => { e.target.src = 'https://via.placeholder.com/600'; }}
          />
        </div>
      </div>

      {/* Info Section */}
      <div className="w-full md:w-1/2 space-y-8 py-2">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-[0.3em] mb-2">{product.category || "Parfum"}</p>
          <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-tighter text-gray-900">
            {product.name}
          </h1>
          <div className="mt-4 flex items-center gap-4">
            <span className="text-3xl font-bold text-red-600">{product.price} DH</span>
            {product.oldPrice && (
              <span className="text-xl text-gray-400 line-through">{product.oldPrice} DH</span>
            )}
          </div>
        </div>

        <p className="text-gray-600 leading-relaxed text-lg">
          {product.description || "Une fragrance exceptionnelle de la collection Sahaba Parfum 306."}
        </p>

        {/* Size Selection */}
        <div className="space-y-4">
          <p className="text-sm font-bold uppercase tracking-widest">Choisir le volume:</p>
          <div className="flex gap-4">
            {['30ML', '25ML'].map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`flex-1 py-4 border-2 font-black transition-all duration-300 ${
                  selectedSize === size 
                    ? 'bg-black text-white border-black' 
                    : 'bg-white text-black border-gray-200 hover:border-black'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Quantity and CTA */}
        <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
          <div className="flex items-center border-2 border-black h-14 w-full sm:w-auto">
            <button 
              onClick={() => setQuantity(Math.max(1, quantity - 1))} 
              className="px-6 h-full hover:bg-gray-100 transition font-bold"
            >-</button>
            <span className="px-6 font-bold text-lg w-12 text-center">{quantity}</span>
            <button 
              onClick={() => setQuantity(quantity + 1)} 
              className="px-6 h-full hover:bg-gray-100 transition font-bold"
            >+</button>
          </div>
          
          <button 
            onClick={handleAddToCart}
            className="flex-1 bg-black text-white h-14 w-full px-8 rounded-none font-black uppercase tracking-[0.2em] hover:bg-gray-800 transition-all duration-300 shadow-lg"
          >
            Ajouter au panier
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;