import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ProductList from './components/products/ProductList';
import SaleList from './components/sales/SaleList';
import CurrentStockReport from './components/reports/CurrentStockReport';
import DateWiseStockReport from './components/reports/DateWiseStockReport';
import PrivateRoute from './components/auth/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <div className="container mt-4">
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products" element={<PrivateRoute><ProductList /></PrivateRoute>} />
          <Route path="/sales" element={<PrivateRoute><SaleList /></PrivateRoute>} />
          <Route path="/reports/current-stock" element={<PrivateRoute><CurrentStockReport /></PrivateRoute>} />
          <Route path="/reports/date-wise" element={<PrivateRoute><DateWiseStockReport /></PrivateRoute>} />
          <Route path="/" element={<Navigate to="/products" />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;