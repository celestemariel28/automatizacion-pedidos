//La fila individual editable de porción, precio, stock y botón de borrar. productformmodal
import React from 'react';
import { Trash2 } from 'lucide-react';

export default function VariantRow({ variant, onChange, onRemove, canRemove }) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        required
        placeholder="Ej: 8 porciones"
        value={variant.label}
        onChange={(e) => onChange(variant.id, 'label', e.target.value)}
        className="flex-1 px-3 py-2 bg-gray-50 rounded-xl border border-gray-100 text-sm focus:outline-none focus:border-[#E91E63]"
      />
      <input
        type="number"
        required
        placeholder="Precio"
        value={variant.price}
        onChange={(e) => onChange(variant.id, 'price', e.target.value)}
        className="w-20 px-3 py-2 bg-gray-50 rounded-xl border border-gray-100 text-sm text-center focus:outline-none focus:border-[#E91E63]"
      />
      <input
        type="number"
        required
        placeholder="Stock"
        value={variant.stock}
        onChange={(e) => onChange(variant.id, 'stock', e.target.value)}
        className="w-16 px-3 py-2 bg-gray-50 rounded-xl border border-gray-100 text-sm text-center focus:outline-none focus:border-[#E91E63]"
      />
      {canRemove && (
        <button
          type="button"
          onClick={() => onRemove(variant.id)}
          className="text-red-400 hover:text-red-600 p-1 cursor-pointer active:scale-90 transition-transform"
          title="Eliminar porción"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}