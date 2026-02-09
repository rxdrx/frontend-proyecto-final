import { useState, useEffect } from 'react';
import { productService } from '../services/productService';

export const useProducts = (filters = {}) => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await productService.getAll(filters);
        setProductos(data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Error al cargar productos');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, [JSON.stringify(filters)]);

  return { productos, loading, error };
};

const useProduct = (id) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await productService.getById(id);
        setProduct(data.data || null);
      } catch (err) {
        setError(err.response?.data?.message || 'Error al cargar producto');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  return { product, loading, error };
};

export default useProduct;