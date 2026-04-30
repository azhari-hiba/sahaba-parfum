import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const discount = product.oldPrice 
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) 
    : 0;

  return (
    <div className="group relative bg-white border border-gray-100 flex flex-col items-center p-2 md:p-4 hover:shadow-md transition-shadow duration-300">
      
      {discount > 0 && (
        <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 z-10 uppercase">
          -{discount}%
        </span>
      )}

      <Link to={`/product/${product.id}`} className="aspect-[3/4] w-full overflow-hidden mb-4 bg-gray-50">
        <img 
          src={product.imageUrl || product.image} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </Link>

      <div className="text-center w-full space-y-2">
        <p className="text-[10px] text-gray-400 uppercase tracking-widest">{product.category}</p>
        
        <Link to={`/product/${product.id}`}>
          <h3 className="text-sm font-bold text-gray-800 uppercase tracking-tighter truncate hover:text-red-600 transition">
            {product.name}
          </h3>
        </Link>
        
        <div className="flex justify-center items-center gap-2">
          <span className="text-red-600 font-bold text-lg">{product.price} DH</span>
          {product.oldPrice && (
            <span className="text-gray-400 line-through text-xs">{product.oldPrice} DH</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;