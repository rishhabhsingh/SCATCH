import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Minus, Plus, X, ShoppingBag, ArrowRight, Tag } from 'lucide-react'
import { cartService } from '../services/cart.service'
import { useCartStore } from '../store/cartStore'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'

const Cart = () => {
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(null)
  const { items, setItems, updateQuantity, removeItem, clearCart, getTotalAmount, getTotalItems } = useCartStore()
  const { accessToken } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (!accessToken) {
      navigate('/login')
      return
    }
    const fetchCart = async () => {
      try {
        const res = await cartService.getCart()
        if (res.data.data.items) {
          setItems(res.data.data.items)
        }
      } catch {
        toast.error('Failed to load cart')
      } finally {
        setLoading(false)
      }
    }
    fetchCart()
  }, [accessToken])

  const handleQuantityChange = async (productId, newQty) => {
    setUpdating(productId)
    try {
      await cartService.updateItem(productId, newQty)
      updateQuantity(productId, newQty)
    } catch {
      toast.error('Failed to update quantity')
    } finally {
      setUpdating(null)
    }
  }

  const handleRemove = async (productId) => {
    try {
      await cartService.removeItem(productId)
      removeItem(productId)
      toast.success('Item removed')
    } catch {
      toast.error('Failed to remove item')
    }
  }

  const subtotal = getTotalAmount()
  const shipping = subtotal >= 2000 ? 0 : 199
  const total = subtotal + shipping

  if (loading) {
    return (
      <div className="bg-primary min-h-screen pt-24 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-4">
              {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-32 rounded" />)}
            </div>
            <div className="skeleton h-64 rounded" />
          </div>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="bg-primary min-h-screen pt-24 flex items-center justify-center px-6">
        <div className="text-center">
          <ShoppingBag size={64} className="text-text-disabled mx-auto mb-6" />
          <h2 className="font-display text-3xl text-text-primary mb-3">Your cart is empty</h2>
          <p className="font-body text-text-secondary mb-8">
            Looks like you haven't added anything yet
          </p>
          <Link to="/shop" className="btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-primary min-h-screen pt-20">

      {/* Header */}
      <div className="border-b border-surface-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10">
          <p className="section-label mb-2">Review</p>
          <h1 className="font-display text-display-m text-text-primary">
            Your Cart ({getTotalItems()})
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-px bg-surface-border border border-surface-border">
            {items.map((item) => {
              const product = item.product
              const price = product.discountPrice || product.price
              return (
                <div key={product._id} className="bg-primary p-6 flex gap-5">

                  {/* Image */}
                  <Link to={`/shop/${product._id}`} className="flex-shrink-0">
                    <div className="w-24 h-24 bg-surface overflow-hidden">
                      {product.images?.[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag size={24} className="text-text-disabled" />
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="section-label text-[10px] mb-1 capitalize">{product.category}</p>
                        <Link
                          to={`/shop/${product._id}`}
                          className="font-body text-text-primary font-medium text-sm hover:text-gold transition-colors line-clamp-1"
                        >
                          {product.name}
                        </Link>
                        <p className="font-mono text-gold text-sm mt-1">
                          ₹{price.toLocaleString('en-IN')}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemove(product._id)}
                        className="text-text-disabled hover:text-status-error transition-colors flex-shrink-0"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    {/* Qty + Item total */}
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center border border-surface-border">
                        <button
                          onClick={() => handleQuantityChange(product._id, item.quantity - 1)}
                          disabled={updating === product._id || item.quantity <= 1}
                          className="w-8 h-8 flex items-center justify-center text-text-secondary hover:text-gold transition-colors disabled:opacity-30"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-10 h-8 flex items-center justify-center font-mono text-text-primary text-xs border-x border-surface-border">
                          {updating === product._id ? '...' : item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(product._id, item.quantity + 1)}
                          disabled={updating === product._id || item.quantity >= product.stock}
                          className="w-8 h-8 flex items-center justify-center text-text-secondary hover:text-gold transition-colors disabled:opacity-30"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <p className="font-mono text-text-primary text-sm font-medium">
                        ₹{(price * item.quantity).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Order Summary */}
          <div className="h-fit bg-surface border border-surface-border p-8">
            <h3 className="font-body text-text-primary font-medium text-sm tracking-widest uppercase mb-8">
              Order Summary
            </h3>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="font-body text-text-secondary text-sm">
                  Subtotal ({getTotalItems()} items)
                </span>
                <span className="font-mono text-text-primary text-sm">
                  ₹{subtotal.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-body text-text-secondary text-sm">Shipping</span>
                <span className="font-mono text-sm">
                  {shipping === 0
                    ? <span className="text-status-success">Free</span>
                    : <span className="text-text-primary">₹{shipping}</span>
                  }
                </span>
              </div>
              {shipping > 0 && (
                <p className="font-body text-text-disabled text-xs">
                  Add ₹{(2000 - subtotal).toLocaleString('en-IN')} more for free shipping
                </p>
              )}
            </div>

            <div className="border-t border-surface-border pt-4 mb-8">
              <div className="flex justify-between items-center">
                <span className="font-body text-text-primary font-medium">Total</span>
                <span className="font-mono text-gold text-xl font-medium">
                  ₹{total.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <Link
              to="/checkout"
              className="btn-primary w-full flex items-center justify-center gap-2 mb-4"
            >
              Proceed to Checkout <ArrowRight size={16} />
            </Link>

            <Link
              to="/shop"
              className="btn-ghost w-full flex items-center justify-center text-center"
            >
              Continue Shopping
            </Link>

            {/* Trust badges */}
            <div className="mt-8 pt-6 border-t border-surface-border space-y-2">
              {[
                '🔒 Secure SSL checkout',
                '↩ 7-day easy returns',
                '🚚 Free shipping above ₹2000',
              ].map(item => (
                <p key={item} className="font-body text-text-disabled text-xs">{item}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart