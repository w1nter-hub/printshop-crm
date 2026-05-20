import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import ruRU from 'antd/locale/ru_RU';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import Home from './pages/Dashboard/Home';
import ClientsList from './pages/Clients/ClientsList';
import ProductsList from './pages/Products/ProductsList';
import OrdersList from './pages/Orders/OrdersList';
import ClientPortal from './pages/Portal/ClientPortal';
import MyOrders from './pages/Portal/MyOrders';
import ClientOrderDetails from './pages/Portal/ClientOrderDetails';
import authService from './services/authService';

const ProtectedRoute = ({ children, staffOnly = false, clientOnly = false }) => {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" />;
  }
  if (staffOnly && authService.isClient()) {
    return <Navigate to="/portal" />;
  }
  if (clientOnly && !authService.isClient()) {
    return <Navigate to="/dashboard" />;
  }
  return children;
};

const RootRedirect = () => {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" />;
  }
  return <Navigate to={authService.getHomePath()} />;
};

function App() {
  return (
    <ConfigProvider locale={ruRU}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute staffOnly>
                <Dashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<Home />} />
            <Route path="clients" element={<ClientsList />} />
            <Route path="products" element={<ProductsList />} />
            <Route path="orders" element={<OrdersList />} />
          </Route>
          <Route
            path="/portal"
            element={
              <ProtectedRoute clientOnly>
                <ClientPortal />
              </ProtectedRoute>
            }
          >
            <Route index element={<MyOrders />} />
            <Route path="orders/:orderId" element={<ClientOrderDetails />} />
          </Route>
          <Route path="/" element={<RootRedirect />} />
          <Route path="*" element={<RootRedirect />} />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
