import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const price = Number(product.price30);
  const oldPrice = product.oldPrice30 ? Number(product.oldPrice30) : null;

  const discount = (oldPrice && price < oldPrice) 
    ? Math.round(((oldPrice - price) / oldPrice) * 100) 
    : 0;

  return (
    <div className="group relative bg-white border border-gray-100 flex flex-col items-center p-2 md:p-4 hover:shadow-md transition-shadow duration-300 h-full">
      
      {discount > 0 && (
        <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-black px-2 py-1 z-10 uppercase tracking-tighter">
          -{discount}%
        </span>
      )}

      <Link to={`/product/${product.id}`} className="aspect-[3/4] w-full overflow-hidden mb-4 bg-gray-100">
        <img 
          src={product.imageUrl || product.image || 'https://via.placeholder.com/400'} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
      </Link>

      <div className="text-center w-full space-y-2 mt-auto">
        <p className="text-[9px] text-gray-400 uppercase tracking-[0.3em] font-medium">{product.category}</p>
        
        <Link to={`/product/${product.id}`}>
          <h3 className="text-xs md:text-sm font-black text-black uppercase tracking-tight truncate">
            {product.name}
          </h3>
        </Link>
        
        <div className="flex justify-center items-center gap-2">
          <span className="text-red-600 font-black text-sm md:text-lg">{price} DH</span>
          {oldPrice && (
            <span className="text-gray-300 line-through text-[10px] md:text-xs font-bold">{oldPrice} DH</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;