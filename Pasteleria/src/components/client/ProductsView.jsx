import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import CartSummaryCard from './CartSummaryCard';
import ProductCard from './ProductCard';
import ProductModal from './ProductModal';

export default function ProductsView({
  filteredProducts = [],
  selectedCategoryName,
  setView,
  setSearchQuery,
  cart = {},
  onUpdateProductVariants,
  calculateSubtotal,
  onRemoveItemFromCart,
  isCartEmpty
}) {
  const [activeProduct, setActiveProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [availableFillings, setAvailableFillings] = useState([]);

  useEffect(() => {
    async function loadFillings() {
      const { data } = await supabase
        .from('fillings')
        .select('*')
        .eq('available', true)
        .order('name', { ascending: true });

      if (data && data.length > 0) {
        setAvailableFillings(data);
      }
    }
    loadFillings();
  }, []);

  const getVariantQuantityInCart = (productId, variantId) => {
    const foundItem = Object.values(cart).find(
      (item) => String(item.productId) === String(productId) && String(item.variantId).startsWith(String(variantId))
    );
    if (foundItem) return parseInt(foundItem.quantity, 10) || 0;

    const keyUnder = `${productId}_${variantId}`;
    const keyDash = `${productId}-${variantId}`;
    return cart[keyUnder]?.quantity || cart[keyDash]?.quantity || 0;
  };

  const handleOpenProductModal = (product) => {
    setActiveProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setActiveProduct(null);
  };

  const getProductTotalInCart = (productId) => {
    return Object.values(cart)
      .filter((item) => String(item.productId) === String(productId))
      .reduce((sum, item) => sum + (parseInt(item.quantity, 10) || 0), 0);
  };

  return (
    <main className="flex-1 p-4 max-w-md mx-auto w-full pb-28 animate-fadeIn">
      {/* Botón Volver y Título */}
      <div className="flex items-center gap-3 mb-4">
        <button
          type="button"
          onClick={() => {
            setView('categories');
            setSearchQuery('');
          }}
          className="w-8 h-8 flex items-center justify-center bg-white rounded-full text-[#E91E63] shadow-sm active:scale-90 transition-transform cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
        </button>
        <h2 className="text-2xl font-black text-[#E91E63] capitalize">
          {selectedCategoryName || 'Productos'}
        </h2>
      </div>

      {/* Lista de Productos */}
      <div className="flex flex-col gap-4">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            totalInCart={getProductTotalInCart(product.id)}
            onOpenModal={handleOpenProductModal}
          />
        ))}

        {filteredProducts.length === 0 && (
          <p className="text-gray-400 text-center py-6">No se encontraron productos en esta categoría.</p>
        )}
      </div>

      {/* Resumen del Carrito */}
      <CartSummaryCard
        cart={cart}
        calculateSubtotal={calculateSubtotal}
        onRemoveItemFromCart={onRemoveItemFromCart}
        setView={setView}
        mode="products"
      />

      {/* Modal Modularizado */}
      <ProductModal
        product={activeProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSaveToCart={onUpdateProductVariants}
        getVariantQuantityInCart={getVariantQuantityInCart}
        availableFillings={availableFillings}
      />
    </main>
  );
}