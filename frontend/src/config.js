import { Capacitor } from '@capacitor/core';

const getApiUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  // Для мобильного приложения используем IP адрес компьютера
  if (Capacitor.isNativePlatform()) {
    return 'http://192.168.0.101:8000';
  }
  // Для веба используем localhost
  return 'http://127.0.0.1:8000';
};

export const API_URL = getApiUrl();
