import api from './api';

const portalService = {
  getProfile: async () => {
    const response = await api.get('/portal/me');
    return response.data;
  },

  getMyOrders: async () => {
    const response = await api.get('/portal/orders');
    return response.data;
  },

  getMyOrder: async (orderId) => {
    const response = await api.get(`/portal/orders/${orderId}`);
    return response.data;
  },
};

export default portalService;
