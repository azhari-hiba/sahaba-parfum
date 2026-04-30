import React, { useState, useEffect, useRef } from 'react';
import { db, auth } from '../firebase/config';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [whatsappPhone, setWhatsappPhone] = useState("");
  const [savingPhone, setSavingPhone] = useState(false);
  const productsPerPage = 16;
  const stockRef = useRef(null);
  const navigate = useNavigate();

  const [form, setForm] = useState({ 
    name: '', price: '', oldPrice: '', category: 'Femme', 
    stock30: 0, stock25: 0, imageURL: '', description: '' 
  });

  useEffect(() => {
    fetchProducts();
    fetchWhatsApp();
  }, []);

  const fetchWhatsApp = async () => {
    try {
      const docSnap = await getDocs(collection(db, "settings"));
      const settings = docSnap.docs.find(d => d.id === "whatsapp");
      if (settings) setWhatsappPhone(settings.data().phone);
    } catch (err) { console.error(err); }
  };

  const handleUpdateWhatsApp = async () => {
    setSavingPhone(true);
    try {
      await setDoc(doc(db, "settings", "whatsapp"), { phone: whatsappPhone });
      Swal.fire({ 
        title: 'Succès', 
        text: 'Numéro WhatsApp mis à jour !', 
        icon: 'success',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'bg-black text-white px-6 py-2 rounded-lg'
        },
        buttonsStyling: false
      });
    } catch (err) { 
      Swal.fire({ title: 'Erreur', text: 'Impossible de mettre à jour.', icon: 'error' }); 
    } finally { setSavingPhone(false); }
  };

  const fetchProducts = async () => {
    try {
      const data = await getDocs(collection(db, "products"));
      setProducts(data.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    } catch (err) { console.error(err); }
  };

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Déconnexion',
      text: 'Voulez-vous vraiment quitter la session ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, déconnecter',
      cancelButtonText: 'Annuler',
      customClass: {
        confirmButton: 'bg-black text-white px-6 py-2 rounded-lg m-2',
        cancelButton: 'bg-gray-400 text-white px-6 py-2 rounded-lg m-2'
      },
      buttonsStyling: false
    });

    if (result.isConfirmed) {
      try {
        await signOut(auth);
        navigate('/login');
      } catch (error) {
        Swal.fire('Erreur', 'Échec de la déconnexion.', 'error');
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    const productData = {
      name: form.name,
      price: Number(form.price),
      oldPrice: Number(form.oldPrice) || 0,
      stock30: Number(form.stock30) || 0,
      stock25: Number(form.stock25) || 0,
      category: form.category,
      imageUrl: form.imageURL,
      updatedAt: serverTimestamp()
    };
    try {
      if (editingId) {
        await updateDoc(doc(db, "products", editingId), productData);
        Swal.fire({ 
          title: 'Modifié', 
          text: 'Le produit a été mis à jour.', 
          icon: 'success',
          customClass: { confirmButton: 'bg-black text-white px-6 py-2 rounded-lg' },
          buttonsStyling: false
        });
      } else {
        await addDoc(collection(db, "products"), { ...productData, createdAt: serverTimestamp() });
        Swal.fire({ 
          title: 'Ajouté', 
          text: 'Produit ajouté avec succès.', 
          icon: 'success',
          customClass: { confirmButton: 'bg-black text-white px-6 py-2 rounded-lg' },
          buttonsStyling: false
        });
      }
      resetForm(); 
      fetchProducts();
    } catch (error) { 
      Swal.fire('Erreur', error.message, 'error'); 
    } finally { setLoading(false); }
  };

  const resetForm = () => {
    setForm({ name: '', price: '', oldPrice: '', category: 'Femme', stock30: 0, stock25: 0, imageURL: '', description: '' });
    setEditingId(null);
  };

  const startEdit = (p) => {
    setEditingId(p.id);
    setForm({
      name: p.name, price: p.price, oldPrice: p.oldPrice || '', category: p.category,
      stock30: p.stock30, stock25: p.stock25, imageURL: p.imageUrl || p.image,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteProduct = async (id) => {
    const result = await Swal.fire({
      title: 'Supprimer ?',
      text: 'Cette action est irréversible !',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Supprimer',
      cancelButtonText: 'Annuler',
      customClass: {
        confirmButton: 'bg-red-600 text-white px-6 py-2 rounded-lg m-2',
        cancelButton: 'bg-gray-400 text-white px-6 py-2 rounded-lg m-2'
      },
      buttonsStyling: false
    });
    if (result.isConfirmed) { 
      await deleteDoc(doc(db, "products", id)); 
      fetchProducts(); 
    }
  };

  const filteredProducts = products.filter(p => 
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100 sticky top-4 z-40">
           <div className="flex items-center gap-4">
             <h1 className="font-black uppercase italic text-sm tracking-tighter text-black">Admin Sahaba 306</h1>
             <button onClick={handleLogout} className="text-[10px] font-black text-red-600 uppercase border border-red-200 px-4 py-1.5 rounded-full hover:bg-red-50 transition">Déconnexion</button>
           </div>
           <button 
             onClick={() => stockRef.current?.scrollIntoView({ behavior: 'smooth' })}
             className="bg-black text-white px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-gray-800 transition"
           >
             Gérer le Stock ↓
           </button>
        </div>

        {/* WhatsApp */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <label className="text-[9px] font-black uppercase text-green-600 tracking-widest mb-2 block ml-1">Numéro WhatsApp Commercial</label>
          <div className="flex flex-col md:flex-row gap-4">
            <input type="text" placeholder="2126XXXXXXXX" className="flex-1 border p-3 rounded-lg outline-none bg-gray-50 text-sm font-bold" value={whatsappPhone} onChange={e => setWhatsappPhone(e.target.value)} />
            <button onClick={handleUpdateWhatsApp} disabled={savingPhone} className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold uppercase text-[10px] tracking-widest">
              {savingPhone ? '...' : 'Enregistrer'}
            </button>
          </div>
        </div>

        {/* Formulaire */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xs font-black mb-6 uppercase tracking-widest">{editingId ? '📝 Modifier Produit' : '✨ Nouveau Produit'}</h2>
          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="text-[9px] font-black uppercase text-gray-400 tracking-widest mb-1 ml-1">Nom du Parfum</label>
              <input type="text" className="w-full border rounded-lg p-3 outline-none focus:border-black" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            </div>
            <div>
              <label className="text-[9px] font-black uppercase text-gray-400 tracking-widest mb-1 ml-1">Catégorie</label>
              <select className="w-full border rounded-lg p-3 outline-none bg-white" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                <option value="Femme">Femme</option>
                <option value="Homme">Homme</option>
              </select>
            </div>
            <div>
              <label className="text-[9px) font-black uppercase text-gray-400 tracking-widest mb-1 ml-1">Prix de vente (DH)</label>
              <input type="number" className="w-full border rounded-lg p-3 outline-none" required value={form.price} onChange={e => setForm({...form, price: e.target.value})} />
            </div>
            <div>
              <label className="text-[9px] font-black uppercase text-gray-400 tracking-widest mb-1 ml-1">Ancien Prix (Promo)</label>
              <input type="number" className="w-full border rounded-lg p-3 outline-none text-red-500" value={form.oldPrice} onChange={e => setForm({...form, oldPrice: e.target.value})} />
            </div>
            <div>
              <label className="text-[9px] font-black uppercase text-gray-400 tracking-widest mb-1 ml-1">Image URL</label>
              <input type="text" className="w-full border rounded-lg p-3 outline-none" required value={form.imageURL} onChange={e => setForm({...form, imageURL: e.target.value})} />
            </div>
            <div>
              <label className="text-[9px] font-black uppercase text-gray-400 tracking-widest mb-1 ml-1">Stock 30ml</label>
              <input type="number" className="w-full border rounded-lg p-3 outline-none bg-gray-50 font-bold" value={form.stock30} onChange={e => setForm({...form, stock30: e.target.value})} />
            </div>
            <div>
              <label className="text-[9px] font-black uppercase text-gray-400 tracking-widest mb-1 ml-1">Stock 25ml</label>
              <input type="number" className="w-full border rounded-lg p-3 outline-none bg-gray-50 font-bold" value={form.stock25} onChange={e => setForm({...form, stock25: e.target.value})} />
            </div>
            <div className="flex items-end gap-2">
              <button type="submit" className="flex-1 bg-black text-white rounded-lg py-3 font-black uppercase text-[10px] tracking-widest hover:bg-gray-800">
                {loading ? 'Chargement...' : (editingId ? 'Mettre à jour' : 'Ajouter')}
              </button>
              {editingId && <button type="button" onClick={resetForm} className="bg-gray-200 px-4 rounded-lg font-bold">Annuler</button>}
            </div>
          </form>
        </div>

        {/* Liste */}
        <div ref={stockRef} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 bg-black text-white flex flex-col md:flex-row justify-between items-center gap-4">
            <h2 className="font-black text-[10px] uppercase tracking-widest">Liste des Produits ({filteredProducts.length})</h2>
            <input 
              type="text" 
              placeholder="RECHERCHER..." 
              className="w-full md:w-64 bg-white/10 border border-white/20 rounded-lg py-2 px-4 text-[10px] outline-none focus:bg-white focus:text-black"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            />
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-[9px] uppercase font-black text-gray-400 border-b">
                <tr>
                  <th className="p-4">Produit</th>
                  <th className="p-4 text-center">Genre</th>
                  <th className="p-4 text-center">Stock</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentItems.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <img src={p.imageUrl || p.image} className="w-10 h-12 object-cover rounded shadow-sm" alt="" />
                      <div className="flex flex-col">
                        <span className="font-bold text-xs uppercase text-black">{p.name}</span>
                        <span className="text-[10px] font-black text-gray-400">{p.price} DH</span>
                      </div>
                    </td>
                    <td className="p-4 text-center text-[9px] font-bold text-gray-500 uppercase">{p.category}</td>
                    <td className="p-4 text-center">
                      <div className="flex flex-col text-[9px] font-bold">
                        <span className={Number(p.stock30) <= 2 ? 'text-red-600 bg-red-50 px-1 rounded' : 'text-gray-500'}>30ml: {p.stock30}</span>
                        <span className={Number(p.stock25) <= 2 ? 'text-red-600 bg-red-50 px-1 rounded' : 'text-gray-500'}>25ml: {p.stock25}</span>
                      </div>
                    </td>
                    <td className="p-4 text-right space-x-4">
                      <button onClick={() => startEdit(p)} className="text-[10px] font-black uppercase text-gray-400 hover:text-black">Editer</button>
                      <button onClick={() => deleteProduct(p.id)} className="text-[10px] font-black uppercase text-red-300 hover:text-red-600">Supprimer</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredProducts.length > productsPerPage && (
            <div className="p-4 border-t flex justify-center items-center gap-4 bg-gray-50">
              <button disabled={currentPage === 1} onClick={() => { setCurrentPage(p => p - 1); stockRef.current?.scrollIntoView(); }} className="px-4 py-2 border bg-white text-[9px] font-black uppercase disabled:opacity-20">Précédent</button>
              <span className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Page {currentPage}</span>
              <button disabled={indexOfLastProduct >= filteredProducts.length} onClick={() => { setCurrentPage(p => p + 1); stockRef.current?.scrollIntoView(); }} className="px-4 py-2 bg-black text-white text-[9px] font-black uppercase disabled:opacity-20">Suivant</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;