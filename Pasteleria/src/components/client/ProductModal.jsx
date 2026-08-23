import React, { useState, useEffect } from 'react';

export default function ProductModal({
  product,
  isOpen,
  onClose,
  onSaveToCart,
  getVariantQuantityInCart,
  availableFillings
}) {
  const [modalQuantities, setModalQuantities] = useState({});
  const [selectedFilling, setSelectedFilling] = useState('');

  let variantsList = product?.variante || product?.variants || [];
  if (typeof variantsList === 'string') {
    try { variantsList = JSON.parse(variantsList); } catch { variantsList = []; }
  }

  useEffect(() => {
    if (isOpen && product) {
      if (availableFillings.length > 0) {
        setSelectedFilling(availableFillings[0].name);
      }

      const initialQty = {};
      variantsList.forEach((v) => {
        const vIdKey = String(v.id);
        initialQty[vIdKey] = getVariantQuantityInCart(product.id, v.id);
      });
      setModalQuantities(initialQty);
    }
  }, [isOpen, product]);

  if (!isOpen || !product) return null;

  const handleIncrement = (variantId, maxStock) => {
    const key = String(variantId);
    const current = modalQuantities[key] || 0;
    if (current < maxStock) {
      setModalQuantities((prev) => ({ ...prev, [key]: current + 1 }));
    }
  };

  const handleDecrement = (variantId) => {
    const key = String(variantId);
    const current = modalQuantities[key] || 0;
    if (current > 0) {
      setModalQuantities((prev) => ({ ...prev, [key]: current - 1 }));
    }
  };

  const handleConfirm = () => {
    const prodName = String(product.name || '').toLowerCase();
    const requiresFilling = prodName.includes('2') || prodName.includes('dos');
    const chosenFilling = selectedFilling || (availableFillings[0]?.name || '');

    const selectedVariants = variantsList.map((variant) => {
      const key = String(variant.id);
      const qty = modalQuantities[key] || 0;

      const customLabel = requiresFilling && qty > 0
        ? `${variant.label || 'Unidad'} | Relleno: ${chosenFilling}`
        : (variant.label || 'Unidad');

      return {
        productId: product.id,
        productName: product.name,
        image: product.image || product.image_url,
        variantId: `${variant.id}${requiresFilling ? `_${chosenFilling.replace(/\s+/g, '')}` : ''}`,
        variantLabel: customLabel,
        filling: requiresFilling ? chosenFilling : null,
        price: parseFloat(variant.price) || 0,
        quantity: parseInt(qty, 10) || 0,
        maxStock: parseInt(variant.stock, 10) || 0
      };
    });

    onSaveToCart(product.id, selectedVariants);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white w-full max-w-sm rounded-3xl p-5 shadow-2xl flex flex-col gap-4 relative max-h-[90vh] overflow-y-auto">
        
        {/* Botón Cerrar */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 bg-pink-100 text-[#E91E63] rounded-full flex items-center justify-center hover:bg-pink-200 font-bold cursor-pointer"
        >
          ✕
        </button>

        {/* 👇 AQUÍ VA: Cabecera con descripción completa y scroll interno */}
        <div className="flex flex-col gap-2.5 pr-6">
          <div className="flex gap-3 items-center">
            <img
              src={product.image || product.image_url}
              alt={product.name}
              className="w-16 h-16 rounded-2xl object-cover shrink-0 shadow-sm"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-extrabold text-base text-[#E91E63] leading-tight">
                {product.name}
              </h3>
              <p className="text-[10px] text-pink-600 font-semibold mt-0.5">
                Seleccioná las porciones:
              </p>
            </div>
          </div>

          {product.description && (
            <div className="bg-pink-50/50 rounded-xl p-2.5 border border-pink-100 max-h-24 overflow-y-auto pr-1">
              <p className="text-xs text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>
          )}
        </div>

        {/* Lista de Variantes / Porciones */}
        <div className="space-y-2.5 max-h-52 overflow-y-auto pr-1">
          {variantsList.map((variant) => {
            const stock = parseInt(variant.stock, 10) || 0;
            const key = String(variant.id);
            const qty = modalQuantities[key] || 0;

            return (
              <div
                key={variant.id}
                className="flex items-center justify-between p-3 bg-pink-50/50 rounded-2xl border border-pink-100"
              >
                <div>
                  <p className="text-xs font-extrabold text-gray-800">{variant.label}</p>
                  <p className="text-xs font-black text-[#E91E63]">
                    ${(parseFloat(variant.price) || 0).toLocaleString('es-AR')}
                  </p>
                  <p className="text-[10px] text-gray-400">Stock disponible: {stock}</p>
                </div>

                {stock > 0 ? (
                  <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-full border border-pink-200 shadow-sm">
                    <button
                      type="button"
                      onClick={() => handleDecrement(variant.id)}
                      disabled={qty === 0}
                      className="w-6 h-6 rounded-full bg-[#E91E63] text-white flex items-center justify-center font-bold text-xs disabled:opacity-20 active:scale-90 transition-transform cursor-pointer"
                    >
                      −
                    </button>
                    <span className="font-extrabold text-xs text-gray-800 w-4 text-center">
                      {qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleIncrement(variant.id, stock)}
                      disabled={qty >= stock}
                      className="w-6 h-6 rounded-full bg-[#E91E63] text-white flex items-center justify-center font-bold text-xs disabled:opacity-20 active:scale-90 transition-transform cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <span className="text-[10px] font-bold text-red-500 uppercase">Sin Stock</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Selector de Relleno para 2 Rellenos */}
        {(product?.name?.toLowerCase().includes('2') || product?.name?.toLowerCase().includes('dos')) && (
          <div className="bg-pink-50/70 p-3 rounded-2xl border border-pink-100">
            <label className="text-xs font-black text-[#D81B60] uppercase block mb-1">
              Elegí tu segundo relleno:
            </label>
            <select
              value={selectedFilling || (availableFillings[0]?.name || '')}
              onChange={(e) => setSelectedFilling(e.target.value)}
              className="w-full bg-white border border-pink-200 rounded-xl py-2 px-3 text-xs font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#E91E63]"
            >
              {availableFillings.map((f) => (
                <option key={f.id} value={f.name}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <button
          type="button"
          onClick={handleConfirm}
          className="w-full py-3.5 bg-[#E91E63] text-white font-bold rounded-2xl shadow-sm text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform hover:bg-[#d81b60] cursor-pointer"
        >
          <span>Confirmar selección</span>
        </button>
      </div>
    </div>
  );
}