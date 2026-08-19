import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { PlusCircle, Pencil, Trash2, Check, X } from 'lucide-react';

export default function CoveringsAdmin() {
  const [coverings, setCoverings] = useState([]);
  const [newCoveringName, setNewCoveringName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchCoverings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('cake_coverings')
      .select('*')
      .order('id', { ascending: true });
    if (!error) setCoverings(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchCoverings();
  }, []);

  const handleAddCovering = async (e) => {
    e.preventDefault();
    if (!newCoveringName.trim()) return;

    const { error } = await supabase
      .from('cake_coverings')
      .insert([{ name: newCoveringName.trim().toUpperCase(), available: true }]);

    if (!error) {
      setNewCoveringName('');
      fetchCoverings();
    } else {
      alert("Error al agregar cobertura: " + error.message);
    }
  };

  const handleUpdateName = async (id) => {
    if (!editName.trim()) return;
    const { error } = await supabase
      .from('cake_coverings')
      .update({ name: editName.trim().toUpperCase() })
      .eq('id', id);

    if (!error) {
      setEditingId(null);
      fetchCoverings();
    } else {
      alert("Error al actualizar cobertura: " + error.message);
    }
  };

  const handleToggleAvailable = async (id, currentStatus) => {
    const { error } = await supabase
      .from('cake_coverings')
      .update({ available: !currentStatus })
      .eq('id', id);

    if (!error) fetchCoverings();
  };

  const handleDeleteCovering = async (id, name) => {
    if (window.confirm(`¿Seguro que deseas eliminar permanentemente la cobertura "${name}"?`)) {
      const { error } = await supabase.from('cake_coverings').delete().eq('id', id);
      if (!error) fetchCoverings();
    }
  };

  return (
    <div className="p-4 bg-white rounded-2xl shadow-sm border border-pink-100 max-w-lg mx-auto flex flex-col h-full">
      <h3 className="text-lg font-black text-[#E91E63] mb-3">Gestión de Coberturas</h3>

      {/* Formulario de Agregar */}
      <form onSubmit={handleAddCovering} className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Nombre de cobertura (ej: BUTTERCREAM, CREMA...)"
          value={newCoveringName}
          onChange={(e) => setNewCoveringName(e.target.value)}
          className="flex-1 bg-rose-50/50 border border-rose-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#E91E63]"
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
          <p className="text-xs text-gray-400 py-3 text-center">Cargando coberturas...</p>
        ) : (
          <div className="space-y-2">
            {coverings.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between p-3 bg-pink-50/30 border border-pink-100 rounded-xl text-xs"
              >
                {editingId === c.id ? (
                  <div className="flex items-center gap-1.5 flex-1 mr-2">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="flex-1 bg-white border border-[#E91E63] rounded-lg px-2 py-1 text-xs font-bold text-gray-800 uppercase"
                    />
                    <button
                      type="button"
                      onClick={() => handleUpdateName(c.id)}
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
                  <span className={`font-bold ${c.available ? 'text-gray-800' : 'text-gray-400 line-through'}`}>
                    {c.name}
                  </span>
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggleAvailable(c.id, c.available)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-black cursor-pointer transition-colors ${
                      c.available ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                  >
                    {c.available ? 'Disponible' : 'Pausado'}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(c.id);
                      setEditName(c.name);
                    }}
                    className="w-7 h-7 flex items-center justify-center bg-blue-50 text-amber-600 hover:bg-blue-100 rounded-lg active:scale-90 transition-transform cursor-pointer"
                    title="Editar nombre"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteCovering(c.id, c.name)}
                    className="w-7 h-7 flex items-center justify-center bg-red-50 text-red-500 hover:bg-red-100 rounded-lg active:scale-90 transition-transform cursor-pointer"
                    title="Eliminar cobertura"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
            {coverings.length === 0 && (
              <p className="text-xs text-gray-400 text-center py-4">No hay coberturas cargadas aún.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}