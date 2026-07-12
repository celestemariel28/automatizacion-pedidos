import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export function useProductForm(productToEdit, isOpen, onClose, onSaveSuccess) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [categoryId, setCategoryId] = useState('1');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  // Sincronizar el formulario con el producto a editar o limpiar si es nuevo
  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name || '');
      setDescription(productToEdit.description || '');
      setPrice(productToEdit.price || '');
      setStock(productToEdit.stock || 0);
      setCategoryId(productToEdit.categoryId || '1');
      setImageUrl(productToEdit.image || '');
    } else {
      setName('');
      setDescription('');
      setPrice('');
      setStock('');
      setCategoryId('1');
      setImageUrl('');
    }
  }, [productToEdit, isOpen]);

  const guardarProducto = async (e) => {
    e.preventDefault();
    setLoading(true);

    const productData = {
      name,
      description,
      price: parseFloat(price) || 0,
      stock: parseInt(stock) || 0,
      category_id: parseInt(categoryId),
      image_url: imageUrl || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500',
      is_available: parseInt(stock) > 0
    };

    try {
      if (productToEdit) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', productToEdit.id);

        if (error) throw error;
        alert('¡Producto actualizado con éxito! 🧁');
      } else {
        const { error } = await supabase
          .from('products')
          .insert([productData]);

        if (error) throw error;
        alert('¡Nuevo dulce agregado al catálogo!');
      }

      onSaveSuccess();
      onClose();
    } catch (error) {
      console.error('Error al guardar en Supabase:', error.message);
      alert(`Error al guardar: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return {
    formData: { name, description, price, stock, categoryId, imageUrl },
    setters: { setName, setDescription, setPrice, setStock, setCategoryId, setImageUrl },
    loading,
    guardarProducto
  };
}