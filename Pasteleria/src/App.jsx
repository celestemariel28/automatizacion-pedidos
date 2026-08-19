import React, { useState } from 'react';
import { useAppData } from './hooks/useAppData'; 
import Header from './components/client/Header';
import CategoriesView from './components/client/CategoriesView';
import ProductsView from './components/client/ProductsView';
import FormView from './components/client/FormView';
import Login from './components/admin/Login'; 
import AdminLayout from './components/admin/AdminLayout';
import CustomCakeView from './components/client/CustomCakeView';

function App() {
  const [view, setView] = useState('categories');
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState({});
  
  const { products = [], loading, filteredCategories = [], filteredProducts = [] } = useAppData(searchQuery, selectedCategoryId);

  // 🌸 Actualización forzada con nueva referencia limpia
  const handleUpdateProductVariantsInCart = (productId, selectedVariants = []) => {
    setCart((prevCart) => {
      const nextCart = {};

      // Mantenemos los productos que NO sean el que estamos editando
      Object.entries(prevCart).forEach(([key, item]) => {
        if (!key.startsWith(`${productId}-`) && String(item.productId) !== String(productId)) {
          nextCart[key] = item;
        }
      });

      // Agregamos las nuevas variantes seleccionadas con cantidad > 0
      selectedVariants.forEach((item) => {
        const qty = parseInt(item.quantity, 10) || 0;
        if (qty > 0) {
          const cartKey = `${productId}-${item.variantId}`;
          nextCart[cartKey] = {
            id: cartKey,
            productId: productId,
            productName: item.productName || item.name,
            image: item.image || item.image_url,
            variantId: item.variantId,
            variantLabel: item.variantLabel || item.label,
            price: parseFloat(item.price) || 0,
            quantity: qty,
            maxStock: parseInt(item.maxStock, 10) || parseInt(item.stock, 10) || 0
          };
        }
      });

      return { ...nextCart };
    });
  };

  const calculateSubtotal = () => {
    return Object.values(cart).reduce((total, item) => {
      const price = parseFloat(item.price) || 0;
      const quantity = parseInt(item.quantity, 10) || 0;
      return total + (price * quantity);
    }, 0);
  };

  const isCartEmpty = Object.keys(cart).length === 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFE9EF] flex items-center justify-center">
        <p className="text-[#E91E63] font-black text-2xl animate-pulse">Cargando dulces... 🧁</p>
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
            key={JSON.stringify(cart)}
            filteredProducts={filteredProducts}
            selectedCategoryName={selectedCategoryName}
            setView={setView}
            setSearchQuery={setSearchQuery}
            cart={cart}
            onUpdateProductVariants={handleUpdateProductVariantsInCart}
            calculateSubtotal={calculateSubtotal}
            isCartEmpty={isCartEmpty}
          />
        )}

        {view === 'form' && (
          <FormView 
            setView={setView}
            cart={cart}
            calculateSubtotal={calculateSubtotal}
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