import React from 'react';
import { useProductForm } from '../../hooks/useProductForm';
import { FileEdit, Sparkles } from 'lucide-react'; // 👈 Importamos los íconos de edición/nuevo

function ProductFormModal({ isOpen, onClose, productToEdit, onSaveSuccess }) {
  const { formData, setters, loading, guardarProducto } = useProductForm(
    productToEdit,
    isOpen,
    onClose,
    onSaveSuccess
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl flex flex-col max-h-[85vh] overflow-y-auto">
        
        {/* TÍTULO MEJORADO CON ÍCONOS VECTORIALES */}
        <h3 className="text-xl font-black text-[#E91E63] mb-4 flex items-center space-x-2">
          {productToEdit ? (
            <>
              <FileEdit className="w-5 h-5 text-amber-500" /> {/* Ícono dinámico de edición */}
              <span>Editar Dulce</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-pink-500" /> {/* Ícono dinámico de nuevo dulce */}
              <span>Nuevo Dulce</span>
            </>
          )}
        </h3>

        <form onSubmit={guardarProducto} className="space-y-3.5 flex-1">
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Nombre del producto</label>
            <input type="text" required value={formData.name} onChange={(e) => setters.setName(e.target.value)} className="w-full px-3 py-2 bg-gray-50 rounded-xl border border-gray-100 text-sm focus:outline-none focus:border-[#E91E63]" placeholder="Ej: Lemon Pie Grande" />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Categoría</label>
            <select value={formData.categoryId} onChange={(e) => setters.setCategoryId(e.target.value)} className="w-full px-3 py-2 bg-gray-50 rounded-xl border border-gray-100 text-sm focus:outline-none focus:border-[#E91E63]">
              <option value="1">Tortas</option>
              <option value="2">Tartas</option>
              <option value="3">Masitas</option>
              <option value="4">Alfajores</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Precio ($)</label>
              <input type="number" required value={formData.price} onChange={(e) => setters.setPrice(e.target.value)} className="w-full px-3 py-2 bg-gray-50 rounded-xl border border-gray-100 text-sm focus:outline-none focus:border-[#E91E63]" placeholder="45000" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Stock disponible</label>
              <input type="number" required value={formData.stock} onChange={(e) => setters.setStock(e.target.value)} className="w-full px-3 py-2 bg-gray-50 rounded-xl border border-gray-100 text-sm focus:outline-none focus:border-[#E91E63]" placeholder="5" />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">URL de la Imagen</label>
            <input type="text" value={formData.imageUrl} onChange={(e) => setters.setImageUrl(e.target.value)} className="w-full px-3 py-2 bg-gray-50 rounded-xl border border-gray-100 text-sm focus:outline-none focus:border-[#E91E63]" placeholder="https://images.unsplash.com/..." />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Descripción (Opcional)</label>
            <textarea value={formData.description} onChange={(e) => setters.setDescription(e.target.value)} rows="2" className="w-full px-3 py-2 bg-gray-50 rounded-xl border border-gray-100 text-sm focus:outline-none focus:border-[#E91E63] resize-none" placeholder="Ingredientes o detalles del tamaño..."></textarea>
          </div>

          <div className="flex space-x-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 bg-gray-100 text-gray-600 rounded-xl text-xs font-bold active:scale-95 transition-transform">
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="flex-1 py-2.5 bg-[#E91E63] text-white rounded-xl text-xs font-bold active:scale-95 transition-transform shadow-sm disabled:opacity-50">
              {loading ? 'Guardando...' : 'Guardar Dulce'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductFormModal;