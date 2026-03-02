import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import AdminLayout from './components/AdminLayout.jsx';
import UserHome from './pages/UserHome.jsx';
import ProductTable from './pages/admin/ProductTable.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AddProduct from './pages/admin/AddProduct.jsx';
import EditProduct from './pages/admin/EditProduct.jsx';
import DashboardHome from './pages/admin/DashboardHome.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        {/* Admin Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />

          {/* Product Routes */}
          <Route path="products">
            <Route index element={<ProductTable />} />
            <Route path="add" element={<AddProduct />} />
            <Route path="edit/:id" element={<EditProduct />} />
          </Route>

          <Route path="categories" element={<div className="p-4">Category List Coming Soon</div>} />
        </Route>

        {/* User Routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute allowedRole="user">
              <UserHome />
            </ProtectedRoute>
          }
        />

        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;