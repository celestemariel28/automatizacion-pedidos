import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { Trash2 } from 'lucide-react';

export default function InfoSlidesAdmin() {
  const [slides, setSlides] = useState([]);
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchSlides = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('info_slides')
      .select('*')
      .order('order_index', { ascending: true });
    if (!error) setSlides(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const handleAddSlide = async (e) => {
    e.preventDefault();
    if (!imageUrl.trim()) return;

    const { error } = await supabase
      .from('info_slides')
      .insert([{ title: title.trim() || 'Información', image_url: imageUrl.trim(), order_index: slides.length }]);

    if (!error) {
      setTitle('');
      setImageUrl('');
      fetchSlides();
    } else {
      alert("Error al agregar slide: " + error.message);
    }
  };

  const handleDeleteSlide = async (id) => {
    if (window.confirm("¿Deseas eliminar esta imagen informativa?")) {
      const { error } = await supabase.from('info_slides').delete().eq('id', id);
      if (!error) fetchSlides();
    }
  };

  return (
    <div className="p-4 bg-white rounded-2xl shadow-sm border border-pink-100 max-w-lg mx-auto">
      <h3 className="text-lg font-black text-[#D81B60] mb-4">Fotos de Info Importante (Carrusel)</h3>

      <form onSubmit={handleAddSlide} className="flex flex-col gap-2.5 mb-5">
        <input
          type="text"
          placeholder="Título descriptivo (ej: Horarios y demoras)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-rose-50/50 border border-rose-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E91E63]"
        />
        <input
          type="url"
          placeholder="URL de la imagen (pegar link directo)"
          required
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="bg-rose-50/50 border border-rose-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E91E63]"
        />
        <button
          type="submit"
          className="bg-[#E91E63] text-white py-2 rounded-xl text-sm font-bold active:scale-95 transition-transform cursor-pointer"
        >
          + Agregar Imagen al Carrusel
        </button>
      </form>

      {loading ? (
        <p className="text-xs text-gray-400">Cargando...</p>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {slides.map((s, idx) => (
            <div key={s.id} className="border border-pink-100 rounded-2xl overflow-hidden shadow-sm relative group bg-gray-50 flex flex-col justify-between">
              <img src={s.image_url} alt={s.title} className="w-full h-36 object-contain bg-white" />
              <div className="p-2 bg-white flex justify-between items-center border-t border-gray-100">
                <span className="text-[11px] font-bold text-gray-700 truncate">{idx + 1}. {s.title}</span>
                <button
                  type="button"
                  onClick={() => handleDeleteSlide(s.id)}
                  className="w-7 h-7 flex items-center justify-center bg-red-50 text-red-500 hover:bg-red-100 rounded-lg active:scale-90 transition-transform cursor-pointer"
                  title="Eliminar foto"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {slides.length === 0 && (
            <p className="text-xs text-gray-400 col-span-2 text-center py-4">No hay imágenes en el carrusel aún.</p>
          )}
        </div>
      )}
    </div>
  );
}