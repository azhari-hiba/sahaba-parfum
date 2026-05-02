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
  const productsPerPage = 14; 
  const stockRef = useRef(null);
  const navigate = useNavigate();

  const [form, setForm] = useState({ 
    name: '', price30: '', oldPrice30: '', price25: '', oldPrice25: '',
    category: 'Femme', stock30: '0', stock25: '0', imageURL: '', description: '' 
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
    try {
      await setDoc(doc(db, "settings", "whatsapp"), { phone: whatsappPhone });
      Swal.fire({ 
        title: 'Succès', 
        text: 'WhatsApp mis à jour !', 
        icon: 'success', 
        timer: 1500,
        confirmButtonColor: '#000000'
      });
    } catch (err) { Swal.fire({ title: 'Erreur', icon: 'error', confirmButtonColor: '#000000' }); }
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
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, Sortir',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#000000',
      cancelButtonColor: '#d33',
    });
    if (result.isConfirmed) {
      await signOut(auth);
      navigate('/login');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    const productData = {
      name: form.name,
      price30: form.price30 !== '' ? parseInt(form.price30, 10) : null,
      oldPrice30: form.oldPrice30 !== '' ? parseInt(form.oldPrice30, 10) : null,
      price25: form.price25 !== '' ? parseInt(form.price25, 10) : null,
      oldPrice25: form.oldPrice25 !== '' ? parseInt(form.oldPrice25, 10) : null,
      stock30: form.stock30 !== '' ? parseInt(form.stock30, 10) : 0,
      stock25: form.stock25 !== '' ? parseInt(form.stock25, 10) : 0,
      category: form.category,
      imageUrl: form.imageURL,
      description: form.description, 
      updatedAt: serverTimestamp()
    };

    try {
      if (editingId) {
        await updateDoc(doc(db, "products", editingId), productData);
        Swal.fire({ title: 'Modifié', icon: 'success', timer: 1500, confirmButtonColor: '#000000' });
      } else {
        await addDoc(collection(db, "products"), { ...productData, createdAt: serverTimestamp() });
        Swal.fire({ title: 'Ajouté', icon: 'success', timer: 1500, confirmButtonColor: '#000000' });
      }
      resetForm(); 
      fetchProducts();
    } catch (error) { 
      Swal.fire({ title: 'Erreur', text: error.message, icon: 'error', confirmButtonColor: '#000000' }); 
    } finally { 
      setLoading(false); 
    }
  };

  const resetForm = () => {
    setForm({ 
      name: '', price30: '', oldPrice30: '', price25: '', oldPrice25: '', 
      category: 'Femme', stock30: '0', stock25: '0', imageURL: '', description: '' 
    });
    setEditingId(null);
  };

  const startEdit = (p) => {
    setEditingId(p.id);
    setForm({
      name: p.name || '', 
      price30: p.price30?.toString() || '', 
      oldPrice30: p.oldPrice30?.toString() || '',
      price25: p.price25?.toString() || '', 
      oldPrice25: p.oldPrice25?.toString() || '',
      category: p.category || 'Femme', 
      stock30: p.stock30?.toString() || '0', 
      stock25: p.stock25?.toString() || '0', 
      imageURL: p.imageUrl || p.image || '',
      description: p.description || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteProduct = async (id) => {
    const result = await Swal.fire({ 
        title: 'Supprimer ?', 
        icon: 'warning', 
        showCancelButton: true,
        confirmButtonColor: '#000000',
        cancelButtonColor: '#d33',
        confirmButtonText: 'SUPPRIMER',
    });
    if (result.isConfirmed) { 
      await deleteDoc(doc(db, "products", id)); 
      fetchProducts(); 
    }
  };

  const filteredProducts = products.filter(p => p.name?.toLowerCase().includes(searchTerm.toLowerCase()));
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const currentItems = filteredProducts.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage);

  return (
    <div className="p-2 md:p-8 bg-gray-50 min-h-screen font-sans">
      <style>{`
        .swal2-actions { margin-top: 20px !important; }
        .swal2-confirm { background-color: #000000 !important; color: white !important; }
        .swal2-cancel { background-color: #d33 !important; color: white !important; }
        /* Style for Description Textarea */
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
      `}</style>

      <div className="max-w-6xl mx-auto space-y-4 md:space-y-6">
        
        <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100 sticky top-2 z-50 gap-4">
            <div className="flex items-center justify-between w-full md:w-auto gap-4">
              <h1 className="font-black uppercase italic text-xs md:text-sm tracking-tighter text-black">Admin Sahaba 306</h1>
              <button onClick={handleLogout} className="text-[9px] md:text-[10px] font-black text-red-600 uppercase border border-red-200 px-3 py-1.5 rounded-full hover:bg-red-50">Sortir</button>
            </div>
            
            <div className="flex items-center gap-2 w-full md:w-auto">
              <input 
                type="text" 
                placeholder="WhatsApp..." 
                className="border rounded-lg p-2 text-[10px] outline-none flex-1 md:w-32"
                value={whatsappPhone}
                onChange={(e) => setWhatsappPhone(e.target.value)}
              />
              <button onClick={handleUpdateWhatsApp} className="bg-green-600 text-white px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest">OK</button>
            </div>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-[10px] md:text-xs font-black mb-6 uppercase tracking-widest text-center md:text-left text-zinc-400">
            {editingId ? '📝 Modifier Produit' : '✨ Nouveau Produit'}
          </h2>
          <form onSubmit={handleSave} className="space-y-4 md:space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="text-[9px] font-black uppercase text-gray-400 block mb-1">Nom du Parfum</label>
                <input type="text" className="w-full border rounded-lg p-3 text-sm outline-none focus:ring-1 focus:ring-black" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
              </div>
              <div>
                <label className="text-[9px] font-black uppercase text-gray-400 block mb-1">Catégorie</label>
                <select className="w-full border rounded-lg p-3 text-sm outline-none bg-white font-bold" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                  <option value="Femme">Femme</option>
                  <option value="Homme">Homme</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <div className="p-3 md:p-4 border rounded-xl bg-blue-50/30 grid grid-cols-2 gap-3">
                <div className="col-span-2 text-[10px] font-black text-blue-600 uppercase mb-1 flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span> Format 30ML
                </div>
                <div>
                  <label className="text-[8px] font-black uppercase text-gray-400 block mb-1">Prix Vente</label>
                  <input type="text" className="w-full border rounded-lg p-2 text-sm outline-none font-bold" placeholder="DH" value={form.price30} onChange={e => setForm({...form, price30: e.target.value})} />
                </div>
                <div>
                  <label className="text-[8px] font-black uppercase text-gray-400 block mb-1">Ancien Prix</label>
                  <input type="text" className="w-full border rounded-lg p-2 text-sm outline-none text-red-400 font-medium" placeholder="DH" value={form.oldPrice30} onChange={e => setForm({...form, oldPrice30: e.target.value})} />
                </div>
              </div>

              <div className="p-3 md:p-4 border rounded-xl bg-purple-50/30 grid grid-cols-2 gap-3">
                <div className="col-span-2 text-[10px] font-black text-purple-600 uppercase mb-1 flex items-center gap-2">
                    <span className="w-2 h-2 bg-purple-600 rounded-full"></span> Format 25ML
                </div>
                <div>
                  <label className="text-[8px] font-black uppercase text-gray-400 block mb-1">Prix Vente</label>
                  <input type="text" className="w-full border rounded-lg p-2 text-sm outline-none font-bold" placeholder="DH" value={form.price25} onChange={e => setForm({...form, price25: e.target.value})} />
                </div>
                <div>
                  <label className="text-[8px] font-black uppercase text-gray-400 block mb-1">Ancien Prix</label>
                  <input type="text" className="w-full border rounded-lg p-2 text-sm outline-none text-red-400 font-medium" placeholder="DH" value={form.oldPrice25} onChange={e => setForm({...form, oldPrice25: e.target.value})} />
                </div>
              </div>
            </div>

            <div className="w-full">
              <label className="text-[9px] font-black uppercase text-gray-400 block mb-1">Description du Produit (Notes olfactives, histoire...)</label>
              <textarea 
                rows="4"
                placeholder="Décrivez votre parfum ou votre pack..."
                className="w-full border rounded-xl p-3 text-sm outline-none focus:ring-1 focus:ring-black custom-scrollbar resize-none bg-gray-50/50"
                value={form.description}
                onChange={e => setForm({...form, description: e.target.value})}
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <label className="text-[9px] font-black uppercase text-gray-400 block mb-1">Image URL</label>
                <input type="text" className="w-full border rounded-lg p-3 text-sm outline-none" required value={form.imageURL} onChange={e => setForm({...form, imageURL: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-3 md:col-span-2">
                <div>
                  <label className="text-[9px] font-black uppercase text-gray-400 block mb-1">Stock 30ml</label>
                  <input type="text" className="w-full border rounded-lg p-3 text-sm outline-none font-bold text-center" value={form.stock30} onChange={e => setForm({...form, stock30: e.target.value})} />
                </div>
                <div>
                  <label className="text-[9px] font-black uppercase text-gray-400 block mb-1">Stock 25ml</label>
                  <input type="text" className="w-full border rounded-lg p-3 text-sm outline-none font-bold text-center" value={form.stock25} onChange={e => setForm({...form, stock25: e.target.value})} />
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-black text-white rounded-xl py-4 font-black uppercase text-[10px] tracking-[0.3em] hover:bg-zinc-800 transition-all shadow-xl active:scale-[0.98]">
              {loading ? 'SABR...' : (editingId ? 'Mettre à jour le produit' : 'Confirmer l\'ajout')}
            </button>
            {editingId && <button type="button" onClick={resetForm} className="w-full text-[9px] font-black uppercase text-gray-400 py-1 underline tracking-widest">Annuler la modification</button>}
          </form>
        </div>

        <div ref={stockRef} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
           <div className="p-4 border-b bg-white flex justify-between items-center">
             <input 
               type="text" 
               placeholder="Chercher un parfum..." 
               className="w-full max-w-md bg-gray-50 border rounded-lg p-3 text-xs outline-none focus:bg-white transition-all"
               onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}}
             />
             <div className="hidden md:block text-[9px] font-black uppercase text-gray-300 ml-4">Total: {filteredProducts.length}</div>
           </div>

           <div className="hidden md:block overflow-x-auto">
             <table className="w-full text-left">
                <thead className="bg-gray-50 text-[9px] font-black text-gray-400 uppercase border-b">
                  <tr>
                    <th className="p-4">Produit & Description</th>
                    <th className="p-4 text-center">Tarification</th>
                    <th className="p-4 text-center">Niveau Stock</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {currentItems.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4 max-w-xs">
                        <div className="flex items-start gap-3">
                          <img src={p.imageUrl || p.image} className="w-12 h-16 object-cover rounded shadow-sm bg-gray-100 shrink-0" alt="" />
                          <div className="overflow-hidden">
                            <p className="font-black uppercase text-black truncate">{p.name}</p>
                            <p className="text-[8px] font-black text-[#D4AF37] italic mb-1">{p.category}</p>
                            <p className="text-[10px] text-gray-400 line-clamp-2 leading-tight">{p.description || 'Aucune description...'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="inline-flex flex-col gap-1 text-[9px] bg-gray-50 p-2 rounded-lg">
                          <span className="font-bold">30ml: <span className="text-black">{p.price30}DH</span> <span className="text-red-300 line-through ml-1">{p.oldPrice30}</span></span>
                          <span className="font-bold border-t pt-1">25ml: <span className="text-black">{p.price25}DH</span> <span className="text-red-300 line-through ml-1">{p.oldPrice25}</span></span>
                        </div>
                      </td>
                      <td className="p-4 text-center font-bold">
                        <div className="flex flex-col gap-1 items-center">
                          <span className={`px-2 py-0.5 rounded text-[9px] ${p.stock30 < 5 ? 'bg-red-100 text-red-600' : 'bg-green-50 text-gray-600'}`}>30ml: {p.stock30}</span>
                          <span className={`px-2 py-0.5 rounded text-[9px] ${p.stock25 < 5 ? 'bg-red-100 text-red-600' : 'bg-green-50 text-gray-600'}`}>25ml: {p.stock25}</span>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-3">
                           <button onClick={() => startEdit(p)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors group">
                              <span className="text-[10px] font-black uppercase text-gray-400 group-hover:text-black">Editer</span>
                           </button>
                           <button onClick={() => deleteProduct(p.id)} className="p-2 hover:bg-red-50 rounded-lg transition-colors group">
                              <span className="text-[10px] font-black uppercase text-red-200 group-hover:text-red-600">X</span>
                           </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
             </table>
           </div>

           <div className="md:hidden divide-y divide-gray-100">
              {currentItems.map(p => (
                <div key={p.id} className="p-4 space-y-3 active:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-4">
                    <img src={p.imageUrl || p.image} className="w-20 h-24 object-cover rounded-xl shadow-md bg-gray-100" alt="" />
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <p className="font-black text-[13px] uppercase text-black truncate pr-2">{p.name}</p>
                          <span className={`text-[8px] font-black px-1.5 py-0.5 rounded ${p.category === 'Homme' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'}`}>{p.category}</span>
                        </div>
                        <p className="text-[10px] text-gray-400 line-clamp-3 mb-2 leading-relaxed italic">
                          {p.description || 'Pas de description ajoutée.'}
                        </p>
                        <div className="flex items-center gap-3">
                          <button onClick={() => startEdit(p)} className="text-[10px] font-black text-black uppercase border-b-2 border-black">Modifier</button>
                          <button onClick={() => deleteProduct(p.id)} className="text-[10px] font-black text-red-400 uppercase">Supprimer</button>
                        </div>
                    </div>
                  </div>
                </div>
              ))}
           </div>

           {totalPages > 1 && (
             <div className="p-4 bg-gray-50 flex justify-between items-center border-t border-gray-100">
                <button 
                  disabled={currentPage === 1}
                  onClick={() => {setCurrentPage(prev => Math.max(prev - 1, 1)); stockRef.current.scrollIntoView();}}
                  className="text-[10px] font-black uppercase border-2 border-black px-4 py-2 bg-white disabled:opacity-20 disabled:border-gray-200 transition-all active:bg-black active:text-white"
                >
                  Prev
                </button>
                <div className="flex flex-col items-center">
                   <span className="text-[8px] font-black uppercase text-gray-400 mb-1">Navigation</span>
                   <span className="text-[10px] font-black uppercase text-black">
                     {currentPage} / {totalPages}
                   </span>
                </div>
                <button 
                  disabled={currentPage >= totalPages}
                  onClick={() => {setCurrentPage(prev => Math.min(prev + 1, totalPages)); stockRef.current.scrollIntoView();}}
                  className="text-[10px] font-black uppercase border-2 border-black px-4 py-2 bg-white disabled:opacity-20 disabled:border-gray-200 transition-all active:bg-black active:text-white"
                >
                  Next
                </button>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;