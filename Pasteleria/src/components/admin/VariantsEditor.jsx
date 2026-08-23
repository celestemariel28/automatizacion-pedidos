//La sección que agrupa la cabecera, el botón de añadir y la lista con scroll. productformmodal
import React from 'react';
import { Plus } from 'lucide-react';
import VariantRow from './VariantRow';

export default function VariantsEditor({ variants, onAddVariant, onRemoveVariant, onVariantChange }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center mb-1">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
          Porciones, Precios y Stock
        </span>
        <button
          type="button"
          onClick={onAddVariant}
          className="text-[#E91E63] text-xs font-bold hover:underline flex items-center gap-1 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> Añadir
        </button>
      </div>

      <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
        {variants.map((variant) => (
          <VariantRow
            key={variant.id}
            variant={variant}
            onChange={onVariantChange}
            onRemove={onRemoveVariant}
            canRemove={variants.length > 1}
          />
        ))}
      </div>
    </div>
  );
}