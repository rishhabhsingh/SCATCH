import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  TrendingUp, ShoppingBag, Package,
  Users, ArrowUp, ArrowDown
} from 'lucide-react'
import api from '../../services/axios'
import { orderService } from '../../services/order.service'
import { productService } from '../../services/product.service'

const StatCard = ({ icon: Icon, label, value, sub, positive }) => (
  <div className="bg-surface border border-surface-border p-6 group hover:border-gold transition-colors duration-300">
    <div className="flex items-start justify-between mb-4">
      <div className="w-10 h-10 bg-gold/10 flex items-center justify-center">
        <Icon size={18} className="text-gold" />
      </div>
      {sub !== undefined && (
        <div className={`flex items-center gap-1 text-xs font-mono ${positive ? 'text-status-success' : 'text-status-error'}`}>
          {positive ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
          {sub}
        </div>
      )}
    </div>
    <p className="font-mono text-gold text-3xl font-medium mb-1">{value}</p>
    <p className="font-body text-text-secondary text-xs tracking-wider uppercase">{label}</p>
  </div>
)

const AdminOverview = () => {
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [ordersRes, productsRes] = await Promise.all([
          orderService.getAllOrders(),
          productService.getAll({ limit: 100 }),
        ])
        setOrders(ordersRes.data.data)
        setProducts(productsRes.data.data.products)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  const totalRevenue = orders
    .filter(o => o.paymentInfo?.status === 'paid')
    .reduce((acc, o) => acc + o.totalAmount, 0)

  const pendingOrders = orders.filter(o => o.status === 'pending').length
  const lowStock = products.filter(p => p.stock <= 3).length

  const stats = [
    {
      icon: TrendingUp,
      label: 'Total Revenue',
      value: `₹${totalRevenue.toLocaleString('en-IN')}`,
      positive: true,
    },
    {
      icon: ShoppingBag,
      label: 'Total Orders',
      value: orders.length,
      sub: `${pendingOrders} pending`,
      positive: pendingOrders === 0,
    },
    {
      icon: Package,
      label: 'Total Products',
      value: products.length,
      sub: `${lowStock} low stock`,
      positive: lowStock === 0,
    },
  ]

  const recentOrders = orders.slice(0, 5)

  const statusColors = {
    pending: 'text-status-warning bg-status-warning/10',
    confirmed: 'text-status-info bg-status-info/10',
    shipped: 'text-blue-400 bg-blue-400/10',
    delivered: 'text-status-success bg-status-success/10',
    cancelled: 'text-status-error bg-status-error/10',
  }

  if (loading) return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-32 rounded" />)}
      </div>
      <div className="skeleton h-64 rounded" />
    </div>
  )

  return (
    <div className="space-y-8">

      <div>
        <p className="section-label mb-1">Dashboard</p>
        <h1 className="font-display text-3xl text-text-primary">Overview</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Low stock warning */}
      {lowStock > 0 && (
        <div className="bg-status-warning/10 border border-status-warning/30 p-4 flex items-center gap-3">
          <Package size={16} className="text-status-warning flex-shrink-0" />
          <p className="font-body text-status-warning text-sm">
            {lowStock} product{lowStock > 1 ? 's are' : ' is'} low on stock.{' '}
            <Link to="/admin/products" className="underline">Manage products →</Link>
          </p>
        </div>
      )}

      {/* Recent Orders */}
      <div className="bg-surface border border-surface-border">
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-border">
          <h2 className="font-body text-text-primary font-medium text-sm tracking-widest uppercase">
            Recent Orders
          </h2>
          <Link to="/admin/orders" className="text-gold text-xs font-body hover:underline">
            View All →
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="py-16 text-center">
            <ShoppingBag size={40} className="text-text-disabled mx-auto mb-3" />
            <p className="font-body text-text-secondary text-sm">No orders yet</p>
          </div>
        ) : (
          <div className="divide-y divide-surface-border">
            {recentOrders.map(order => (
              <div key={order._id} className="px-6 py-4 flex items-center gap-4 hover:bg-primary/30 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-text-primary text-sm">
                      #{order._id.slice(-8).toUpperCase()}
                    </span>
                    <span className={`px-2 py-0.5 text-xs font-body rounded ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="font-body text-text-secondary text-xs">
                    {order.user?.name} · {order.items?.length} items ·{' '}
                    {new Date(order.createdAt).toLocaleDateString('en-IN')}
                  </p>
                </div>
                <p className="font-mono text-gold text-sm font-medium flex-shrink-0">
                  ₹{order.totalAmount?.toLocaleString('en-IN')}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Low stock products */}
      {lowStock > 0 && (
        <div className="bg-surface border border-surface-border">
          <div className="flex items-center justify-between px-6 py-4 border-b border-surface-border">
            <h2 className="font-body text-text-primary font-medium text-sm tracking-widest uppercase">
              Low Stock Alert
            </h2>
            <Link to="/admin/products" className="text-gold text-xs font-body hover:underline">
              Manage →
            </Link>
          </div>
          <div className="divide-y divide-surface-border">
            {products.filter(p => p.stock <= 3).map(p => (
              <div key={p._id} className="px-6 py-4 flex items-center gap-4">
                <div className="w-10 h-10 bg-primary border border-surface-border overflow-hidden flex-shrink-0">
                  {p.images?.[0]
                    ? <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                    : <Package size={16} className="text-text-disabled m-auto mt-2" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body text-text-primary text-sm truncate">{p.name}</p>
                  <p className="font-body text-text-disabled text-xs capitalize">{p.category}</p>
                </div>
                <span className={`font-mono text-sm font-medium ${p.stock === 0 ? 'text-status-error' : 'text-status-warning'}`}>
                  {p.stock === 0 ? 'Out of stock' : `${p.stock} left`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminOverview