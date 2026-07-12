import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';

function AdminCategoryList({ categories = [], loading, onEdit, onDelete }) {
  if (loading && (categories || []).length === 0) {
    return <p className="text-center text-xs text-gray-400 p-6 animate-pulse">Sincronizando... 🔄</p>;
  }

  if ((categories || []).length === 0) {
    return <p className="text-center text-xs text-gray-400 p-6">No hay categorías.</p>;
  }

  return (
    <div className="divide-y divide-gray-100">
      {categories.map((cat) => (
        <div key={cat.id} className="p-3 flex items-center justify-between hover:bg-white transition-colors">
          <div className="flex items-center space-x-3 max-w-[65%]">
            <img src={cat.image_url || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500'}  alt={cat.name} className="w-8 h-8 object-cover rounded-lg shadow-sm bg-white" 
            />
            <div className="truncate">
              <span className="text-xs font-bold text-gray-800 truncate block">{cat.name}</span>
              <span className="text-[9px] bg-gray-100 text-gray-400 font-mono px-1.5 py-0.5 rounded-md mt-0.5 inline-block">ID: {cat.id}</span>
            </div>
          </div>

          <div className="flex space-x-1">
            <button onClick={() => onEdit(cat)} className="p-2 bg-amber-50 hover:bg-amber-100 text-amber-600 rounded-xl transition-colors" title="Editar categoría"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => onDelete(cat.id, cat.name)} className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition-colors" title="Eliminar categoría"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AdminCategoryList;