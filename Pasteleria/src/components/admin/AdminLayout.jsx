// src/components/admin/AdminLayout.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import Login from './Login';
import ProductFormModal from './ProductFormModal';
import AdminProductList from './AdminProductList';
import AdminCategoryManager from './AdminCategoryManager';
import { CakeSlice, Tag, PlusCircle, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function AdminLayout({ setView }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [activeTab, setActiveTab] = useState('products');

  // 🌸 NUEVO: Estado global para guardar tus 6 categorías reales
  const [categories, setCategories] = useState([]);

  // 🌸 NUEVO: Función mágica que va a Supabase a buscar las categorías reales
  const fetchAdminCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error cargando las categorías:', error.message);
    }
  };

  const fetchAdminProducts = async () => {
    try {
      setLoadingProducts(true);
      const { data, error } = await supabase.from('products').select('*').order('id', { ascending: false });
      if (error) throw error;

      setProducts((data || []).map(p => ({
        id: p.id,
        categoryId: p.category_id,
        name: p.name,
        description: p.description,
        price: p.price,
        stock: p.stock,
        image: p.image_url
      })));
    } catch (error) {
      console.error('Error cargando tabla de administración:', error.message);
    } finally {
      setLoadingProducts(false);
    }
  };

  // 🌸 MEJORADO: Cuando te logueás, trae los productos Y TAMBIÉN las categorías juntas
  useEffect(() => {
    if (user) {
      fetchAdminProducts();
      fetchAdminCategories();
    }
  }, [user]);

  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`¿Estás segura de que querés eliminar permanentemente "${name}"?`)) return;
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      alert('Producto eliminado correctamente.');
      fetchAdminProducts();
    } catch (error) {
      alert(`No se pudo eliminar: ${error.message}`);
    }
  };

  if (!user) return <Login setView={setView} onLoginSuccess={setUser} />;

  return (
    <div className="flex-1 p-4 flex flex-col bg-white m-4 rounded-3xl shadow-xl max-h-[85vh] overflow-hidden">
      {/* CABECERA */}
      <div className="flex justify-between items-center border-b pb-2 mb-2">
        <div>
          <h2 className="text-lg font-black text-[#E91E63]">Panel de Control</h2>
          <p className="text-[10px] text-gray-400">Admin: {user.email}</p>
        </div>
        <button 
          onClick={() => setUser(null)} 
          className="text-xs font-bold text-red-500 bg-red-50 px-3 py-1.5 rounded-xl active:scale-95 transition-transform flex items-center space-x-1 hover:bg-red-100/70"
        >
          <span>Salir</span>
          <LogOut className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 🎛️ PESTAÑAS */}
      <div className="flex bg-gray-100 p-1 rounded-xl mb-3">
        <button 
          onClick={() => setActiveTab('products')}
          className={`flex-1 py-1.5 flex items-center justify-center space-x-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === 'products' ? 'bg-white text-[#E91E63] shadow-sm' : 'text-gray-500'}`}
        >
          <CakeSlice className="w-3.5 h-3.5" />
          <span>Productos</span>
        </button>
        <button 
          onClick={() => setActiveTab('categories')}
          className={`flex-1 py-1.5 flex items-center justify-center space-x-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === 'categories' ? 'bg-white text-[#E91E63] shadow-sm' : 'text-gray-500'}`}
        >
          <Tag className="w-3.5 h-3.5" />
          <span>Categorías</span>
        </button>
      </div>

      {/* CONTENIDO DINÁMICO */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {activeTab === 'products' ? (
          <>
            <div className="mb-3">
              <button 
                onClick={() => { setProductToEdit(null); setIsModalOpen(true); }} 
                className="w-full py-2.5 bg-[#E91E63] text-white rounded-xl text-xs font-bold shadow-sm active:scale-95 transition-transform hover:bg-[#d81b60] flex items-center justify-center space-x-1.5"
              >
                <PlusCircle className="w-5 h-5"/> 
                <span>Agregar Nuevo Producto</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto border border-gray-100 rounded-2xl bg-gray-50/50">
              <AdminProductList 
                products={products}
                loading={loadingProducts}
                onEdit={(prod) => { setProductToEdit(prod); setIsModalOpen(true); }}
                onDelete={handleDeleteProduct}
              />
            </div>
          </>
        ) : (
          /* 🌸 CONECTADO: Le pasamos la lista y la función que recarga para que cuando agregues una se actualice en el acto */
          <AdminCategoryManager 
            onRefreshProducts={fetchAdminProducts} 
            onCategoryChanged={fetchAdminCategories} 
          />
        )}
      </div>

      {/* BOTÓN REGRESAR */}
      <button 
        onClick={() => navigate('/')} // 👈 🔄 CAMBIAMOS ESTO: Ahora te manda físicamente a la ruta raíz
        className="mt-3 w-full py-2.5 bg-gray-100 text-gray-600 rounded-xl text-xs font-bold active:scale-95 transition-transform"
      >
        Ir al Catálogo Público
      </button>

      {/* 🌸 CONECTADO: Ahora el modal recibe la variable categories viva que viene de Supabase */}
      <ProductFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        productToEdit={productToEdit} 
        onSaveSuccess={fetchAdminProducts} 
        categories={categories} 
      />
    </div>
  );
}

export default AdminLayout;