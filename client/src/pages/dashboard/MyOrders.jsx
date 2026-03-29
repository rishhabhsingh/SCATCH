import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingBag, ChevronDown, ChevronUp, Package, Truck, CheckCircle, XCircle, Clock } from 'lucide-react'
import { orderService } from '../../services/order.service'
import toast from 'react-hot-toast'

const statusConfig = {
  pending: { label: 'Pending', color: 'text-status-warning', bg: 'bg-status-warning/10', icon: Clock },
  confirmed: { label: 'Confirmed', color: 'text-status-info', bg: 'bg-status-info/10', icon: Package },
  shipped: { label: 'Shipped', color: 'text-blue-400', bg: 'bg-blue-400/10', icon: Truck },
  delivered: { label: 'Delivered', color: 'text-status-success', bg: 'bg-status-success/10', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'text-status-error', bg: 'bg-status-error/10', icon: XCircle },
}

const StatusTimeline = ({ status }) => {
  const steps = ['pending', 'confirmed', 'shipped', 'delivered']
  const currentIndex = steps.indexOf(status)
  if (status === 'cancelled') return (
    <div className="flex items-center gap-2 text-status-error">
      <XCircle size={16} />
      <span className="font-body text-sm">Order Cancelled</span>
    </div>
  )

  return (
    <div className="flex items-center gap-0 mt-4">
      {steps.map((step, i) => {
        const done = i <= currentIndex
        const active = i === currentIndex
        return (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            <div className={`flex flex-col items-center gap-1`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono border transition-all
                ${done ? 'bg-gold border-gold text-primary' : 'border-surface-border text-text-disabled'}`}>
                {done ? '✓' : i + 1}
              </div>
              <span className={`font-body text-xs capitalize whitespace-nowrap
                ${active ? 'text-gold' : done ? 'text-text-secondary' : 'text-text-disabled'}`}>
                {step}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-px mx-1 mb-4 ${i < currentIndex ? 'bg-gold' : 'bg-surface-border'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

const OrderCard = ({ order }) => {
  const [expanded, setExpanded] = useState(false)
  const status = statusConfig[order.status] || statusConfig.pending
  const StatusIcon = status.icon

  return (
    <div className="bg-surface border border-surface-border overflow-hidden">

      {/* Order Header */}
      <div
        className="p-6 cursor-pointer hover:bg-primary/50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">

            {/* Order ID + Date */}
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <span className="font-mono text-text-disabled text-xs">
                #{order._id.slice(-8).toUpperCase()}
              </span>
              <span className="text-surface-border">·</span>
              <span className="font-body text-text-disabled text-xs">
                {new Date(order.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric', month: 'long', year: 'numeric'
                })}
              </span>
            </div>

            {/* Product thumbnails */}
            <div className="flex items-center gap-2 mb-3">
              {order.items.slice(0, 3).map((item, i) => (
                <div key={i} className="w-12 h-12 bg-primary border border-surface-border overflow-hidden flex-shrink-0">
                  {item.product?.images?.[0] ? (
                    <img src={item.product.images[0]} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingBag size={14} className="text-text-disabled" />
                    </div>
                  )}
                </div>
              ))}
              {order.items.length > 3 && (
                <div className="w-12 h-12 bg-surface border border-surface-border flex items-center justify-center">
                  <span className="font-mono text-text-disabled text-xs">+{order.items.length - 3}</span>
                </div>
              )}
              <div className="ml-2">
                <p className="font-body text-text-primary text-sm">
                  {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                </p>
                <p className="font-mono text-gold text-sm font-medium">
                  ₹{order.totalAmount.toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-3">
            {/* Status badge */}
            <div className={`flex items-center gap-1.5 px-3 py-1.5 ${status.bg}`}>
              <StatusIcon size={12} className={status.color} />
              <span className={`font-body text-xs font-medium ${status.color}`}>
                {status.label}
              </span>
            </div>
            {/* Expand icon */}
            {expanded
              ? <ChevronUp size={16} className="text-text-disabled" />
              : <ChevronDown size={16} className="text-text-disabled" />
            }
          </div>
        </div>

        {/* Timeline */}
        <StatusTimeline status={order.status} />
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="border-t border-surface-border">

          {/* Items list */}
          <div className="divide-y divide-surface-border">
            {order.items.map((item, i) => {
              const product = item.product
              return (
                <div key={i} className="p-5 flex gap-4">
                  <div className="w-16 h-16 bg-primary border border-surface-border overflow-hidden flex-shrink-0">
                    {product?.images?.[0] ? (
                      <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag size={16} className="text-text-disabled" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-text-primary text-sm font-medium line-clamp-1">
                      {product?.name || 'Product unavailable'}
                    </p>
                    <p className="font-body text-text-secondary text-xs mt-1 capitalize">
                      {product?.category}
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="font-mono text-gold text-sm">
                        ₹{item.price.toLocaleString('en-IN')}
                      </span>
                      <span className="font-body text-text-disabled text-xs">
                        Qty: {item.quantity}
                      </span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-mono text-text-primary text-sm">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Order summary + address */}
          <div className="p-5 bg-primary/30 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="section-label mb-3">Shipping Address</h4>
              <p className="font-body text-text-secondary text-sm leading-relaxed">
                {order.shippingAddress?.street}<br />
                {order.shippingAddress?.city}, {order.shippingAddress?.state}<br />
                {order.shippingAddress?.pincode}
              </p>
            </div>
            <div>
              <h4 className="section-label mb-3">Payment Summary</h4>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="font-body text-text-secondary text-xs">Subtotal</span>
                  <span className="font-mono text-text-primary text-xs">₹{order.totalAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-body text-text-secondary text-xs">Payment</span>
                  <span className={`font-mono text-xs ${order.paymentInfo?.status === 'paid' ? 'text-status-success' : 'text-status-warning'}`}>
                    {order.paymentInfo?.status?.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-surface-border">
                  <span className="font-body text-text-primary text-xs font-medium">Total</span>
                  <span className="font-mono text-gold text-sm font-medium">
                    ₹{order.totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const MyOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await orderService.getMyOrders()
        setOrders(res.data.data)
      } catch {
        toast.error('Failed to load orders')
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  const filtered = filter === 'all'
    ? orders
    : orders.filter(o => o.status === filter)

  const tabs = ['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled']

  if (loading) return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="skeleton h-36 rounded" />
      ))}
    </div>
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-body text-text-primary font-medium text-sm tracking-widest uppercase">
          My Orders ({orders.length})
        </h2>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 overflow-x-auto pb-2 mb-6">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 font-body text-xs tracking-wider uppercase whitespace-nowrap transition-all border
              ${filter === tab
                ? 'bg-gold text-primary border-gold'
                : 'border-surface-border text-text-secondary hover:text-gold hover:border-gold'
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Orders */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 border border-surface-border">
          <ShoppingBag size={48} className="text-text-disabled mx-auto mb-4" />
          <p className="font-display text-2xl text-text-secondary mb-2">
            {filter === 'all' ? 'No orders yet' : `No ${filter} orders`}
          </p>
          <p className="font-body text-text-disabled text-sm mb-8">
            {filter === 'all' ? 'Start shopping to see your orders here' : 'Try a different filter'}
          </p>
          {filter === 'all' && (
            <Link to="/shop" className="btn-primary">
              Shop Now
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(order => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>
      )}
    </div>
  )
}

export default MyOrders