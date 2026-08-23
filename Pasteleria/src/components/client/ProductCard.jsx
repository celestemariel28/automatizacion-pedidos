import React from 'react';

export default function ProductCard({ product, totalInCart, onOpenModal }) {
  const rawVariants = product.variante || product.variants || [];
  let variants = [];
  if (typeof rawVariants === 'string') {
    try { variants = JSON.parse(rawVariants); } catch { variants = []; }
  } else if (Array.isArray(rawVariants)) {
    variants = rawVariants;
  }

  const hasStock = variants.some((v) => (parseInt(v.stock, 10) || 0) > 0);

  return (
    <div
      onClick={() => onOpenModal(product)}
      className="bg-white rounded-3xl p-3 shadow-md border border-pink-100 flex gap-4 items-center cursor-pointer hover:scale-[1.01] transition-transform"
    >
      <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-100 shrink-0">
        <img
          src={product.image || product.image_url}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-extrabold text-base text-[#E91E63] leading-tight truncate">
          {product.name}
        </h3>
        <p className="text-xs text-gray-500 line-clamp-2 mt-1">
          {product.description}
        </p>

        {/* Fila inferior: Precio a la izquierda y Badge "en pedido" o "Sin stock" a la derecha */}
        <div className="mt-2.5 flex items-center justify-between gap-2">
          <span className="text-xs font-black text-gray-800 shrink-0">
            {variants.length > 1
              ? `Desde $${Math.min(...variants.map((v) => parseFloat(v.price) || 0)).toLocaleString('es-AR')}`
              : variants[0]
              ? `$${(parseFloat(variants[0].price) || 0).toLocaleString('es-AR')}`
              : ''}
          </span>

          <div className="flex items-center gap-1.5 shrink-0">
            {!hasStock && (
              <span className="text-[10px] font-bold text-red-500 uppercase">
                Sin Stock
              </span>
            )}

            {totalInCart > 0 && (
              <span className="bg-[#E91E63] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-sm">
                {totalInCart} en pedido
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}