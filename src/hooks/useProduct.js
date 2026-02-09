import { useState, useEffect } from 'react';
import { productService } from '../services/productService';

export const useProduct = (id) => {
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducto = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);
        const data = await productService.getById(id);
        setProducto(data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Error al cargar el producto');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducto();
  }, [id]);

  return { producto, loading, error };
};