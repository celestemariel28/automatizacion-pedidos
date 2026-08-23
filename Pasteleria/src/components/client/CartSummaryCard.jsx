import React from 'react';
import { PlusCircle } from 'lucide-react';

export default function CartSummaryCard({ 
  cart = {}, 
  onRemoveItemFromCart = () => {}, 
  setView, 
  mode = 'products'
}) {
  // Obtenemos solo los ítems válidos
  const items = Object.entries(cart).filter(([_, item]) => (parseInt(item?.quantity, 10) || 0) > 0);

  // Suma matemática en vivo de la lista actual
  const subtotal = items.reduce((acc, [_, item]) => {
    const qty = parseInt(item.quantity, 10) || 0;
    const price = parseFloat(item.price) || 0;
    return acc + (qty * price);
  }, 0);

  if (items.length === 0) return null;

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-3xl p-4 shadow-xl border-2 border-pink-100 flex flex-col gap-3 my-3">
      {/* Encabezado Subtotal */}
      <div className="flex justify-between items-center border-b border-pink-100 pb-2">
        <span className="text-xs font-black text-[#D81B60] uppercase tracking-wider">
          {mode === 'form' ? 'Resumen del Pedido' : 'Subtotal Parcial'}
        </span>
        <span className="text-xl font-black text-[#E91E63]">
          ${subtotal.toLocaleString('es-AR')}
        </span>
      </div>

      {/* Lista con botón X */}
      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
        {items.map(([key, item]) => {
          const qty = parseInt(item.quantity, 10) || 1;
          const name = item.productName || item.name || 'Producto';
          const variant = item.variantLabel ? ` (${item.variantLabel})` : '';
          const lineTotal = (parseFloat(item.price) || 0) * qty;

          return (
            <div 
              key={key} 
              className="flex items-center justify-between bg-rose-50/50 hover:bg-rose-50 p-2.5 rounded-xl border border-rose-100 transition-colors text-xs"
            >
              <div className="flex-1 mr-2 leading-tight">
                <p className="font-extrabold text-gray-800">
                  <span className="text-[#E91E63]">{qty}x</span> {name}
                </p>
                {variant && (
                  <p className="text-[10px] text-gray-500 font-medium">{variant}</p>
                )}
              </div>

              <div className="flex items-center gap-2.5">
                <span className="font-black text-gray-700">
                  ${lineTotal.toLocaleString('es-AR')}
                </span>
                <button
                  type="button"
                  onClick={() => onRemoveItemFromCart(key)}
                  className="w-6 h-6 flex items-center justify-center bg-red-100 text-red-500 hover:bg-red-200 hover:text-red-700 rounded-full transition-all active:scale-90 cursor-pointer"
                  title="Eliminar producto"
                >
                  ✕
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Botón para seguir agregando */}
      <button
        type="button"
        onClick={() => setView('categories')}
        className="w-full py-2 bg-pink-50 hover:bg-pink-100/70 text-[#E91E63] rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-pink-200"
      >
        <PlusCircle className="w-4 h-4" />
        <span>Agregar más productos</span>
      </button>

      {/* Botón Continuar */}
      {mode === 'products' && (
        <button
          type="button"
          onClick={() => setView('form')}
          className="w-full py-3.5 bg-[#E91E63] hover:bg-[#D81B60] text-white rounded-2xl font-black text-sm shadow-md active:scale-95 transition-transform cursor-pointer tracking-wide"
        >
          Continuar con el Pedido
        </button>
      )}
    </div>
  );
}