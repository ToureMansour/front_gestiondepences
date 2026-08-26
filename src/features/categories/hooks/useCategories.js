import { useState, useEffect, useCallback } from 'react';
import categoryService from '../services/categoryService';
import { handleApiError } from '../../../services/errorHandler';

export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await categoryService.getAll();
      const data = response.data.data || response.data;
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      const appError = handleApiError(err);
      setError(appError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createCategory = useCallback(async (data) => {
    try {
      const response = await categoryService.create(data);
      const newCat = response.data.data || response.data;
      setCategories((prev) => [...prev, newCat]);
      return { success: true, data: newCat };
    } catch (err) {
      const appError = handleApiError(err);
      return { success: false, error: appError.message };
    }
  }, []);

  const updateCategory = useCallback(async (id, data) => {
    try {
      const response = await categoryService.update(id, data);
      const updated = response.data.data || response.data;
      setCategories((prev) => prev.map((c) => (c.id === id ? updated : c)));
      return { success: true, data: updated };
    } catch (err) {
      const appError = handleApiError(err);
      return { success: false, error: appError.message };
    }
  }, []);

  const deleteCategory = useCallback(async (id) => {
    try {
      await categoryService.remove(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
      return { success: true };
    } catch (err) {
      const appError = handleApiError(err);
      return { success: false, error: appError.message };
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    error,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  };
}
