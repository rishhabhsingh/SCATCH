import { useState, useEffect } from 'react'
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom'
import {
  ShoppingBag, User, MapPin, MessageCircle,
  LogOut, ChevronRight, Menu, X
} from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { authService } from '../../services/auth.service'
import toast from 'react-hot-toast'

// Sub pages
import MyOrders from './MyOrders'
import Profile from './Profile'
import ChatSupport from './ChatSupport'

const navItems = [
  { path: '/dashboard', label: 'My Orders', icon: ShoppingBag, exact: true },
  { path: '/dashboard/profile', label: 'Profile', icon: User },
  { path: '/dashboard/chat', label: 'AI Support', icon: MessageCircle },
]

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    try {
      await authService.logout()
    } catch {}
    logout()
    toast.success('Logged out successfully')
    navigate('/')
  }

  const isActive = (path, exact = false) => {
    if (exact) return location.pathname === path
    return location.pathname.startsWith(path)
  }

  return (
    <div className="bg-primary min-h-screen pt-20">

      {/* Page Header */}
      <div className="border-b border-surface-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8 flex items-center justify-between">
          <div>
            <p className="section-label mb-1">Account</p>
            <h1 className="font-display text-3xl text-text-primary">
              Welcome, {user?.name?.split(' ')[0]}
            </h1>
          </div>
          {/* Mobile sidebar toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden text-text-secondary hover:text-gold transition-colors"
          >
            {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8">
        <div className="flex gap-8">

          {/* Sidebar */}
          <aside className={`
            fixed lg:relative inset-0 z-30 bg-primary lg:bg-transparent
            w-72 lg:w-64 flex-shrink-0 pt-24 lg:pt-0
            transition-transform duration-300 lg:translate-x-0
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            border-r border-surface-border lg:border-none
          `}>
            <div className="p-6 lg:p-0">

              {/* User card */}
              <div className="bg-surface border border-surface-border p-5 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gold text-primary rounded-full flex items-center justify-center font-body font-medium text-lg flex-shrink-0">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-body text-text-primary font-medium text-sm truncate">
                      {user?.name}
                    </p>
                    <p className="font-body text-text-disabled text-xs truncate">
                      {user?.email}
                    </p>
                    <span className="inline-block mt-1 text-xs font-mono text-gold bg-gold/10 px-2 py-0.5 capitalize">
                      {user?.role}
                    </span>
                  </div>
                </div>
              </div>

              {/* Nav Links */}
              <nav className="space-y-1 mb-6">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const active = isActive(item.path, item.exact)
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 transition-all duration-200 border-l-2
                        ${active
                          ? 'border-gold text-gold bg-surface'
                          : 'border-transparent text-text-secondary hover:text-text-primary hover:bg-surface'
                        }`}
                    >
                      <Icon size={16} />
                      <span className="font-body text-sm">{item.label}</span>
                      {active && <ChevronRight size={14} className="ml-auto text-gold" />}
                    </Link>
                  )
                })}
              </nav>

              {/* Admin link */}
              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className="flex items-center gap-3 px-4 py-3 mb-1 text-gold hover:bg-surface transition-colors border-l-2 border-gold/30 hover:border-gold"
                >
                  <span className="font-body text-sm">Admin Panel</span>
                  <ChevronRight size={14} className="ml-auto" />
                </Link>
              )}

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-text-secondary hover:text-status-error hover:bg-surface transition-all duration-200 border-l-2 border-transparent hover:border-status-error"
              >
                <LogOut size={16} />
                <span className="font-body text-sm">Logout</span>
              </button>
            </div>
          </aside>

          {/* Mobile overlay */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 z-20 bg-primary/80 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <Routes>
              <Route index element={<MyOrders />} />
              <Route path="profile" element={<Profile />} />
              <Route path="chat" element={<ChatSupport />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard