import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useEffect } from 'react'
import { useAuthStore } from './store/authStore'
import { authService } from './services/auth.service'

import Layout from './components/layout/Layout'
import Home from './pages/Home'
import Shop from './pages/Shop'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Dashboard from './pages/dashboard/Dashboard'
import AdminDashboard from './pages/admin/AdminDashboard'
import ProtectedRoute from './components/layout/ProtectedRoute'
import About from './pages/About'
import Collections from './pages/Collections'
import NotFound from './pages/NotFound'
import GoogleSuccess from './pages/auth/GoogleSuccess'

// ── AuthInitializer — OUTSIDE App function ──────────────────
const AuthInitializer = () => {
  const { accessToken, setAuth, logout } = useAuthStore()

  useEffect(() => {
    if (!accessToken) return
    authService.getMe()
      .then(res => setAuth(res.data.data.user, accessToken))
      .catch(() => {
        authService.refresh()
          .then(res => setAuth(null, res.data.data.accessToken))
          .catch(() => logout())
      })
  }, [])

  return null
}

// ── App ─────────────────────────────────────────────────────
function App() {
  return (
    <>
      <AuthInitializer />

      <Toaster
        position="bottom-right"
        gutter={8}
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1A1A1A',
            color: '#F5F5F0',
            border: '1px solid #2A2A2A',
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '13px',
            borderRadius: '2px',
            padding: '12px 16px',
          },
          success: {
            iconTheme: { primary: '#C9A84C', secondary: '#0A0A0A' },
            style: { borderLeft: '3px solid #C9A84C' },
          },
          error: {
            iconTheme: { primary: '#C1121F', secondary: '#F5F5F0' },
            style: { borderLeft: '3px solid #C1121F' },
          },
        }}
      />

      <Routes>
        <Route path="/auth/google/success" element={<GoogleSuccess />} />

        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="shop" element={<Shop />} />
          <Route path="shop/:id" element={<ProductDetail />} />
          <Route path="cart" element={<Cart />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="about" element={<About />} />
          <Route path="collections" element={<Collections />} />

          <Route element={<ProtectedRoute />}>
            <Route path="checkout" element={<Checkout />} />
            <Route path="dashboard/*" element={<Dashboard />} />
          </Route>

          <Route element={<ProtectedRoute adminOnly />}>
            <Route path="admin/*" element={<AdminDashboard />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App