// src/App.jsx
import React, { useState } from 'react';
import Header from './components/Header';
import CategoriesView from './components/CategoriesView';
import ProductsView from './components/ProductsView';
import FormView from './components/FormView';

const CATEGORIES_MOCK = [
  { id: 1, name: 'Tortas', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&auto=format&fit=crop&q=60' },
  { id: 2, name: 'Tartas', image: 'https://images.unsplash.com/photo-1519869325930-281384150729?w=500&auto=format&fit=crop&q=60' },
  { id: 3, name: 'Masitas', image: 'https://images.unsplash.com/photo-1499636136210-6f4ce912714e?w=500&auto=format&fit=crop&q=60' },
  { id: 4, name: 'Alfajores', image: 'https://images.unsplash.com/photo-1600431521340-491ecd880813?w=500&auto=format&fit=crop&q=60' }
];

const PRODUCTS_MOCK = [
  { id: 1, categoryId: 1, name: 'Torta Selva Negra', description: 'Torta de dos pisos con chocolate, cerezas y crema', price: 60000, stock: 3, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500' },
  { id: 2, categoryId: 1, name: 'Torta de Limon', description: 'Base de masa brisa, crema de limón y merengue suizo', price: 60000, stock: 5, image: 'https://images.unsplash.com/photo-1519869325930-281384150729?w=500' },
  { id: 3, categoryId: 2, name: 'Tarta de Frutillas', description: 'Base de tarta con crema pastelera y frutillas frescas', price: 45000, stock: 0, image: 'https://images.unsplash.com/photo-1464305795204-6f5bdf7aff2c?w=500' }, 
  { id: 4, categoryId: 3, name: 'Cookies Chips', description: 'Deliciosas masitas secas con chispas de chocolate', price: 15000, stock: 10, image: 'https://images.unsplash.com/photo-1499636136210-6f4ce912714e?w=500' },
  { id: 5, categoryId: 4, name: 'Alfajores de Maicena x6', description: 'Caja de 6 alfajores de maicena rellenos con dulce de leche', price: 20000, stock: 4, image: 'https://images.unsplash.com/photo-1600431521340-491ecd880813?w=500' }
];

function App() {
  const [view, setView] = useState('categories');
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState({});

  const filteredCategories = CATEGORIES_MOCK.filter(cat => 
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredProducts = PRODUCTS_MOCK.filter(product => 
    product.categoryId === selectedCategoryId &&
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addToCart = (productId) => {
    const product = PRODUCTS_MOCK.find(p => p.id === productId);
    const currentQty = cart[productId] || 0;

    if (product && currentQty >= product.stock) {
      alert(`¡Ups! Solo quedan ${product.stock} unidades disponibles de este producto.`);
      return;
    }

    setCart(prev => ({
      ...prev,
      [productId]: currentQty + 1
    }));
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
      const product = PRODUCTS_MOCK.find(p => p.id === parseInt(productId));
      if (product) subtotal += product.price * cart[productId];
    });
    return subtotal;
  };

  return (
    <div className="min-h-screen bg-[#FBC4CE] flex justify-center items-start font-sans antialiased selection:bg-rose-200">
      <div className="w-full max-w-md min-h-screen bg-[#FFA0B4] shadow-2xl flex flex-col justify-between overflow-hidden relative pb-6">

        <Header 
          view={view} 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
          setView={setView}
        />

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
            PRODUCTS_MOCK={PRODUCTS_MOCK}
          />
        )}

      </div>
    </div>
  );
}

export default App;