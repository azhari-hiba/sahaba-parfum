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
  const productsPerPage = 16;
  const stockRef = useRef(null);
  const navigate = useNavigate();

  const [form, setForm] = useState({ 
    name: '', 
    price30: '', oldPrice30: '',
    price25: '', oldPrice25: '',
    category: 'Femme', 
    stock30: '0', stock25: '0', 
    imageURL: '', description: '' 
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
      Swal.fire({ title: 'Succès', text: 'WhatsApp mis à jour !', icon: 'success', timer: 1500 });
    } catch (err) { Swal.fire('Erreur', 'Erreur.', 'error'); }
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
      confirmButtonText: 'Oui',
      confirmButtonColor: '#000'
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
        Swal.fire({ title: 'Modifié', icon: 'success', timer: 1500 });
      } else {
        await addDoc(collection(db, "products"), { ...productData, createdAt: serverTimestamp() });
        Swal.fire({ title: 'Ajouté', icon: 'success', timer: 1500 });
      }
      resetForm(); 
      fetchProducts();
    } catch (error) { 
      Swal.fire('Erreur', error.message, 'error'); 
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
    const result = await Swal.fire({ title: 'Supprimer ?', icon: 'warning', showCancelButton: true });
    if (result.isConfirmed) { 
      await deleteDoc(doc(db, "products", id)); 
      fetchProducts(); 
    }
  };

  const filteredProducts = products.filter(p => p.name?.toLowerCase().includes(searchTerm.toLowerCase()));
  const currentItems = filteredProducts.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage);

  return (
    <div className="p-2 md:p-8 bg-gray-50 min-h-screen font-sans">
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
          <h2 className="text-[10px] md:text-xs font-black mb-6 uppercase tracking-widest text-center md:text-left">
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
                <select className="w-full border rounded-lg p-3 text-sm outline-none bg-white" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                  <option value="Femme">Femme</option>
                  <option value="Homme">Homme</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <div className="p-3 md:p-4 border rounded-xl bg-blue-50/30 grid grid-cols-2 gap-3">
                <div className="col-span-2 text-[10px] font-black text-blue-600 uppercase mb-1">Format 30ML</div>
                <div>
                  <label className="text-[8px] font-black uppercase text-gray-400 block mb-1">Prix Vente</label>
                  <input type="text" className="w-full border rounded-lg p-2 text-sm outline-none" value={form.price30} onChange={e => setForm({...form, price30: e.target.value})} />
                </div>
                <div>
                  <label className="text-[8px] font-black uppercase text-gray-400 block mb-1">Ancien Prix</label>
                  <input type="text" className="w-full border rounded-lg p-2 text-sm outline-none text-red-500" value={form.oldPrice30} onChange={e => setForm({...form, oldPrice30: e.target.value})} />
                </div>
              </div>

              <div className="p-3 md:p-4 border rounded-xl bg-purple-50/30 grid grid-cols-2 gap-3">
                <div className="col-span-2 text-[10px] font-black text-purple-600 uppercase mb-1">Format 25ML</div>
                <div>
                  <label className="text-[8px] font-black uppercase text-gray-400 block mb-1">Prix Vente</label>
                  <input type="text" className="w-full border rounded-lg p-2 text-sm outline-none" value={form.price25} onChange={e => setForm({...form, price25: e.target.value})} />
                </div>
                <div>
                  <label className="text-[8px] font-black uppercase text-gray-400 block mb-1">Ancien Prix</label>
                  <input type="text" className="w-full border rounded-lg p-2 text-sm outline-none text-red-500" value={form.oldPrice25} onChange={e => setForm({...form, oldPrice25: e.target.value})} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <label className="text-[9px] font-black uppercase text-gray-400 block mb-1">Cloudinary URL</label>
                <input type="text" className="w-full border rounded-lg p-3 text-sm outline-none" required value={form.imageURL} onChange={e => setForm({...form, imageURL: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-2 gap-3 md:col-span-2">
                <div>
                  <label className="text-[9px] font-black uppercase text-gray-400 block mb-1">Stock 30ml</label>
                  <input type="text" className="w-full border rounded-lg p-3 text-sm outline-none" value={form.stock30} onChange={e => setForm({...form, stock30: e.target.value})} />
                </div>
                <div>
                  <label className="text-[9px] font-black uppercase text-gray-400 block mb-1">Stock 25ml</label>
                  <input type="text" className="w-full border rounded-lg p-3 text-sm outline-none" value={form.stock25} onChange={e => setForm({...form, stock25: e.target.value})} />
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-black text-white rounded-xl py-4 font-black uppercase text-[10px] tracking-widest hover:bg-zinc-800 transition-all shadow-lg shadow-black/5">
              {loading ? 'SABR...' : (editingId ? 'Mettre à jour' : 'Ajouter au Stock')}
            </button>
            {editingId && <button type="button" onClick={resetForm} className="w-full text-[9px] font-black uppercase text-gray-400 py-1">Annuler la modification</button>}
          </form>
        </div>

        <div ref={stockRef} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
           <div className="p-4 border-b bg-white">
             <input 
               type="text" 
               placeholder="Rechercher par nom..." 
               className="w-full bg-gray-50 border rounded-lg p-3 text-xs outline-none focus:bg-white transition-all"
               onChange={(e) => setSearchTerm(e.target.value)}
             />
           </div>

           <div className="hidden md:block">
             <table className="w-full text-left">
                <thead className="bg-gray-50 text-[9px] font-black text-gray-400 uppercase border-b">
                  <tr>
                    <th className="p-4">Produit</th>
                    <th className="p-4 text-center">Prix / Promo</th>
                    <th className="p-4 text-center">Stock</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {currentItems.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50/50">
                      <td className="p-4 flex items-center gap-3">
                        <img src={p.imageUrl || p.image} className="w-10 h-12 object-cover rounded shadow-sm bg-gray-100" alt="" />
                        <div>
                          <p className="font-bold text-xs uppercase text-black">{p.name}</p>
                          <p className="text-[8px] font-black text-gray-300 italic">{p.category}</p>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex flex-col gap-1 text-[9px]">
                          <span className="font-bold whitespace-nowrap">30ml: {p.price30}DH / <span className="text-red-400">{p.oldPrice30 || '--'}</span></span>
                          <span className="font-bold whitespace-nowrap">25ml: {p.price25}DH / <span className="text-red-400">{p.oldPrice25 || '--'}</span></span>
                        </div>
                      </td>
                      <td className="p-4 text-center text-[10px] font-bold">
                        <div className="flex justify-center gap-2">
                          <span className={p.stock25 < 5 ? 'text-red-500' : 'text-gray-600'}>25ml: {p.stock25}</span>
                          <span className="text-gray-200">|</span>
                          <span className={p.stock30 < 5 ? 'text-red-500' : 'text-gray-600'}>30ml: {p.stock30}</span>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <button onClick={() => startEdit(p)} className="text-[10px] font-black uppercase text-gray-400 hover:text-black mr-4 underline">Editer</button>
                        <button onClick={() => deleteProduct(p.id)} className="text-[10px] font-black uppercase text-red-300 hover:text-red-600">Supprimer</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
             </table>
           </div>

           <div className="md:hidden divide-y divide-gray-100">
              {currentItems.map(p => (
                <div key={p.id} className="p-4 space-y-3">
                  <div className="flex items-center gap-4">
                    <img src={p.imageUrl || p.image} className="w-16 h-20 object-cover rounded-lg shadow-sm" alt="" />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-black text-xs uppercase text-black">{p.name}</p>
                          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{p.category}</p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <button onClick={() => startEdit(p)} className="text-[10px] font-black text-blue-500 uppercase">Editer</button>
                          <button onClick={() => deleteProduct(p.id)} className="text-[10px] font-black text-red-400 uppercase">Supprimer</button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 bg-gray-50 p-2 rounded-lg">
                    <div className="text-[9px]">
                      <p className="font-black text-gray-400 uppercase">Formats & Prix</p>
                      <p className="font-bold">30ml: {p.price30}DH <span className="text-red-400 line-through text-[8px]">{p.oldPrice30}</span></p>
                      <p className="font-bold">25ml: {p.price25}DH <span className="text-red-400 line-through text-[8px]">{p.oldPrice25}</span></p>
                    </div>
                    <div className="text-[9px] text-right">
                      <p className="font-black text-gray-400 uppercase">Stock Dispo</p>
                      <p className={`font-bold ${p.stock30 < 5 ? 'text-red-600' : ''}`}>30ml: {p.stock30}</p>
                      <p className={`font-bold ${p.stock25 < 5 ? 'text-red-600' : ''}`}>25ml: {p.stock25}</p>
                    </div>
                  </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;