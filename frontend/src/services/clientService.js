import api from './api';

export const clientService = {
  // Получить список всех клиентов
  getAll: async (skip = 0, limit = 100) => {
    const response = await api.get(`/clients?skip=${skip}&limit=${limit}`);
    return response.data;
  },

  // Получить клиента по ID
  getById: async (id) => {
    const response = await api.get(`/clients/${id}`);
    return response.data;
  },

  // Создать нового клиента
  create: async (clientData) => {
    const response = await api.post('/clients', clientData);
    return response.data;
  },

  // Обновить данные клиента
  update: async (id, clientData) => {
    const response = await api.put(`/clients/${id}`, clientData);
    return response.data;
  },

  // Удалить клиента
  delete: async (id) => {
    const response = await api.delete(`/clients/${id}`);
    return response.data;
  },
};

export default clientService;
