import { Routes, Route } from 'react-router-dom';
import { Home } from '../pages/Home';
import { Products } from '../pages/Products';
import { ProductDetails } from '../pages/ProductDetails';
import { Cart } from '../pages/Cart';
import { Checkout } from '../pages/Checkout';
import { OrderSuccess } from '../pages/OrderSuccess';
import { ContactUs } from '../pages/ContactUs';
import { AdminLogin } from '../pages/admin/AdminLogin';
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { ManageProducts } from '../pages/admin/ManageProducts';
import { ManageOrders } from '../pages/admin/ManageOrders';
import { AdminLayout } from '../components/layout/AdminLayout';
import { AdminRoute } from './AdminRoute';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

// Layout for client facing pages
function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}

export function AppRoutes() {
  return (
    <Routes>
      {/* Client Routes */}
      <Route path="/" element={<ClientLayout><Home /></ClientLayout>} />
      <Route path="/products" element={<ClientLayout><Products /></ClientLayout>} />
      <Route path="/product/:id" element={<ClientLayout><ProductDetails /></ClientLayout>} />
      <Route path="/cart" element={<ClientLayout><Cart /></ClientLayout>} />
      <Route path="/checkout" element={<ClientLayout><Checkout /></ClientLayout>} />
      <Route path="/order-success" element={<ClientLayout><OrderSuccess /></ClientLayout>} />
      <Route path="/contact" element={<ClientLayout><ContactUs /></ClientLayout>} />

      {/* Admin Login Route */}
      <Route path="/admin" element={<AdminLogin />} />

      {/* Protected Admin Routes */}
      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/products" element={<ManageProducts />} />
          <Route path="/admin/orders" element={<ManageOrders />} />
        </Route>
      </Route>
    </Routes>
  );
}
