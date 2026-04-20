import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderService } from '../../services/orderService';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    try {
      const data = await orderService.getOrders(statusFilter);
      setOrders(data);
    } catch (err) {
      setError('Failed to load orders');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      pending: 'badge-warning',
      in_progress: 'badge-info',
      printing: 'badge-primary',
      finishing: 'badge-secondary',
      completed: 'badge-success',
      cancelled: 'badge-danger',
      delivered: 'badge-success'
    };
    return `badge ${statusColors[status] || 'badge-default'}`;
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="order-list">
      <div className="page-header">
        <h1>Orders</h1>
        <Link to="/orders/new" className="btn btn-primary">Create New Order</Link>
      </div>

      <div className="filters">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="printing">Printing</option>
          <option value="finishing">Finishing</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
          <option value="delivered">Delivered</option>
        </select>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Order #</th>
            <th>Title</th>
            <th>Quantity</th>
            <th>Total Price</th>
            <th>Status</th>
            <th>Deadline</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td>{order.order_number}</td>
              <td>{order.title}</td>
              <td>{order.quantity}</td>
              <td>${order.total_price.toFixed(2)}</td>
              <td>
                <span className={getStatusBadge(order.status)}>
                  {order.status.replace('_', ' ')}
                </span>
              </td>
              <td>{order.deadline ? new Date(order.deadline).toLocaleDateString() : '-'}</td>
              <td>
                <Link to={`/orders/${order.id}`} className="btn btn-sm">View</Link>
                <Link to={`/orders/${order.id}/edit`} className="btn btn-sm">Edit</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderList;
