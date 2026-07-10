// src/components/admin/Login.jsx
import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';
import { Mail, Lock, Crown } from 'lucide-react'; // 👈 Importamos los íconos profesionales

function Login({ onLoginSuccess, setView }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(false);

    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) throw error;

      alert('¡Bienvenida, Jefa! Iniciando sesión...');
      onLoginSuccess(data.user);
    } catch (error) {
      console.error('Error en la autenticación:', error.message);
      alert(`Error al ingresar: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 p-6 flex flex-col justify-center bg-white m-4 rounded-3xl shadow-xl">
      {/* CABECERA CON ÍCONO DE CORONA VECTORIAL */}
      <div className="text-center mb-6 flex flex-col items-center">
        <Crown className="w-10 h-10 text-[#E91E63] mb-1.5" /> {/* 👈 Cambiamos el emoji 👑 por Lucide */}
        <h2 className="text-2xl font-black text-[#E91E63]">Panel de Control</h2>
        <p className="text-gray-500 text-xs mt-1">Ingresá tus credenciales de administradora</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        {/* INPUT DE EMAIL CON ÍCONO ROSA */}
        <div>
          <label className="block text-[10px] font-bold text-[#E91E63] uppercase tracking-wider mb-1">Email</label>
          <div className="relative flex items-center">
            <Mail className="w-4 h-4 text-[#E91E63] absolute left-4 pointer-events-none" /> {/* 👈 Ícono de Correo */}
            <input 
              type="email" 
              required
              placeholder="admin@pasteleria.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-gray-50 rounded-xl border border-gray-100 text-sm focus:outline-none focus:border-[#E91E63] transition-colors"
            />
          </div>
        </div>

        {/* INPUT DE CONTRASEÑA CON ÍCONO ROSA */}
        <div>
          <label className="block text-[10px] font-bold text-[#E91E63] uppercase tracking-wider mb-1">Contraseña</label>
          <div className="relative flex items-center">
            <Lock className="w-4 h-4 text-[#E91E63] absolute left-4 pointer-events-none" /> {/* 👈 Ícono de Candado */}
            <input 
              type="password" 
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-gray-50 rounded-xl border border-gray-100 text-sm focus:outline-none focus:border-[#E91E63] transition-colors"
            />
          </div>
        </div>

        {/* BOTÓN SÓLIDO ROSA */}
        <button 
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-[#E91E63] text-white rounded-xl text-sm font-bold shadow-sm active:scale-95 hover:bg-[#d81b60] transition-all disabled:opacity-50"
        >
          {loading ? 'Verificando...' : 'Ingresar al Panel'}
        </button>
      </form>

      <button 
        onClick={() => setView('categories')} 
        className="mt-6 text-xs text-gray-400 hover:text-gray-600 transition-colors text-center font-medium"
      >
        ← Volver a la Tienda
      </button>
    </div>
  );
}

export default Login;