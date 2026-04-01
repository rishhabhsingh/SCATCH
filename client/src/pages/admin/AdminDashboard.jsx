import { useState, useEffect } from 'react'
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Package, ShoppingBag,
  Users, LogOut, Menu, X, ChevronRight,
  TrendingUp, AlertCircle
} from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { authService } from '../../services/auth.service'
import toast from 'react-hot-toast'

import AdminOverview from './AdminOverview'
import AdminProducts from './AdminProducts'
import AdminOrders from './AdminOrders'
import AdminCustomers from './AdminCustomers'

const navItems = [
  { path: '/admin', label: 'Overview', icon: LayoutDashboard, exact: true },
  { path: '/admin/products', label: 'Products', icon: Package },
  { path: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { path: '/admin/customers', label: 'Customers', icon: Users },
]

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/')
      toast.error('Admin access required')
    }
  }, [user])

  const handleLogout = async () => {
    try { await authService.logout() } catch {}
    logout()
    navigate('/')
  }

  const isActive = (path, exact = false) => {
    if (exact) return location.pathname === path
    return location.pathname.startsWith(path)
  }

  return (
    <div className="bg-primary min-h-screen flex">

      {/* Sidebar */}
      <aside className={`
        fixed lg:relative inset-y-0 left-0 z-40
        w-64 bg-surface border-r border-surface-border
        flex flex-col transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>

        {/* Logo */}
        <div className="px-6 py-6 border-b border-surface-border flex-shrink-0">
          <Link to="/" className="font-display text-2xl text-text-primary tracking-widest hover:text-gold transition-colors">
            SCATCH
          </Link>
          <p className="font-body text-text-disabled text-xs mt-1 tracking-widest uppercase">
            Admin Panel
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map(item => {
            const Icon = item.icon
            const active = isActive(item.path, item.exact)
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 transition-all duration-200 border-l-2
                  ${active
                    ? 'border-gold text-gold bg-primary'
                    : 'border-transparent text-text-secondary hover:text-text-primary hover:bg-primary'
                  }`}
              >
                <Icon size={16} />
                <span className="font-body text-sm">{item.label}</span>
                {active && <ChevronRight size={14} className="ml-auto text-gold" />}
              </Link>
            )
          })}
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-surface-border flex-shrink-0">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="w-8 h-8 bg-gold text-primary rounded-full flex items-center justify-center font-body font-medium text-sm flex-shrink-0">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="font-body text-text-primary text-xs font-medium truncate">{user?.name}</p>
              <p className="font-mono text-gold text-xs">Admin</p>
            </div>
          </div>
          <Link
            to="/dashboard"
            className="flex items-center gap-3 px-4 py-2.5 text-text-secondary hover:text-gold text-sm font-body transition-colors"
          >
            My Account
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-text-secondary hover:text-status-error transition-colors"
          >
            <LogOut size={16} />
            <span className="font-body text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-primary/80 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top bar */}
        <header className="bg-surface border-b border-surface-border px-6 py-4 flex items-center gap-4 flex-shrink-0">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden text-text-secondary hover:text-gold transition-colors">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="flex-1">
            <p className="font-body text-text-secondary text-xs tracking-widest uppercase">
              {navItems.find(n => isActive(n.path, n.exact))?.label || 'Admin'}
            </p>
          </div>
          <Link to="/" className="font-body text-text-disabled text-xs hover:text-gold transition-colors">
            View Store →
          </Link>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Routes>
            <Route index element={<AdminOverview />} />
            <Route path="products/*" element={<AdminProducts />} />
            <Route path="orders/*" element={<AdminOrders />} />
            <Route path="customers" element={<AdminCustomers />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default AdminDashboard