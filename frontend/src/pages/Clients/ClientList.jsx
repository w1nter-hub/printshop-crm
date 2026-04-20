import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { clientService } from '../../services/clientService';

const ClientList = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const data = await clientService.getClients();
      setClients(data);
    } catch (err) {
      setError('Failed to load clients');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      try {
        await clientService.deleteClient(id);
        setClients(clients.filter(client => client.id !== id));
      } catch (err) {
        alert('Failed to delete client');
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="client-list">
      <div className="page-header">
        <h1>Clients</h1>
        <Link to="/clients/new" className="btn btn-primary">Add New Client</Link>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Company</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.map(client => (
            <tr key={client.id}>
              <td>{client.name}</td>
              <td>{client.company_name || '-'}</td>
              <td>{client.email || '-'}</td>
              <td>{client.phone || '-'}</td>
              <td>
                <Link to={`/clients/${client.id}`} className="btn btn-sm">View</Link>
                <Link to={`/clients/${client.id}/edit`} className="btn btn-sm">Edit</Link>
                <button onClick={() => handleDelete(client.id)} className="btn btn-sm btn-danger">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClientList;
