import React, { useState } from 'react';

export default function ProductsView({
  filteredProducts = [],
  selectedCategoryName,
  setView,
  setSearchQuery,
  cart = {},
  onUpdateProductVariants
}) {
  const [activeProduct, setActiveProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalQuantities, setModalQuantities] = useState({});
  // ⚡ Forzador de renderizado instantáneo
  const [, setForceRender] = useState(0);

  // 1. Obtener la cantidad de la variante en el carrito
  const getVariantQuantityInCart = (productId, variantId) => {
    const directKey = `${productId}-${variantId}`;
    return cart[directKey]?.quantity || 0;
  };

  // 2. Abrir modal y cargar estado previo
  const handleOpenProductModal = (product) => {
    setActiveProduct(product);

    let variantsList = product.variante || product.variants || [];
    if (typeof variantsList === 'string') {
      try {
        variantsList = JSON.parse(variantsList);
      } catch {
        variantsList = [];
      }
    }

    const initialQty = {};
    variantsList.forEach((v) => {
      const vIdKey = String(v.id);
      initialQty[vIdKey] = getVariantQuantityInCart(product.id, v.id);
    });

    setModalQuantities(initialQty);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setActiveProduct(null);
    setModalQuantities({});
  };

  const handleIncrement = (variantId, maxStock) => {
    const key = String(variantId);
    const current = modalQuantities[key] || 0;
    if (current < maxStock) {
      setModalQuantities(prev => ({
        ...prev,
        [key]: current + 1
      }));
    }
  };

  const handleDecrement = (variantId) => {
    const key = String(variantId);
    const current = modalQuantities[key] || 0;
    if (current > 0) {
      setModalQuantities(prev => ({
        ...prev,
        [key]: current - 1
      }));
    }
  };

  // 3. Confirmar selección y forzar actualización en vivo
  const handleSaveModalToCart = () => {
    if (!activeProduct) return;

    let variantsList = activeProduct.variante || activeProduct.variants || [];
    if (typeof variantsList === 'string') {
      try {
        variantsList = JSON.parse(variantsList);
      } catch {
        variantsList = [];
      }
    }

    const selectedVariants = variantsList.map((variant) => {
      const key = String(variant.id);
      const qty = modalQuantities[key] || 0;
      return {
        productId: activeProduct.id,
        productName: activeProduct.name,
        image: activeProduct.image || activeProduct.image_url,
        variantId: variant.id,
        variantLabel: variant.label,
        price: parseFloat(variant.price) || 0,
        quantity: parseInt(qty, 10) || 0,
        maxStock: parseInt(variant.stock, 10) || 0
      };
    });

    if (onUpdateProductVariants) {
      onUpdateProductVariants(activeProduct.id, selectedVariants);
    }

    // ⚡ Forzar re-render de ProductsView en el acto
    setForceRender(prev => prev + 1);
    handleCloseModal();
  };

  // Total de unidades del producto para mostrar en el badge
  const getProductTotalInCart = (productId) => {
    return Object.values(cart)
      .filter(item => String(item.productId) === String(productId))
      .reduce((sum, item) => sum + (parseInt(item.quantity, 10) || 0), 0);
  };

  // 4. Calcular el subtotal sumando cada elemento del carrito
  let liveSubtotal = 0;
  Object.values(cart).forEach((item) => {
    const price = parseFloat(item.price) || 0;
    const qty = parseInt(item.quantity, 10) || 0;
    liveSubtotal += price * qty;
  });

  const hasItemsInCart = liveSubtotal > 0;

  return (
    <main className={`flex-1 p-4 flex flex-col justify-between max-w-md mx-auto w-full min-h-[85vh] transition-all ${hasItemsInCart ? 'pb-36' : 'pb-6'}`}>
      
      {/* Encabezado */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => {
              setView('categories');
              setSearchQuery('');
            }}
            className="w-8 h-8 flex items-center justify-center bg-white rounded-full text-[#E91E63] shadow-sm transition-all active:scale-90 cursor-pointer"
            title="Volver"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
          </button>
          <h2 className="text-2xl font-black text-[#E91E63] capitalize">
            {selectedCategoryName || 'Productos'}
          </h2>
        </div>

        {/* Lista de productos */}
        <div className="space-y-3 overflow-y-auto max-h-[70vh] pr-1 pb-2">
          {filteredProducts.map((product) => {
            const countInCart = getProductTotalInCart(product.id);
            const isSelected = countInCart > 0;

            return (
              <div
                key={product.id}
                onClick={() => handleOpenProductModal(product)}
                className={`p-3 rounded-2xl bg-white flex items-center gap-3.5 cursor-pointer transition-all border-2 shadow-sm relative ${
                  isSelected ? 'border-[#E91E63]' : 'border-transparent hover:border-gray-200'
                }`}
              >
                <img
                  src={product.image || product.image_url || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500'}
                  alt={product.name}
                  className="w-20 h-24 object-cover rounded-xl shrink-0 bg-gray-50"
                />

                <div className="flex-1 min-w-0 pr-2">
                  <h3 className="font-extrabold text-sm text-[#E91E63] leading-tight">
                    {product.name}
                  </h3>
                  <p className="text-xs  text-black mt-1 line-clamp-3 leading-relaxed">
                    {product.description || 'Sin descripción disponible.'}
                  </p>
                </div>

                {isSelected && (
                  <div className="shrink-0 flex items-center gap-1 bg-[#E91E63] text-white px-2.5 py-1 rounded-full text-xs font-black shadow-sm">
                    <span>{countInCart}</span>
                    <span className="text-[10px]">en pedido</span>
                  </div>
                )}
              </div>
            );
          })}

          {filteredProducts.length === 0 && (
            <p className="text-center text-xs text-gray-400 py-10">
              No hay productos cargados en esta categoría.
            </p>
          )}
        </div>
      </div>

      {/* Modal de selección de porciones */}
      {isModalOpen && activeProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-sm rounded-3xl p-5 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto relative">
            
            <button
              type="button"
              onClick={handleCloseModal}
              className="absolute top-4 right-4 w-7 h-7 bg-pink-100 text-[#E91E63] rounded-full flex items-center justify-center hover:bg-pink-200 transition-colors cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="flex items-start gap-3.5 pr-6 mb-4">
              <img
                src={activeProduct.image || activeProduct.image_url || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500'}
                alt={activeProduct.name}
                className="w-24 h-28 object-cover rounded-2xl shrink-0"
              />
              <div>
                <h3 className="font-black text-sm text-[#E91E63] uppercase leading-tight">
                  {activeProduct.name}
                </h3>
                <p className="text-xs text-black mt-1 line-clamp-4 leading-relaxed">
                  {activeProduct.description}
                </p>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-3">
              <h4 className="text-xs font-bold text-[#E91E63] mb-2.5">
                Seleccioná las porciones que quieras
              </h4>

              <div className="space-y-2.5 mb-4 max-h-[220px] overflow-y-auto pr-1">
                {(() => {
                  let variantsList = activeProduct.variante || activeProduct.variants || [];
                  if (typeof variantsList === 'string') {
                    try { variantsList = JSON.parse(variantsList); } catch { variantsList = []; }
                  }

                  if (!Array.isArray(variantsList) || variantsList.length === 0) {
                    return (
                      <p className="text-xs text-gray-400 text-center py-2">
                        No hay variantes disponibles.
                      </p>
                    );
                  }

                  return variantsList.map((v) => {
                    const key = String(v.id);
                    const currentSelectedQty = modalQuantities[key] || 0;
                    const originalStock = parseInt(v.stock, 10) || 0;
                    const remainingStock = Math.max(0, originalStock - currentSelectedQty);
                    const sinStockTotal = originalStock <= 0;

                    return (
                      <div
                        key={v.id}
                        className={`p-3 rounded-2xl border-2 flex items-center justify-between transition-all ${
                          sinStockTotal
                            ? 'border-gray-200 bg-gray-50 opacity-50'
                            : currentSelectedQty > 0
                            ? 'border-[#E91E63] bg-pink-50/20'
                            : 'border-pink-100 hover:border-pink-200'
                        }`}
                      >
                        <div className="flex-1 pr-2">
                          <span className="text-xs font-bold text-gray-800 block">
                            {v.label}
                          </span>
                          <span className="text-xs font-black text-[#E91E63]">
                            ${Number(v.price).toLocaleString('es-AR')}
                          </span>
                          <span className="text-[10px] text-gray-400 block mt-0.5">
                            Stock restante: <strong className={remainingStock === 0 ? 'text-red-500 font-bold' : 'text-gray-700'}>{remainingStock}</strong>
                          </span>
                        </div>

                        {!sinStockTotal ? (
                          <div className="flex items-center gap-2 border border-pink-200 rounded-full p-1 bg-white">
                            <button
                              type="button"
                              onClick={() => handleDecrement(v.id)}
                              disabled={currentSelectedQty === 0}
                              className="w-6 h-6 rounded-full bg-[#E91E63] text-white flex items-center justify-center font-bold text-xs disabled:opacity-20 active:scale-95 transition-transform cursor-pointer"
                            >
                              −
                            </button>
                            <span className="font-extrabold text-xs text-gray-900 w-4 text-center">
                              {currentSelectedQty}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleIncrement(v.id, originalStock)}
                              disabled={currentSelectedQty >= originalStock}
                              className="w-6 h-6 rounded-full bg-[#E91E63] text-white flex items-center justify-center font-bold text-xs disabled:opacity-20 active:scale-95 transition-transform cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <span className="text-[10px] font-bold text-red-500 uppercase">Agotado</span>
                        )}
                      </div>
                    );
                  });
                })()}
              </div>

              {/* Botón Confirmar Selección */}
              <button
                type="button"
                onClick={handleSaveModalToCart}
                className="w-full py-3.5 bg-[#E91E63] text-white font-bold rounded-2xl shadow-sm text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform hover:bg-[#d81b60] cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>
                <span>Confirmar selección</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Total parcial inferior */}
      <footer className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-[#FFC5D3] border-t-2 border-[#D81B60] shadow-2xl flex flex-col gap-3 rounded-t-3xl z-40">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-[#D81B60]">Total parcial:</span>
          <span className="text-2xl font-black text-[#E91E63]">
            ${liveSubtotal.toLocaleString('es-AR')}
          </span>
        </div>
        <button
          onClick={() => {
            if (hasItemsInCart) setView('form');
          }}
          disabled={!hasItemsInCart}
          className="w-full bg-[#E91E63] text-white py-3.5 rounded-xl font-bold hover:bg-[#D81B60] transition-colors text-lg shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 cursor-pointer"
        >
          Continuar Pedido
        </button>
      </footer>
    </main>
  );
}