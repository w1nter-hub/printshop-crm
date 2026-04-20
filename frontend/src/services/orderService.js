import api from './api';

export const orderService = {
  // Получить список всех заказов
  getAll: async (skip = 0, limit = 100, status = null) => {
    const params = new URLSearchParams({ skip, limit });
    if (status) {
      params.append('status', status);
    }
    const response = await api.get(`/orders?${params.toString()}`);
    return response.data;
  },

  // Получить заказ по ID
  getById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  // Создать новый заказ
  create: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  // Обновить заказ
  update: async (id, orderData) => {
    const response = await api.put(`/orders/${id}`, orderData);
    return response.data;
  },

  // Удалить заказ
  delete: async (id) => {
    const response = await api.delete(`/orders/${id}`);
    return response.data;
  },
};

export default orderService;
