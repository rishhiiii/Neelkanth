import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'
import { WishlistProvider } from './contexts/WishlistContext'
import { AdminAuthProvider } from './admin/contexts/AdminAuthContext'
import StorefrontLayout from './components/StorefrontLayout'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import AdminProtectedRoute from './admin/components/AdminProtectedRoute'
import AdminLayout from './admin/layouts/AdminLayout'
import AdminLogin from './admin/pages/Login/AdminLogin'
import Dashboard from './admin/pages/Dashboard/Dashboard'
import Home from './pages/Home/Home'
import ProductsPage from './pages/Products/ProductsPage'
import ProductDetail from './pages/ProductDetail/ProductDetail'
import CartPage from './pages/Cart/CartPage'
import WishlistPage from './pages/Wishlist/WishlistPage'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import ProfilePage from './pages/Profile/ProfilePage'
import About from './pages/About/About'
import Heritage from './pages/Heritage/Heritage'
import Journal from './pages/Journal/Journal'
import Contact from './pages/Contact/Contact'
import NotFound from './pages/NotFound/NotFound'
import ScrollToTop from './components/ScrollToTop'
import './App.css'

function PlaceholderPage({ title }) {
  return (
    <div style={{ padding: '2rem', textAlign: 'center', color: '#8a8a8a' }}>
      <h2 style={{ fontSize: '1.4rem', fontWeight: 600, color: '#4a4a4a', marginBottom: '0.5rem' }}>{title}</h2>
      <p>This page will be built in an upcoming module.</p>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <AdminAuthProvider>
              <ScrollToTop />
              <Routes>
                {/* ── Admin Panel (no storefront Navbar/Footer) ── */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route
                  path="/admin"
                  element={
                    <AdminProtectedRoute>
                      <AdminLayout />
                    </AdminProtectedRoute>
                  }
                >
                  <Route index element={<Dashboard />} />
                  <Route path="products" element={<PlaceholderPage title="Products" />} />
                  <Route path="products/new" element={<PlaceholderPage title="Add Product" />} />
                  <Route path="products/:id" element={<PlaceholderPage title="Edit Product" />} />
                  <Route path="categories" element={<PlaceholderPage title="Categories" />} />
                  <Route path="health-tags" element={<PlaceholderPage title="Health Tags" />} />
                  <Route path="orders" element={<PlaceholderPage title="Orders" />} />
                  <Route path="orders/:id" element={<PlaceholderPage title="Order Detail" />} />
                  <Route path="customers" element={<PlaceholderPage title="Customers" />} />
                  <Route path="banners" element={<PlaceholderPage title="Banners" />} />
                  <Route path="testimonials" element={<PlaceholderPage title="Testimonials" />} />
                  <Route path="blog" element={<PlaceholderPage title="Blog Posts" />} />
                  <Route path="blog/new" element={<PlaceholderPage title="New Blog Post" />} />
                  <Route path="blog/:id" element={<PlaceholderPage title="Edit Blog Post" />} />
                  <Route path="settings" element={<PlaceholderPage title="Settings" />} />
                  <Route
                    path="admin-users"
                    element={
                      <AdminProtectedRoute allowedRoles={['developer']}>
                        <PlaceholderPage title="Admin Users" />
                      </AdminProtectedRoute>
                    }
                  />
                  <Route path="reports" element={<PlaceholderPage title="Reports" />} />
                </Route>

                {/* ── Storefront (with Navbar + Footer) ── */}
                <Route element={<StorefrontLayout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/heritage" element={<Heritage />} />
                  <Route path="/journal" element={<Journal />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/products" element={<ProductsPage />} />
                  <Route path="/products/:slug" element={<ProductDetail />} />
                  <Route path="/cart" element={
                    <ProtectedRoute><CartPage /></ProtectedRoute>
                  } />
                  <Route path="/wishlist" element={
                    <ProtectedRoute><WishlistPage /></ProtectedRoute>
                  } />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/profile" element={
                    <ProtectedRoute><ProfilePage /></ProtectedRoute>
                  } />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
              <Toaster
                position="bottom-right"
                toastOptions={{
                  duration: 3000,
                  style: { fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.9rem' },
                }}
              />
            </AdminAuthProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
