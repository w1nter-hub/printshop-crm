import api from './api';

export const productService = {
  // Получить список всех продуктов
  getAll: async (skip = 0, limit = 100, activeOnly = true) => {
    const response = await api.get(`/products?skip=${skip}&limit=${limit}&active_only=${activeOnly}`);
    return response.data;
  },

  // Получить продукт по ID
  getById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Создать новый продукт
  create: async (productData) => {
    const response = await api.post('/products', productData);
    return response.data;
  },

  // Обновить продукт
  update: async (id, productData) => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },

  // Деактивировать продукт
  delete: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },
};

export default productService;
