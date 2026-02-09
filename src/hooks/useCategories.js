import { useState, useEffect } from 'react';
import { categoryService } from '../services/categoryService';

export const useCategories = () => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await categoryService.getAll();
        setCategorias(data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Error al cargar categorías');
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategorias();
  }, []);

  return { categorias, loading, error };
};