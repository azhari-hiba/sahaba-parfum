import React, { useState } from 'react';
import { auth } from '../firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      Swal.fire({
        icon: 'success',
        title: 'parfait!',
        text: 'Bienvenu Sahaba',
        timer: 1500,
        showConfirmButton: false
      });
      navigate('/dashboard');
    } catch (error) {
      Swal.fire('Erreur', 'Email awla Password ghalat!', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
        <div className="text-center mb-10">
          <h1 className="text-2xl font-black uppercase tracking-tighter italic">Sahaba 306</h1>
          <p className="text-[10px] text-gray-400 uppercase tracking-[0.3em] mt-2">Admin Control Panel</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="text-[9px] font-black uppercase text-gray-400 tracking-widest ml-1">Email Address</label>
            <input 
              type="email" 
              className="w-full p-4 mt-1 border rounded-xl text-sm focus:border-black outline-none bg-gray-50 transition-all"
              placeholder="....@gmail.com"
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="text-[9px] font-black uppercase text-gray-400 tracking-widest ml-1">Password</label>
            <input 
              type="password" 
              className="w-full p-4 mt-1 border rounded-xl text-sm focus:border-black outline-none bg-gray-50 transition-all"
              placeholder="••••••••"
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-black text-white py-4 rounded-xl font-black uppercase text-[11px] tracking-[0.2em] hover:bg-gray-800 transition-all disabled:bg-gray-400"
          >
            {loading ? 'Authentification...' : 'Se Connecter'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;