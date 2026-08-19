import React, { useState, useEffect } from 'react';
import { useProductForm } from '../../hooks/useProductForm';
import { FileEdit, Sparkles, Plus, Trash2 } from 'lucide-react'; 

function ProductFormModal({ isOpen, onClose, productToEdit, onSaveSuccess, categories = [] }) {
  const { formData, setters, loading, guardarProducto } = useProductForm(
    productToEdit,
    isOpen,
    onClose,
    onSaveSuccess
  );

  // Lista local de variantes con porción, precio y stock
  const [variants, setVariants] = useState([
    { id: Date.now().toString(), label: '', price: '', stock: '' }
  ]);

  // Cargar datos si estamos editando, o limpiar si es nuevo
  useEffect(() => {
    if (isOpen) {
      if (productToEdit) {
        // Cargar campos de texto
        setters.setName(productToEdit.name || '');
        setters.setDescription(productToEdit.description || '');
        setters.setCategoryId(productToEdit.category_id || productToEdit.categoryId || '1');
        setters.setImageUrl(productToEdit.image_url || productToEdit.image || '');

        // Cargar variantes si existen
        let variantesRaw = productToEdit.variante || productToEdit.variants;

        // Por si viene como texto JSON desde la base de datos
        if (typeof variantesRaw === 'string') {
          try {
            variantesRaw = JSON.parse(variantesRaw);
          } catch (err) {
            variantesRaw = [];
          }
        }

        if (Array.isArray(variantesRaw) && variantesRaw.length > 0) {
          setVariants(variantesRaw.map(v => ({
            id: v.id || Date.now().toString() + Math.random(),
            label: v.label || '',
            price: v.price !== undefined ? v.price : '',
            stock: v.stock !== undefined ? v.stock : ''
          })));
        } else {
          setVariants([{ id: Date.now().toString(), label: '', price: '', stock: '' }]);
        }
      } else {
        // Formulario limpio para nuevo producto
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
      setVariants(variants.filter(v => v.id !== id));
    } else {
      alert("El producto debe tener al menos una porción/variante.");
    }
  };

  const handleVariantChange = (id, field, value) => {
    setVariants(variants.map(v => v.id === id ? { ...v, [field]: value } : v));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar que todas las variantes tengan nombre, precio y stock completados
    for (const v of variants) {
      if (!v.label.trim() || v.price === '' || v.stock === '') {
        alert('Por favor, completa la porción, el precio y el stock de todas las variantes agregadas.');
        return;
      }
    }

    const finalVariants = variants.map(v => ({
      id: v.id,
      label: v.label,
      price: parseFloat(v.price) || 0,
      stock: parseInt(v.stock) || 0
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
          <div>
            <input 
              type="text" 
              required 
              value={formData.name} 
              onChange={(e) => setters.setName(e.target.value)} 
              className="w-full px-3 py-2 bg-gray-50 rounded-xl border border-gray-100 text-sm focus:outline-none focus:border-[#E91E63]" 
              placeholder="Nombre del dulce" 
            />
          </div>

          {/* Categoría */}
          <div>
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
          </div>

          {/* LISTA DE VARIANTES (3 columnas como en tu foto) */}
          <div className="space-y-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Porciones, Precios y Stock</span>
              <button 
                type="button" 
                onClick={handleAddVariant} 
                className="text-[#E91E63] text-xs font-bold hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Añadir
              </button>
            </div>

            <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
              {variants.map((variant) => (
                <div key={variant.id} className="flex items-center gap-2">
                  {/* Porción / Label */}
                  <input 
                    type="text" 
                    required 
                    placeholder="Ej: 8 porciones" 
                    value={variant.label} 
                    onChange={(e) => handleVariantChange(variant.id, 'label', e.target.value)}
                    className="flex-1 px-3 py-2 bg-gray-50 rounded-xl border border-gray-100 text-sm focus:outline-none focus:border-[#E91E63]"
                  />
                  {/* Precio */}
                  <input 
                    type="number" 
                    required 
                    placeholder="Precio" 
                    value={variant.price} 
                    onChange={(e) => handleVariantChange(variant.id, 'price', e.target.value)}
                    className="w-20 px-3 py-2 bg-gray-50 rounded-xl border border-gray-100 text-sm text-center focus:outline-none focus:border-[#E91E63]"
                  />
                  {/* Stock */}
                  <input 
                    type="number" 
                    required 
                    placeholder="Stock" 
                    value={variant.stock} 
                    onChange={(e) => handleVariantChange(variant.id, 'stock', e.target.value)}
                    className="w-16 px-3 py-2 bg-gray-50 rounded-xl border border-gray-100 text-sm text-center focus:outline-none focus:border-[#E91E63]"
                  />
                  {/* Eliminar fila */}
                  {variants.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => handleRemoveVariant(variant.id)}
                      className="text-red-400 hover:text-red-600 p-1"
                      title="Eliminar porción"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Imagen */}
          <div>
            <input 
              type="text" 
              value={formData.imageUrl} 
              onChange={(e) => setters.setImageUrl(e.target.value)} 
              className="w-full px-3 py-2 bg-gray-50 rounded-xl border border-gray-100 text-sm focus:outline-none focus:border-[#E91E63]" 
              placeholder="Url de la imagen" 
            />
          </div>

          {/* Descripción */}
          <div>
            <textarea 
              value={formData.description} 
              onChange={(e) => setters.setDescription(e.target.value)} 
              rows="2" 
              className="w-full px-3 py-2 bg-gray-50 rounded-xl border border-gray-100 text-sm focus:outline-none focus:border-[#E91E63] resize-none" 
              placeholder="Descripción..."
            />
          </div>

          {/* Botones */}
          <div className="flex space-x-3 pt-2">
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 py-2.5 bg-gray-100 text-gray-600 rounded-xl text-xs font-bold active:scale-95 transition-transform"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={loading} 
              className="flex-1 py-2.5 bg-[#E91E63] text-white rounded-xl text-xs font-bold active:scale-95 transition-transform shadow-sm disabled:opacity-50"
            >
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductFormModal;