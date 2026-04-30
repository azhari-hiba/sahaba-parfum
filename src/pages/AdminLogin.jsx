import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [pass, setPass] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (pass === "ADMIN123") { 
      localStorage.setItem("isAdmin", "true");
      navigate("/admin");
    } else {
      alert("Mot de passe incorrect");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleLogin} className="bg-white p-10 border rounded-sm shadow-xl w-96 text-center">
        <img src="/logo.jpeg" className="h-20 mx-auto mb-6" alt="Logo" />
        <input 
          type="password" 
          placeholder="Code d'accès Admin" 
          className="w-full border p-3 mb-4 text-center outline-none focus:border-[#D4AF37]" 
          onChange={(e) => setPass(e.target.value)}
        />
        <button className="w-full bg-black text-white py-3 font-bold uppercase tracking-widest text-xs hover:bg-[#D4AF37] transition">
          Connexion
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;