import { useState, useEffect } from 'react';
import { api } from '../../services/api';

const Analytics = () => {
  const [ordersByStatus, setOrdersByStatus] = useState([]);
  const [topClients, setTopClients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const [statusData, clientsData] = await Promise.all([
        api.get('/analytics/orders-by-status'),
        api.get('/analytics/top-clients?limit=10')
      ]);
      
      setOrdersByStatus(statusData.data);
      setTopClients(clientsData.data);
    } catch (err) {
      console.error('Failed to load analytics', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="analytics">
      <h1>Analytics</h1>

      <div className="analytics-section">
        <h2>Orders by Status</h2>
        <div className="chart-container">
          {ordersByStatus.map(item => (
            <div key={item.status} className="chart-bar">
              <span className="label">{item.status}</span>
              <div className="bar" style={{ width: `${(item.count / Math.max(...ordersByStatus.map(i => i.count))) * 100}%` }}>
                {item.count}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="analytics-section">
        <h2>Top Clients</h2>
        <table className="data-table">
          <thead>
            <tr>
              <th>Client Name</th>
              <th>Total Orders</th>
              <th>Total Spent</th>
            </tr>
          </thead>
          <tbody>
            {topClients.map(client => (
              <tr key={client.client_id}>
                <td>{client.name}</td>
                <td>{client.order_count}</td>
                <td>${client.total_spent.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Analytics;
