import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ShoppingBag, User, Search, Menu, X } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { useCartStore } from '../../store/cartStore'
import { gsap } from 'gsap'

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const navRef = useRef(null)
  const mobileMenuRef = useRef(null)
  const location = useLocation()
  const { user, accessToken, logout } = useAuthStore()
  const { items, toggleCart } = useCartStore()

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0)

  const navLinks = [
  { label: 'Shop',         path: '/shop' },
  { label: 'Collections',  path: '/shop?category=all' },
  { label: 'About',        path: '/about' }
]

  // Scroll listener — transparent → solid
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileOpen(false)
    setIsSearchOpen(false)
  }, [location])

  // GSAP entrance animation
  useEffect(() => {
    gsap.fromTo(navRef.current,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.2 }
    )
  }, [])

  // GSAP mobile menu animation
  useEffect(() => {
    if (!mobileMenuRef.current) return
    if (isMobileOpen) {
      gsap.fromTo(mobileMenuRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
      )
    }
  }, [isMobileOpen])

  const handleLogout = async () => {
    logout()
  }

  const isHomePage = location.pathname === '/'

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500
          ${isScrolled || !isHomePage
            ? 'bg-primary border-b border-surface-border shadow-dark'
            : 'bg-transparent'
          }`}
      >
        {/* Top announcement bar */}
        <div className="bg-gold text-primary py-2 text-xs tracking-[0.2em] uppercase font-body font-medium overflow-hidden">
            <div className="whitespace-nowrap px-4 text-center">
                Handcrafted Premium Leather Bag &nbsp;|&nbsp; Complimentary shipping above ₹2000 &nbsp;&nbsp;|&nbsp;&nbsp; 7-Day Easy Returns
          </div>
        </div>

        {/* Main navbar */}
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-18 py-4">

            {/* LEFT — Mobile menu + Desktop nav */}
            <div className="flex items-center gap-8">
              {/* Mobile hamburger */}
              <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="lg:hidden text-text-primary hover:text-gold transition-colors"
              >
                {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>

              {/* Desktop nav links */}
              <ul className="hidden lg:flex items-center gap-8">
                {navLinks.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className={`nav-link ${
                        location.pathname === link.path ? 'text-gold after:w-full' : ''
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* CENTER — Logo */}
            <Link
              to="/"
              className="absolute left-1/2 -translate-x-1/2 font-display text-2xl lg:text-3xl text-text-primary tracking-[0.15em] hover:text-gold transition-colors duration-300"
            >
              SCATCH
            </Link>

            {/* RIGHT — Icons */}
            <div className="flex items-center gap-5">

              {/* Search */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="text-text-secondary hover:text-gold transition-colors duration-200"
              >
                <Search size={18} />
              </button>

              {/* Cart */}
              <button
                onClick={toggleCart}
                className="relative text-text-secondary hover:text-gold transition-colors duration-200"
              >
                <ShoppingBag size={18} />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gold text-primary text-xs w-4 h-4 rounded-full flex items-center justify-center font-body font-medium">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Profile / Auth */}
              {accessToken ? (
  <>
    <div className="relative group">
      <button className="text-text-secondary hover:text-gold transition-colors duration-200">
        <User size={18} />
      </button>
      {/* Dropdown */}
      <div className="absolute right-0 top-8 w-48 bg-surface border border-surface-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 shadow-dark z-50">
        <div className="p-3 border-b border-surface-border">
          <p className="text-text-primary text-sm font-medium truncate">{user?.name}</p>
          <p className="text-text-secondary text-xs truncate">{user?.email}</p>
          <span className="text-xs font-mono text-gold capitalize">{user?.role}</span>
        </div>
        <Link to="/dashboard" className="block px-4 py-2.5 text-text-secondary hover:text-gold hover:bg-surface-raised text-sm transition-colors">
          My Orders
        </Link>
        <Link to="/dashboard/profile" className="block px-4 py-2.5 text-text-secondary hover:text-gold hover:bg-surface-raised text-sm transition-colors">
          Profile
        </Link>
        {user?.role === 'admin' && (
          <Link to="/admin" className="block px-4 py-2.5 text-gold hover:bg-surface-raised text-sm transition-colors border-t border-surface-border">
            ⚡ Admin Panel
          </Link>
        )}
        <button
          onClick={handleLogout}
          className="w-full text-left px-4 py-2.5 text-status-error hover:bg-surface-raised text-sm transition-colors border-t border-surface-border"
        >
          Logout
        </button>
      </div>
    </div>
  </>
) : (
  <Link
    to="/login"
    className="text-text-secondary hover:text-gold transition-colors duration-200"
  >
    <User size={18} />
  </Link>
)}
            </div>
          </div>
        </div>

        {/* Search Bar — slides down */}
        <div className={`overflow-hidden transition-all duration-300 ${isSearchOpen ? 'max-h-20' : 'max-h-0'}`}>
          <div className="bg-surface border-t border-surface-border px-6 py-4">
            <div className="max-w-2xl mx-auto relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-disabled" />
              <input
                type="text"
                placeholder="Search for bags, wallets, accessories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    window.location.href = `/shop?search=${searchQuery}`
                  }
                }}
                className="input-field pl-10"
                autoFocus={isSearchOpen}
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileOpen && (
        <div
          ref={mobileMenuRef}
          className="fixed inset-0 z-40 bg-primary pt-32 px-8 lg:hidden"
        >
          <ul className="flex flex-col gap-6">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className="font-display text-3xl text-text-primary hover:text-gold transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="border-t border-surface-border pt-6 mt-2">
              {accessToken ? (
                <div className="flex flex-col gap-4">
                  <Link to="/dashboard" className="nav-link">My Orders</Link>
                  <button onClick={handleLogout} className="nav-link text-left text-status-error">
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <Link to="/login" className="nav-link">Login</Link>
                  <Link to="/register" className="nav-link">Register</Link>
                </div>
              )}
            </li>
          </ul>
        </div>
      )}
    </>
  )
}

export default Navbar