/**
 * Преобразует ответ FastAPI (detail: string | array | object) в текст для message.error.
 */
export function formatApiError(error, fallback = 'Неизвестная ошибка') {
  const detail = error?.response?.data?.detail;

  if (!detail) {
    if (error?.message === 'Network Error') {
      return 'Нет связи с сервером. Проверьте интернет и что backend запущен.';
    }
    return fallback;
  }

  if (typeof detail === 'string') {
    return detail;
  }

  if (Array.isArray(detail)) {
    return detail
      .map((item) => {
        const field = Array.isArray(item.loc) ? item.loc.join('.') : '';
        const msg = item.msg || item.message || JSON.stringify(item);
        return field ? `${field}: ${msg}` : msg;
      })
      .join('; ');
  }

  if (typeof detail === 'object') {
    return detail.message || JSON.stringify(detail);
  }

  return fallback;
}
