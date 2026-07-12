import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export function useAppData(searchQuery, selectedCategoryId) {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function cargarDatosReales() {
      try {
        setLoading(true);
        // Traer categorías
        const { data: catData, error: catError } = await supabase
          .from('categories')
          .select('*')
          .order('name', { ascending: true });

        if (catError) throw catError;
        // Traer productos
        const { data: prodData, error: prodError } = await supabase
          .from('products')
          .select('*');

        if (prodError) throw prodError;
        //Mapear datos de forma segura (si vienen vacíos, usamos un array vacío)
        const categoriasAdaptadas = (catData || []).map(c => ({
          id: c.id,
          name: c.name,
          image: c.image_url || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500'
        }));

        const productosAdaptados = (prodData || []).map(p => ({
          id: p.id,
          categoryId: p.category_id,
          name: p.name,
          description: p.description || '',
          price: Number(p.price) || 0,
          stock: p.stock || 0,
          image: p.image_url || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500'
        }));

        setCategories(categoriasAdaptadas);
        setProducts(productosAdaptados);
      } catch (error) {
        console.error("Error conectando a Supabase:", error.message);
        setCategories([]);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    cargarDatosReales();
  }, []);

  // Filtros con protección por si los arrays vienen vacíos
  const filteredCategories = (categories || []).filter(cat => 
    cat.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredProducts = (products || []).filter(product => 
    product.categoryId === selectedCategoryId &&
    product.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return {
    products,
    loading,
    filteredCategories,
    filteredProducts
  };
}