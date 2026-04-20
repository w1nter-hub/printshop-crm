import api from './api';

export const authService = {
  // Регистрация нового пользователя
  register: async (email, password, full_name) => {
    const response = await api.post('/auth/register', {
      email,
      password,
      full_name,
    });
    return response.data;
  },

  // Вход в систему
  login: async (email, password) => {
    const response = await api.post('/auth/login', {
      email,
      password,
    });
    if (response.data.access_token) {
      localStorage.setItem('access_token', response.data.access_token);
    }
    return response.data;
  },

  // Выход из системы
  logout: () => {
    localStorage.removeItem('access_token');
  },

  // Проверка наличия токена
  isAuthenticated: () => {
    return !!localStorage.getItem('access_token');
  },

  // Получение токена
  getToken: () => {
    return localStorage.getItem('access_token');
  },
};

export default authService;
