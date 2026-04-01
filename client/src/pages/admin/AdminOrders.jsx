import { useState, useEffect } from 'react'
import { Package, Truck, CheckCircle, XCircle, Clock, ChevronDown, ChevronUp } from 'lucide-react'
import { orderService } from '../../services/order.service'
import toast from 'react-hot-toast'

const statusConfig = {
  pending: { color: 'text-status-warning', bg: 'bg-status-warning/10', icon: Clock },
  confirmed: { color: 'text-status-info', bg: 'bg-status-info/10', icon: Package },
  shipped: { color: 'text-blue-400', bg: 'bg-blue-400/10', icon: Truck },
  delivered: { color: 'text-status-success', bg: 'bg-status-success/10', icon: CheckCircle },
  cancelled: { color: 'text-status-error', bg: 'bg-status-error/10', icon: XCircle },
}

const STATUS_OPTIONS = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']

const OrderRow = ({ order, onStatusUpdate }) => {
  const [expanded, setExpanded] = useState(false)
  const [updating, setUpdating] = useState(false)
  const status = statusConfig[order.status] || statusConfig.pending
  const StatusIcon = status.icon

  const handleStatusChange = async (newStatus) => {
    setUpdating(true)
    try {
      await orderService.updateStatus(order._id, newStatus)
      onStatusUpdate(order._id, newStatus)
      toast.success(`Order marked as ${newStatus}`)
    } catch {
      toast.error('Failed to update status')
    } finally {
      setUpdating(false)
    }
  }

  return (
    <div className="border-b border-surface-border last:border-0">

      {/* Main row */}
      <div
        className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-primary/20 transition-colors cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        {/* Order ID */}
        <div className="col-span-2">
          <p className="font-mono text-text-primary text-xs">
            #{order._id.slice(-8).toUpperCase()}
          </p>
          <p className="font-body text-text-disabled text-xs mt-0.5">
            {new Date(order.createdAt).toLocaleDateString('en-IN')}
          </p>
        </div>

        {/* Customer */}
        <div className="col-span-3 min-w-0">
          <p className="font-body text-text-primary text-sm truncate">{order.user?.name}</p>
          <p className="font-body text-text-disabled text-xs truncate">{order.user?.email}</p>
        </div>

        {/* Items */}
        <div className="col-span-2">
          <p className="font-body text-text-secondary text-sm">{order.items?.length} items</p>
        </div>

        {/* Amount */}
        <div className="col-span-2">
          <p className="font-mono text-gold text-sm font-medium">
            ₹{order.totalAmount?.toLocaleString('en-IN')}
          </p>
        </div>

        {/* Status */}
        <div className="col-span-2" onClick={e => e.stopPropagation()}>
          <select
            value={order.status}
            onChange={e => handleStatusChange(e.target.value)}
            disabled={updating}
            className={`font-body text-xs px-2 py-1.5 border border-surface-border bg-surface cursor-pointer
              focus:outline-none focus:border-gold transition-colors disabled:opacity-50 ${status.color}`}
          >
            {STATUS_OPTIONS.map(s => (
              <option key={s} value={s} className="text-text-primary bg-surface capitalize">{s}</option>
            ))}
          </select>
        </div>

        {/* Expand */}
        <div className="col-span-1 flex justify-end">
          {expanded ? <ChevronUp size={16} className="text-text-disabled" /> : <ChevronDown size={16} className="text-text-disabled" />}
        </div>
      </div>

      {/* Expanded */}
      {expanded && (
        <div className="bg-primary/20 px-6 pb-5 border-t border-surface-border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">

            {/* Items */}
            <div>
              <h4 className="section-label mb-3">Order Items</h4>
              <div className="space-y-2">
                {order.items?.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-surface border border-surface-border overflow-hidden flex-shrink-0">
                      {item.product?.images?.[0]
                        ? <img src={item.product.images[0]} alt="" className="w-full h-full object-cover" />
                        : <Package size={12} className="text-text-disabled m-auto mt-2" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-text-primary text-xs truncate">{item.product?.name}</p>
                      <p className="font-mono text-text-secondary text-xs">
                        ₹{item.price?.toLocaleString('en-IN')} × {item.quantity}
                      </p>
                    </div>
                    <p className="font-mono text-gold text-xs">
                      ₹{(item.price * item.quantity)?.toLocaleString('en-IN')}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Address + Payment */}
            <div className="space-y-4">
              <div>
                <h4 className="section-label mb-2">Shipping Address</h4>
                <p className="font-body text-text-secondary text-xs leading-relaxed">
                  {order.shippingAddress?.street}<br />
                  {order.shippingAddress?.city}, {order.shippingAddress?.state} — {order.shippingAddress?.pincode}
                </p>
              </div>
              <div>
                <h4 className="section-label mb-2">Payment</h4>
                <div className="flex items-center gap-2">
                  <span className={`font-mono text-xs px-2 py-1 ${
                    order.paymentInfo?.status === 'paid'
                      ? 'bg-status-success/10 text-status-success'
                      : 'bg-status-warning/10 text-status-warning'
                  }`}>
                    {order.paymentInfo?.status?.toUpperCase()}
                  </span>
                  <span className="font-mono text-gold text-sm font-medium">
                    ₹{order.totalAmount?.toLocaleString('en-IN')}
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

const AdminOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await orderService.getAllOrders()
        setOrders(res.data.data)
      } catch {
        toast.error('Failed to load orders')
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  const handleStatusUpdate = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o))
  }

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter)
  const tabs = ['all', ...STATUS_OPTIONS]

  return (
    <div>
      <div className="mb-6">
        <p className="section-label mb-1">Manage</p>
        <h1 className="font-display text-3xl text-text-primary">Orders</h1>
      </div>

      {/* Tabs */}
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
            {tab} {tab !== 'all' && `(${orders.filter(o => o.status === tab).length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => <div key={i} className="skeleton h-16 rounded" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 border border-surface-border">
          <Package size={48} className="text-text-disabled mx-auto mb-4" />
          <p className="font-body text-text-secondary">No orders found</p>
        </div>
      ) : (
        <div className="bg-surface border border-surface-border">
          {/* Table header */}
          <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-surface-border bg-primary/30">
            {[
              { label: 'Order ID', span: 2 },
              { label: 'Customer', span: 3 },
              { label: 'Items', span: 2 },
              { label: 'Amount', span: 2 },
              { label: 'Status', span: 2 },
              { label: '', span: 1 },
            ].map(h => (
              <div key={h.label} className={`section-label text-[10px] col-span-${h.span}`}>
                {h.label}
              </div>
            ))}
          </div>

          {filtered.map(order => (
            <OrderRow key={order._id} order={order} onStatusUpdate={handleStatusUpdate} />
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminOrders