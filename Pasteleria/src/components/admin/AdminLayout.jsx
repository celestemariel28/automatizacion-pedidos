import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import Login from './Login';
import ProductFormModal from './ProductFormModal';
import AdminProductList from './AdminProductList';
import AdminCategoryManager from './AdminCategoryManager';
import FillingsAdmin from './FillingsAdmin';
import InfoSlidesAdmin from './InfoSlidesAdmin';
import { CakeSlice, Tag, PlusCircle, LogOut, Sparkles, Image } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CustomCakeAdmin from './CustomCakeAdmin';
import { Layers } from 'lucide-react'; 
import CoveringsAdmin from './CoveringsAdmin';
import { Shield } from 'lucide-react';

const SESSION_DURATION_MS = 20 * 60 * 1000; // 20 minutos

function AdminLayout({ setView }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [activeTab, setActiveTab] = useState('products');
  const [categories, setCategories] = useState([]);

  // 1. Verificación de sesión de 20 min
  useEffect(() => {
    const savedUser = localStorage.getItem('admin_user');
    const loginTime = localStorage.getItem('admin_login_time');

    if (savedUser && loginTime) {
      const now = Date.now();
      const elapsed = now - parseInt(loginTime, 10);

      if (elapsed < SESSION_DURATION_MS) {
        setUser(JSON.parse(savedUser));
      } else {
        handleLogout();
      }
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('admin_user', JSON.stringify(userData));
    localStorage.setItem('admin_login_time', Date.now().toString());
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('admin_user');
    localStorage.removeItem('admin_login_time');
  };

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
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('id', { ascending: false });
        
      if (error) throw error;

      setProducts((data || []).map(p => ({
        id: p.id,
        categoryId: p.category_id,
        name: p.name,
        description: p.description,
        price: p.price,
        stock: p.stock,
        image: p.image_url,
        variante: p.variante
      })));
    } catch (error) {
      console.error('Error cargando tabla de administración:', error.message);
    } finally {
      setLoadingProducts(false);
    }
  };

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

  if (!user) return <Login setView={setView} onLoginSuccess={handleLoginSuccess} />;

  return (
    <div className="flex-1 p-4 flex flex-col bg-white m-4 rounded-3xl shadow-xl max-h-[85vh] overflow-hidden">
      {/* Encabezado */}
      <div className="flex justify-between items-center border-b pb-2 mb-2">
        <div>
          <h2 className="text-lg font-black text-[#E91E63]">Panel de Control</h2>
          <p className="text-[10px] text-gray-400">Admin: {user.email || 'Conectada'}</p>
        </div>
        <button 
          onClick={handleLogout} 
          className="text-xs font-bold text-red-500 bg-red-50 px-3 py-1.5 rounded-xl active:scale-95 transition-transform flex items-center space-x-1 hover:bg-red-100/70 cursor-pointer"
        >
          <span>Salir</span>
          <LogOut className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Pestañas de Navegación (4 Secciones) */}
      <div className="grid grid-cols-4 bg-gray-100 p-1 rounded-xl mb-3 gap-1">
        <button 
          onClick={() => setActiveTab('products')}
          className={`py-1.5 flex items-center justify-center space-x-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${activeTab === 'products' ? 'bg-white text-[#E91E63] shadow-sm' : 'text-gray-500'}`}
        >
          <CakeSlice className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Productos</span>
        </button>

        <button 
          onClick={() => setActiveTab('categories')}
          className={`py-1.5 flex items-center justify-center space-x-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${activeTab === 'categories' ? 'bg-white text-[#E91E63] shadow-sm' : 'text-gray-500'}`}
        >
          <Tag className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Categorías</span>
        </button>

        <button 
          onClick={() => setActiveTab('fillings')}
          className={`py-1.5 flex items-center justify-center space-x-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${activeTab === 'fillings' ? 'bg-white text-[#E91E63] shadow-sm' : 'text-gray-500'}`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Rellenos</span>
        </button>

        <button 
          onClick={() => setActiveTab('slides')}
          className={`py-1.5 flex items-center justify-center space-x-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${activeTab === 'slides' ? 'bg-white text-[#E91E63] shadow-sm' : 'text-gray-500'}`}
        >
          <Image className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Info</span>
        </button>

        <button 
          onClick={() => setActiveTab('customCakes')}
          className={`py-1.5 flex items-center justify-center space-x-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${activeTab === 'customCakes' ? 'bg-white text-[#E91E63] shadow-sm' : 'text-gray-500'}`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Precios Tortas</span>
        </button>

        <button 
          onClick={() => setActiveTab('coverings')}
          className={`py-1.5 flex items-center justify-center space-x-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${activeTab === 'coverings' ? 'bg-white text-[#E91E63] shadow-sm' : 'text-gray-500'}`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Coberturas</span>
        </button>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {activeTab === 'products' && (
          <>
            <div className="mb-3">
              <button 
                onClick={() => { setProductToEdit(null); setIsModalOpen(true); }} 
                className="w-full py-2.5 bg-[#E91E63] text-white rounded-xl text-xs font-bold shadow-sm active:scale-95 transition-transform hover:bg-[#d81b60] flex items-center justify-center space-x-1.5 cursor-pointer"
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
        )}

        {activeTab === 'categories' && (
          <div className="flex-1 overflow-y-auto">
            <AdminCategoryManager 
              onRefreshProducts={fetchAdminProducts} 
              onCategoryChanged={fetchAdminCategories} 
            />
          </div>
        )}

        {activeTab === 'fillings' && (
          <div className="flex-1 overflow-y-auto">
            <FillingsAdmin />
          </div>
        )}

        {activeTab === 'slides' && (
          <div className="flex-1 overflow-y-auto">
            <InfoSlidesAdmin />
          </div>
        )}

        {activeTab === 'customCakes' && (
          <div className="flex-1 overflow-y-auto">
            <CustomCakeAdmin />
          </div>
        )}

        {activeTab === 'coverings' && (
          <div className="flex-1 overflow-y-auto">
            <CoveringsAdmin />
          </div>
        )}
      </div>

      <button 
        onClick={() => {
          if (typeof setView === 'function') {
            setView('categories');
          } else {
            navigate('/');
          }
        }} 
        className="mt-3 w-full py-2.5 bg-gray-100 text-gray-600 rounded-xl text-xs font-bold active:scale-95 transition-transform cursor-pointer"
      >
        Ir al Catálogo Público
      </button>

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