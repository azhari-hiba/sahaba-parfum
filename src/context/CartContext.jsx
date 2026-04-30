import React, { createContext, useContext, useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('sahaba_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('sahaba_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, size, quantity = 1) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.id === product.id && item.size === size
      );

      // Notification de succès en Français
      Swal.fire({
        title: 'Ajouté !',
        text: `${product.name} (${size}) a été ajouté au panier.`,
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
        toast: true,
        position: 'top-end',
      });

      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id && item.size === size
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      return [...prevItems, { 
        id: product.id, 
        name: product.name, 
        price: product.price, 
        image: product.imageUrl || product.image, 
        size, 
        quantity 
      }];
    });
  };

  const removeFromCart = async (id, size, name) => {
    // Demander confirmation avant de supprimer
    const result = await Swal.fire({
      title: 'Supprimer ?',
      text: `Voulez-vous retirer ${name} du panier ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
      customClass: {
        confirmButton: 'bg-red-600 text-white px-6 py-2 rounded-lg m-2',
        cancelButton: 'bg-gray-400 text-white px-6 py-2 rounded-lg m-2'
      },
      buttonsStyling: false
    });

    if (result.isConfirmed) {
      setCartItems(cartItems.filter(item => !(item.id === id && item.size === size)));
      
      Swal.fire({
        title: 'Retiré',
        text: 'Le produit a été supprimé du panier.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
        toast: true,
        position: 'top-end',
      });
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);