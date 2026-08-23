//La fila individual de cada porción (con modo visualización y modo edición rápida). relacionado con CustonCAkeAdmin
import React, { useState } from 'react';
import { Pencil, Trash2, Check, X } from 'lucide-react';

export default function PortionItemRow({ item, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editLabel, setEditLabel] = useState(item.label);
  const [editPrice, setEditPrice] = useState(item.price);

  const handleSave = () => {
    if (!editLabel.trim() || !editPrice) return;
    onUpdate(item.id, editLabel.trim(), editPrice);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditLabel(item.label);
    setEditPrice(item.price);
    setIsEditing(false);
  };

  return (
    <div className="flex items-center justify-between p-3 bg-pink-50/30 border border-pink-100 rounded-xl text-xs">
      {isEditing ? (
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
            onClick={handleSave}
            className="w-7 h-7 bg-emerald-500 text-white rounded-lg flex items-center justify-center active:scale-90 transition-transform cursor-pointer"
            title="Guardar"
          >
            <Check className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleCancel}
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
              onClick={() => setIsEditing(true)}
              className="w-7 h-7 flex items-center justify-center bg-blue-50 text-amber-600 hover:bg-blue-100 rounded-lg active:scale-90 transition-transform cursor-pointer"
              title="Editar"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(item.id, item.label)}
              className="w-7 h-7 flex items-center justify-center bg-red-50 text-red-500 hover:bg-red-100 rounded-lg active:scale-90 transition-transform cursor-pointer"
              title="Eliminar"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}