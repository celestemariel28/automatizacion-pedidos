import React, { useState, useEffect } from 'react';
import { useProductForm } from '../../hooks/useProductForm';
import { FileEdit, Sparkles } from 'lucide-react';
import VariantsEditor from './VariantsEditor';

export default function ProductFormModal({ isOpen, onClose, productToEdit, onSaveSuccess, categories = [] }) {
  const { formData, setters, loading, guardarProducto } = useProductForm(
    productToEdit,
    isOpen,
    onClose,
    onSaveSuccess
  );

  const [variants, setVariants] = useState([
    { id: Date.now().toString(), label: '', price: '', stock: '' }
  ]);

  useEffect(() => {
    if (isOpen) {
      if (productToEdit) {
        setters.setName(productToEdit.name || '');
        setters.setDescription(productToEdit.description || '');
        setters.setCategoryId(productToEdit.category_id || productToEdit.categoryId || '1');
        setters.setImageUrl(productToEdit.image_url || productToEdit.image || '');

        let variantesRaw = productToEdit.variante || productToEdit.variants;
        if (typeof variantesRaw === 'string') {
          try {
            variantesRaw = JSON.parse(variantesRaw);
          } catch {
            variantesRaw = [];
          }
        }

        if (Array.isArray(variantesRaw) && variantesRaw.length > 0) {
          setVariants(
            variantesRaw.map((v) => ({
              id: v.id || Date.now().toString() + Math.random(),
              label: v.label || '',
              price: v.price !== undefined ? v.price : '',
              stock: v.stock !== undefined ? v.stock : ''
            }))
          );
        } else {
          setVariants([{ id: Date.now().toString(), label: '', price: '', stock: '' }]);
        }
      } else {
        setters.setName('');
        setters.setDescription('');
        setters.setCategoryId('1');
        setters.setImageUrl('');
        setVariants([{ id: Date.now().toString(), label: '', price: '', stock: '' }]);
      }
    }
  }, [isOpen, productToEdit]);

  const handleAddVariant = () => {
    setVariants([...variants, { id: Date.now().toString(), label: '', price: '', stock: '' }]);
  };

  const handleRemoveVariant = (id) => {
    if (variants.length > 1) {
      setVariants(variants.filter((v) => v.id !== id));
    }
  };

  const handleVariantChange = (id, field, value) => {
    setVariants(variants.map((v) => (v.id === id ? { ...v, [field]: value } : v)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    for (const v of variants) {
      if (!v.label.trim() || v.price === '' || v.stock === '') {
        alert('Por favor, completa la porción, el precio y el stock de todas las variantes agregadas.');
        return;
      }
    }

    const finalVariants = variants.map((v) => ({
      id: v.id,
      label: v.label,
      price: parseFloat(v.price) || 0,
      stock: parseInt(v.stock, 10) || 0
    }));

    await guardarProducto(e, finalVariants);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl flex flex-col max-h-[85vh] overflow-y-auto">
        <h3 className="text-xl font-black text-[#E91E63] mb-4 flex items-center space-x-2">
          {productToEdit ? (
            <>
              <FileEdit className="w-5 h-5 text-amber-500" />
              <span>Editar Dulce</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-pink-500" />
              <span>Nuevo Dulce</span>
            </>
          )}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-3.5 flex-1">
          {/* Nombre */}
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setters.setName(e.target.value)}
            className="w-full px-3 py-2 bg-gray-50 rounded-xl border border-gray-100 text-sm focus:outline-none focus:border-[#E91E63]"
            placeholder="Nombre del dulce"
          />

          {/* Categoría */}
          <select
            value={formData.categoryId}
            onChange={(e) => setters.setCategoryId(e.target.value)}
            className="w-full px-3 py-2 bg-gray-50 rounded-xl border border-gray-100 text-sm focus:outline-none focus:border-[#E91E63]"
            required
          >
            <option value="">Seleccionar categoría</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Editor Modular de Variantes */}
          <VariantsEditor
            variants={variants}
            onAddVariant={handleAddVariant}
            onRemoveVariant={handleRemoveVariant}
            onVariantChange={handleVariantChange}
          />

          {/* Imagen */}
          <input
            type="text"
            value={formData.imageUrl}
            onChange={(e) => setters.setImageUrl(e.target.value)}
            className="w-full px-3 py-2 bg-gray-50 rounded-xl border border-gray-100 text-sm focus:outline-none focus:border-[#E91E63]"
            placeholder="Url de la imagen"
          />

          {/* Descripción */}
          <textarea
            value={formData.description}
            onChange={(e) => setters.setDescription(e.target.value)}
            rows="2"
            className="w-full px-3 py-2 bg-gray-50 rounded-xl border border-gray-100 text-sm focus:outline-none focus:border-[#E91E63] resize-none"
            placeholder="Descripción..."
          />

          {/* Botones de Acción */}
          <div className="flex space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-gray-100 text-gray-600 rounded-xl text-xs font-bold active:scale-95 transition-transform cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 bg-[#E91E63] text-white rounded-xl text-xs font-bold active:scale-95 transition-transform shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}