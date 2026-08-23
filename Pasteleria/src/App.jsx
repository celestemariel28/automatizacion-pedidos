import React, { useState } from 'react';
import { useAppData } from './hooks/useAppData'; 
import Header from './components/client/Header';
import CategoriesView from './components/client/CategoriesView';
import ProductsView from './components/client/ProductsView';
import FormView from './components/client/FormView';
import Login from './components/admin/Login'; 
import AdminLayout from './components/admin/AdminLayout';
import CustomCakeView from './components/client/CustomCakeView';
import { CakeSlice } from 'lucide-react';

function App() {
  const [view, setView] = useState('categories');
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState({});
  
  const { products = [], loading, filteredCategories = [], filteredProducts = [] } = useAppData(searchQuery, selectedCategoryId);

  // En src/App.jsx

  const calculateSubtotal = () => {
    return Object.values(cart).reduce((total, item) => {
      const qty = parseInt(item?.quantity, 10) || 0;
      const price = parseFloat(item?.price) || 0;
      return total + (qty * price);
    }, 0);
  };

  const handleUpdateProductVariantsInCart = (productId, selectedVariants) => {
    setCart((prevCart) => {
      const nextCart = { ...prevCart };

      // 1. Borramos SOLO las variantes que coincidan exactamente con este productId
      Object.keys(nextCart).forEach((key) => {
        if (String(nextCart[key].productId) === String(productId)) {
          delete nextCart[key];
        }
      });

      // 2. Insertamos las variantes con precio numérico garantizado
      selectedVariants.forEach((variant) => {
        const qty = parseInt(variant.quantity, 10) || 0;
        if (qty > 0) {
          const varId = String(variant.variantId || variant.id || 'default');
          const itemKey = `${productId}_${varId}`;
          
          nextCart[itemKey] = {
            ...variant,
            productId: String(productId),
            variantId: varId,
            quantity: qty,
            price: parseFloat(variant.price) || 0
          };
        }
      });

      return { ...nextCart }; // Forzamos nueva referencia para que React reaccione al instante
    });
  };

  // 3. Eliminar ítem individual con la X
  const handleRemoveItemFromCart = (cartKey) => {
    setCart((prevCart) => {
      const nextCart = { ...prevCart };
      delete nextCart[cartKey];
      return nextCart;
    });
};

  const isCartEmpty = Object.keys(cart).length === 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFE9EF] flex flex-col items-center justify-center gap-3">
        <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center shadow-md animate-bounce">
          <CakeSlice className="w-8 h-8 text-[#E91E63]" />
        </div>
        <p className="text-[#E91E63] font-black text-2xl tracking-wide animate-pulse">
          Cargando dulces...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-rose-50 flex flex-col font-sans selection:bg-[#E91E63] selection:text-white">
      <div className="w-full max-w-md mx-auto bg-white min-h-screen flex flex-col shadow-2xl relative">
        
        {view !== 'admin' && (
          <Header 
            view={view} 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery} 
            setView={setView} 
          />
        )}

        {view === 'categories' && (
          <CategoriesView 
            filteredCategories={filteredCategories}
            setSelectedCategoryId={setSelectedCategoryId}
            setSelectedCategoryName={setSelectedCategoryName}
            setView={setView}
            setSearchQuery={setSearchQuery}
          />
        )}

        {view === 'custom-cake' && (
          <CustomCakeView 
            setView={setView}
            onUpdateProductVariants={handleUpdateProductVariantsInCart}
          />
        )}

        {view === 'products' && (
          <ProductsView
            filteredProducts={filteredProducts}
            selectedCategoryName={selectedCategoryName}
            setView={setView}
            setSearchQuery={setSearchQuery}
            cart={cart}
            onUpdateProductVariants={handleUpdateProductVariantsInCart}
            calculateSubtotal={calculateSubtotal}
            onRemoveItemFromCart={handleRemoveItemFromCart} // 👈 Asegurate que esté acá
            isCartEmpty={isCartEmpty}
          />
        )}

        {view === 'form' && (
          <FormView
            setView={setView}
            cart={cart}
            calculateSubtotal={calculateSubtotal}
            onRemoveItemFromCart={handleRemoveItemFromCart} // 👈 Y acá
            PRODUCTS_MOCK={products}
          />
        )}

        {view === 'admin' && (
          <AdminLayout setView={setView} />
        )}

      </div>
    </div>
  );
}

export default App;