import api from './api';

const USER_KEY = 'user';

const saveUser = (user) => {
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_KEY);
  }
};

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
    if (response.data.user) {
      saveUser(response.data.user);
    }
    return response.data;
  },

  fetchMe: async () => {
    const response = await api.get('/auth/me');
    saveUser(response.data);
    return response.data;
  },

  // Выход из системы
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem(USER_KEY);
  },

  // Проверка наличия токена
  isAuthenticated: () => {
    return !!localStorage.getItem('access_token');
  },

  // Получение токена
  getToken: () => {
    return localStorage.getItem('access_token');
  },

  getUser: () => {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  isClient: () => authService.getUser()?.role === 'client',

  isStaff: () => {
    const role = authService.getUser()?.role;
    return role === 'admin' || role === 'manager';
  },

  getHomePath: () => (authService.isClient() ? '/portal' : '/dashboard'),
};

export default authService;
