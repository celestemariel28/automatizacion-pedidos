import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { PlusCircle } from 'lucide-react';
import PortionFilters from './PortionFilters';
import PortionItemRow from './PortionItemRow';

export default function CustomCakeAdmin() {
  const [portions, setPortions] = useState([]);
  const [coverings, setCoverings] = useState([]);
  const [activeType, setActiveType] = useState('buttercream');
  const [activeFloors, setActiveFloors] = useState(1);
  const [newLabel, setNewLabel] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchCoveringsAndPortions = async () => {
    setLoading(true);
    const { data: covData } = await supabase
      .from('cake_coverings')
      .select('*')
      .order('id', { ascending: true });

    if (covData && covData.length > 0) {
      setCoverings(covData);
      if (!activeType) setActiveType(covData[0].name.toLowerCase());
    }

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
        floors: parseInt(activeFloors, 10),
        label: newLabel.trim(),
        price: parseFloat(newPrice)
      }
    ]);

    if (!error) {
      setNewLabel('');
      setNewPrice('');
      fetchCoveringsAndPortions();
    } else {
      alert('Error al agregar porción: ' + error.message);
    }
  };

  const handleUpdatePortion = async (id, label, price) => {
    const { error } = await supabase
      .from('custom_cake_portions')
      .update({ label, price: parseFloat(price) })
      .eq('id', id);

    if (!error) {
      fetchCoveringsAndPortions();
    } else {
      alert('Error al actualizar: ' + error.message);
    }
  };

  const handleDeletePortion = async (id, label) => {
    if (window.confirm(`¿Seguro que deseas eliminar "${label}"?`)) {
      const { error } = await supabase.from('custom_cake_portions').delete().eq('id', id);
      if (!error) fetchCoveringsAndPortions();
    }
  };

  const filtered = portions.filter(
    (p) =>
      p.cake_type.toLowerCase() === activeType.toLowerCase() &&
      (parseInt(p.floors, 10) || 1) === activeFloors
  );

  return (
    <div className="p-4 bg-white rounded-2xl shadow-sm border border-pink-100 max-w-lg mx-auto flex flex-col h-full">
      <h3 className="text-lg font-black text-[#E91E63] mb-2">Precios y Porciones</h3>

      {/* Filtros de Pisos y Coberturas */}
      <PortionFilters
        activeFloors={activeFloors}
        setActiveFloors={setActiveFloors}
        coverings={coverings}
        activeType={activeType}
        setActiveType={setActiveType}
      />

      {/* Formulario para Crear Porción */}
      <form onSubmit={handleAddPortion} className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Porción (ej: 25 Porciones)"
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
        </button>
      </form>

      {/* Lista de Porciones */}
      <div className="flex-1 overflow-y-auto pr-1">
        {loading ? (
          <p className="text-xs text-gray-400 py-3 text-center">Cargando porciones...</p>
        ) : (
          <div className="space-y-2">
            {filtered.map((item) => (
              <PortionItemRow
                key={item.id}
                item={item}
                onUpdate={handleUpdatePortion}
                onDelete={handleDeletePortion}
              />
            ))}
            {filtered.length === 0 && (
              <p className="text-xs text-gray-400 text-center py-4">
                No hay porciones cargadas para {activeFloors} piso/s en {activeType.toUpperCase()}.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}