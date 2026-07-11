import React, { useState } from 'react';
import { useAppData } from './hooks/useAppData'; 
import Header from './components/client/Header';
import CategoriesView from './components/client/CategoriesView';
import ProductsView from './components/client/ProductsView';
import FormView from './components/client/FormView';
import Login from './components/admin/Login'; 
import AdminLayout from './components/admin/AdminLayout';

function App() {
  // Manejo de pantallas: 'categories', 'products', 'form', 'admin'
  const [view, setView] = useState('categories');
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState({});
  
  // Consumimos el hook (si da error o está vacío, devolvemos arrays vacíos por defecto)
  const { products = [], loading, filteredCategories = [], filteredProducts = [] } = useAppData(searchQuery, selectedCategoryId);

  // --- FUNCIONES DEL CARRITO ---
  const addToCart = (productId) => {
    const product = products.find(p => p.id === productId);
    const currentQty = cart[productId] || 0;

    if (product && currentQty >= product.stock) {
      alert(`¡Ups! Solo quedan ${product.stock} unidades disponibles.`);
      return;
    }
    setCart(prev => ({ ...prev, [productId]: currentQty + 1 }));
  };

  const removeFromCart = (productId) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[productId] > 1) {
        newCart[productId] -= 1;
      } else {
        delete newCart[productId];
      }
      return { ...newCart };
    });
  };

  const calculateSubtotal = () => {
    let subtotal = 0;
    Object.keys(cart).forEach(productId => {
      const product = products.find(p => p.id === parseInt(productId));
      if (product) subtotal += product.price * cart[productId];
    });
    return subtotal;
  };

  // --- PANTALLA DE CARGA INICIAL ---
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FFC5D3] to-[#E91E63] flex items-center justify-center">
        <p className="text-white font-black text-2xl animate-pulse">Cargando dulces... 🧁</p>
      </div>
    );
  }

  // --- RESTAURACIÓN DE TU INTERFAZ ORIGINAL ---
  return (
    <div className="min-h-screen bg-rose-50 flex flex-col font-sans selection:bg-[#E91E63] selection:text-white">
      <div className="w-full max-w-md mx-auto bg-gradient-to-b from-[#FFC5D3] to-[#E91E63] min-h-screen flex flex-col shadow-2xl relative">
        
        {/* El Header se renderiza si no estamos en la pantalla de administración */}
        {view !== 'admin' && (
          <Header 
            view={view} 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery} 
            setView={setView} 
          />
        )}

        {/* RENDERIZADO CONDICIONAL DE VISTAS */}
        {view === 'categories' && (
          <CategoriesView 
            filteredCategories={filteredCategories}
            setSelectedCategoryId={setSelectedCategoryId}
            setSelectedCategoryName={setSelectedCategoryName}
            setView={setView}
            setSearchQuery={setSearchQuery}
          />
        )}

        {view === 'products' && (
          <ProductsView 
            key={Object.keys(cart).length + '-' + Object.values(cart).reduce((a, b) => a + b, 0)}
            filteredProducts={filteredProducts}
            selectedCategoryName={selectedCategoryName}
            setView={setView}
            setSearchQuery={setSearchQuery}
            cart={cart}
            addToCart={addToCart}
            removeFromCart={removeFromCart}
            calculateSubtotal={calculateSubtotal}
            isCartEmpty={Object.keys(cart).length === 0}
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