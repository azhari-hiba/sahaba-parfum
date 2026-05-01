import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import Swal from 'sweetalert2';

const Cart = () => {
  const { cartItems, clearCart, removeFromCart } = useCart();
  const [adminPhone, setAdminPhone] = useState("");
  const [client, setClient] = useState({ nom: '', villeSelect: 'Safi', villeAutre: '', adresse: '', tele: '' });

  const delivery = client.villeSelect === 'Safi' ? 0 : 40;
  const total = cartItems?.reduce((acc, item) => acc + (item.price * item.quantity), 0) || 0;

  useEffect(() => {
    const fetchSettings = async () => {
      const docRef = doc(db, "settings", "whatsapp");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) setAdminPhone(docSnap.data().phone);
    };
    fetchSettings();
  }, []);

  const handleWhatsAppOrder = (e) => {
    e.preventDefault();
    
    if (!cartItems || cartItems.length === 0) {
      Swal.fire({
        title: 'Panier vide',
        text: 'Votre panier est vide ! Ajoutez des produits avant de commander.',
        icon: 'info',
        confirmButtonText: 'OK',
        customClass: { confirmButton: 'bg-black text-white px-6 py-2 rounded-lg' },
        buttonsStyling: false
      });
      return;
    }

    const finalVille = client.villeSelect === 'Safi' ? 'Safi' : client.villeAutre;

    let message = `*SAHABA PARFUM 306 - NOUVELLE COMMANDE*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━\n\n`;
    message += `👤 *CLIENT*\n`;
    message += `• *Nom:* ${client.nom}\n`;
    message += `• *Télé:* ${client.tele}\n`;
    message += `• *Ville:* ${finalVille}\n`;
    message += `• *Adresse:* ${client.adresse}\n\n`;
    
    message += `📦 *PRODUITS*\n`;
    cartItems.forEach(item => {
      message += `• ${item.name} (${item.size})\n`;
      message += `   Qty: ${item.quantity} | ${item.price} DH\n`;
    });
    
    message += `\n━━━━━━━━━━━━━━━━━━━━\n`;
    message += `💰 *DÉTAILS DU PAIEMENT*\n`;
    message += `• Sous-total: ${total} DH\n`;
    message += `• Frais de livraison: ${delivery === 0 ? 'GRATUIT' : delivery + ' DH'}\n`;
    message += `• *TOTAL À PAYER: ${total + delivery} DH*\n\n`;
    message += `━━━━━━━━━━━━━━━━━━━━\n`;
    message += `_Commande envoyée depuis le site web._`;

    const waURL = `https://wa.me/${adminPhone}?text=${encodeURIComponent(message)}`;
    window.open(waURL, '_blank');
    
    clearCart();

    Swal.fire({
      title: 'Commande Envoyée',
      text: 'Votre commande a été transmise via WhatsApp.',
      icon: 'success',
      confirmButtonText: 'Super',
      customClass: { confirmButton: 'bg-green-600 text-white px-6 py-2 rounded-lg' },
      buttonsStyling: false
    });
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-12 min-h-[70vh]">
      <div className="mb-12 border-b pb-6">
        <h1 className="text-3xl font-black uppercase italic tracking-tighter">Mon Panier</h1>
        <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-2">Finalisez votre commande de luxe</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="space-y-6">
          {!cartItems || cartItems.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 border-2 border-dashed rounded-xl">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Votre panier est vide</p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="flex gap-4 border-b pb-4 items-center group">
                    <img src={item.image} alt={item.name} className="w-16 h-20 object-cover rounded shadow-sm" />
                    <div className="flex-1">
                      <h3 className="font-black text-xs uppercase tracking-tight">{item.name}</h3>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">{item.size} • Qté: {item.quantity}</p>
                      <p className="font-bold text-sm mt-1">{item.price} DH</p>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id, item.size, item.name)} 
                      className="text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              <div className="pt-6 space-y-2 border-t-2 border-black">
                <div className="flex justify-between text-[10px] font-bold uppercase text-gray-400">
                  <span>Sous-total</span>
                  <span>{total} DH</span>
                </div>
                <div className="flex justify-between text-[10px] font-bold uppercase text-green-600">
                  <span>Livraison</span>
                  <span>{delivery === 0 ? 'Gratuit' : `${delivery} DH`}</span>
                </div>
                <div className="flex justify-between text-xl font-black pt-2">
                  <span>TOTAL</span>
                  <span>{total + delivery} DH</span>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="bg-white p-8 border rounded-xl shadow-sm h-fit">
          <h2 className="text-xs font-black mb-8 uppercase tracking-[0.3em] border-b pb-4 text-center">Détails de Livraison</h2>
          <form onSubmit={handleWhatsAppOrder} className="space-y-5">
            <div>
              <label className="text-[9px] font-black uppercase text-gray-400 tracking-widest ml-1">Nom Complet</label>
              <input type="text" className="w-full p-3 mt-1 border rounded-lg text-sm focus:border-black outline-none transition-all bg-gray-50" required onChange={(e) => setClient({...client, nom: e.target.value})} />
            </div>
            
            <div>
              <label className="text-[9px] font-black uppercase text-gray-400 tracking-widest ml-1">Téléphone</label>
              <input type="tel" className="w-full p-3 mt-1 border rounded-lg text-sm focus:border-black outline-none transition-all bg-gray-50" required onChange={(e) => setClient({...client, tele: e.target.value})} />
            </div>

            <div>
              <label className="text-[9px] font-black uppercase text-gray-400 tracking-widest ml-1">Ville</label>
              <select 
                className="w-full p-3 mt-1 border rounded-lg text-sm focus:border-black outline-none transition-all bg-gray-50" 
                value={client.villeSelect}
                required
                onChange={(e) => setClient({...client, villeSelect: e.target.value})}
              >
                <option value="Safi">Safi (Livraison Gratuite)</option>
                <option value="Autre">Autre Ville (+40 DH)</option>
              </select>
            </div>

            {client.villeSelect === 'Autre' && (
              <div className="animate-fade-in">
                <label className="text-[9px] font-black uppercase text-gray-400 tracking-widest ml-1">Précisez votre ville</label>
                <input 
                  type="text" 
                  className="w-full p-3 mt-1 border rounded-lg text-sm focus:border-black outline-none transition-all bg-gray-50 border-blue-100" 
                  required 
                  placeholder="Ex: Casablanca, Marrakech..."
                  onChange={(e) => setClient({...client, villeAutre: e.target.value})} 
                />
              </div>
            )}

            <div>
              <label className="text-[9px] font-black uppercase text-gray-400 tracking-widest ml-1">Adresse Complète</label>
              <textarea className="w-full p-3 mt-1 border rounded-lg text-sm focus:border-black outline-none transition-all bg-gray-50 h-24 resize-none" required onChange={(e) => setClient({...client, adresse: e.target.value})}></textarea>
            </div>

            <button type="submit" className="w-full bg-[#25D366] text-white py-4 rounded-lg font-black uppercase text-[10px] tracking-[0.2em] hover:bg-black transition-all flex items-center justify-center gap-2">
               <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
               CONFIRMER SUR WHATSAPP
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Cart;