export const sendOrderToWhatsApp = (clientData, cart, total, whatsappNumber) => {
  const deliveryFee = 40;
  const finalTotal = total + deliveryFee;

  let message = `*Nouvelle Commande - Sahaba Parfum 306*\n\n`;
  message += `*Nom:* ${clientData.nom}\n`;
  message += `*Télé:* ${clientData.tele}\n`;
  message += `*Ville:* ${clientData.ville}\n`;
  message += `*Adresse:* ${clientData.adresse}\n\n`;
  
  message += `*Produits:*\n`;
  cart.forEach(item => {
    message += `- ${item.name} (${item.selectedSize}) : ${item.price} DH\n`;
  });

  message += `\n*Sous-total:* ${total} DH`;
  message += `\n*Livraison:* ${deliveryFee} DH`;
  message += `\n*TOTAL:* ${finalTotal} DH`;

  const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
};