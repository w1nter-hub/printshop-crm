export const ORDER_STATUS_LABELS = {
  new: 'Новый',
  in_progress: 'В работе',
  ready: 'Готов',
  completed: 'Выдан',
  cancelled: 'Отменен',
};

export const ORDER_STATUS_COLORS = {
  new: 'blue',
  in_progress: 'orange',
  ready: 'green',
  completed: 'success',
  cancelled: 'red',
};

export const getStatusText = (status) => ORDER_STATUS_LABELS[status] || status;
export const getStatusColor = (status) => ORDER_STATUS_COLORS[status] || 'default';
