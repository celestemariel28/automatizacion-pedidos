import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { PlusCircle, Pencil, Trash2, Check, X } from 'lucide-react';

export default function CustomCakeAdmin() {
  const [portions, setPortions] = useState([]);
  const [coverings, setCoverings] = useState([]);
  const [activeType, setActiveType] = useState('buttercream');
  const [newLabel, setNewLabel] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editLabel, setEditLabel] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchCoveringsAndPortions = async () => {
    setLoading(true);
    // 1. Cargar coberturas existentes
    const { data: covData } = await supabase
      .from('cake_coverings')
      .select('*')
      .order('id', { ascending: true });

    if (covData && covData.length > 0) {
      setCoverings(covData);
      if (!activeType) setActiveType(covData[0].name.toLowerCase());
    }

    // 2. Cargar porciones
    const { data: portionsData, error } = await supabase
      .from('custom_cake_portions')
      .select('*')
      .order('price', { ascending: true });

    if (!error) setPortions(portionsData || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchCoveringsAndPortions();
  }, []);

  const handleAddPortion = async (e) => {
    e.preventDefault();
    if (!newLabel.trim() || !newPrice) return;

    const { error } = await supabase.from('custom_cake_portions').insert([
      {
        cake_type: activeType.toLowerCase(),
        label: newLabel.trim(),
        price: parseFloat(newPrice)
      }
    ]);

    if (!error) {
      setNewLabel('');
      setNewPrice('');
      fetchCoveringsAndPortions();
    } else {
      alert("Error al agregar porción: " + error.message);
    }
  };

  const handleUpdatePortion = async (id) => {
    if (!editLabel.trim() || !editPrice) return;

    const { error } = await supabase
      .from('custom_cake_portions')
      .update({ 
        label: editLabel.trim(),
        price: parseFloat(editPrice) 
      })
      .eq('id', id);

    if (!error) {
      setEditingId(null);
      fetchCoveringsAndPortions();
    } else {
      alert("Error al actualizar: " + error.message);
    }
  };

  const handleDeletePortion = async (id, label) => {
    if (window.confirm(`¿Seguro que deseas eliminar "${label}"?`)) {
      const { error } = await supabase.from('custom_cake_portions').delete().eq('id', id);
      if (!error) fetchCoveringsAndPortions();
    }
  };

  const filtered = portions.filter(p => p.cake_type.toLowerCase() === activeType.toLowerCase());

  return (
    <div className="p-4 bg-white rounded-2xl shadow-sm border border-pink-100 max-w-lg mx-auto flex flex-col h-full">
      <h3 className="text-lg font-black text-[#E91E63] mb-3">Precios y Porciones Personalizadas</h3>

      {/* Selector de Cobertura */}
      <div className="flex bg-gray-100 p-1 rounded-xl mb-4 gap-1 overflow-x-auto">
        {coverings.map((cov) => (
          <button
            key={cov.id}
            type="button"
            onClick={() => setActiveType(cov.name.toLowerCase())}
            className={`flex-1 py-1.5 px-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              activeType.toLowerCase() === cov.name.toLowerCase()
                ? 'bg-white text-[#E91E63] shadow-sm'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            {cov.name}
          </button>
        ))}
      </div>

      {/* Formulario de Agregar */}
      <form onSubmit={handleAddPortion} className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Porción (ej: 12 Porciones)"
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          className="flex-1 bg-rose-50/50 border border-rose-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#E91E63]"
        />
        <input
          type="number"
          placeholder="Precio $"
          value={newPrice}
          onChange={(e) => setNewPrice(e.target.value)}
          className="w-24 bg-rose-50/50 border border-rose-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#E91E63]"
        />
        <button
          type="submit"
          className="py-2.5 px-4 bg-[#E91E63] text-white rounded-xl text-xs font-bold shadow-sm active:scale-95 transition-transform hover:bg-[#d81b60] flex items-center justify-center space-x-1.5 cursor-pointer shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Agregar</span>
        </button>
      </form>

      {/* Lista */}
      <div className="flex-1 overflow-y-auto pr-1">
        {loading ? (
          <p className="text-xs text-gray-400 py-3 text-center">Cargando porciones...</p>
        ) : (
          <div className="space-y-2">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 bg-pink-50/30 border border-pink-100 rounded-xl text-xs"
              >
                {editingId === item.id ? (
                  <div className="flex items-center gap-1.5 flex-1 mr-2">
                    <input
                      type="text"
                      value={editLabel}
                      onChange={(e) => setEditLabel(e.target.value)}
                      className="flex-1 bg-white border border-[#E91E63] rounded-lg px-2 py-1 text-xs font-bold text-gray-800"
                    />
                    <input
                      type="number"
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                      className="w-20 bg-white border border-[#E91E63] rounded-lg px-2 py-1 text-xs font-bold text-[#E91E63]"
                    />
                    <button
                      type="button"
                      onClick={() => handleUpdatePortion(item.id)}
                      className="w-7 h-7 bg-emerald-500 text-white rounded-lg flex items-center justify-center active:scale-90 transition-transform cursor-pointer"
                      title="Guardar"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="w-7 h-7 bg-gray-200 text-gray-700 rounded-lg flex items-center justify-center active:scale-90 transition-transform cursor-pointer"
                      title="Cancelar"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="font-bold text-gray-800">{item.label}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-black text-[#E91E63]">
                        ${Number(item.price).toLocaleString('es-AR')}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(item.id);
                          setEditLabel(item.label);
                          setEditPrice(item.price);
                        }}
                        className="w-7 h-7 flex items-center justify-center bg-blue-50 text-amber-600 hover:bg-blue-100 rounded-lg active:scale-90 transition-transform cursor-pointer"
                        title="Editar porción o precio"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeletePortion(item.id, item.label)}
                        className="w-7 h-7 flex items-center justify-center bg-red-50 text-red-500 hover:bg-red-100 rounded-lg active:scale-90 transition-transform cursor-pointer"
                        title="Eliminar porción"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
            {filtered.length === 0 && (
              <p className="text-xs text-gray-400 text-center py-4">No hay porciones configuradas para esta cobertura.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}