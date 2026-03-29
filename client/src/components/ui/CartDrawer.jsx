import { useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { X, ShoppingBag, Minus, Plus, Trash2 } from 'lucide-react'
import { gsap } from 'gsap'
import { useCartStore } from '../../store/cartStore'
import { cartService } from '../../services/cart.service'
import { useAuthStore } from '../../store/authStore'
import toast from 'react-hot-toast'

const CartDrawer = () => {
  const { items, isOpen, toggleCart, updateQuantity, removeItem, getTotalAmount, getTotalItems, setItems } = useCartStore()
  const { accessToken } = useAuthStore()
  const navigate = useNavigate()
  const drawerRef = useRef(null)
  const overlayRef = useRef(null)

  // Fetch cart from API when drawer opens
  useEffect(() => {
    if (isOpen && accessToken) {
      cartService.getCart().then(res => {
        if (res.data.data.items) setItems(res.data.data.items)
      }).catch(() => {})
    }
  }, [isOpen, accessToken])

  // GSAP open/close animation
  useEffect(() => {
    if (!drawerRef.current || !overlayRef.current) return

    if (isOpen) {
      // Prevent body scroll
      document.body.style.overflow = 'hidden'

      gsap.to(overlayRef.current, {
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out',
        pointerEvents: 'auto',
      })
      gsap.fromTo(drawerRef.current,
        { x: '100%' },
        { x: '0%', duration: 0.4, ease: 'power3.out' }
      )
    } else {
      document.body.style.overflow = ''

      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        pointerEvents: 'none',
      })
      gsap.to(drawerRef.current, {
        x: '100%',
        duration: 0.35,
        ease: 'power3.in',
      })
    }
  }, [isOpen])

  const handleQuantityChange = async (productId, newQty) => {
    try {
      await cartService.updateItem(productId, newQty)
      updateQuantity(productId, newQty)
    } catch {
      toast.error('Failed to update')
    }
  }

  const handleRemove = async (productId) => {
    try {
      await cartService.removeItem(productId)
      removeItem(productId)
      toast.success('Item removed')
    } catch {
      toast.error('Failed to remove')
    }
  }

  const handleCheckout = () => {
    toggleCart()
    if (!accessToken) {
      navigate('/login')
      return
    }
    navigate('/checkout')
  }

  const subtotal = getTotalAmount()
  const shipping = subtotal >= 2000 ? 0 : 199

  return (
    <>
      {/* Overlay */}
      <div
        ref={overlayRef}
        onClick={toggleCart}
        className="fixed inset-0 bg-primary/80 backdrop-blur-sm z-50 opacity-0 pointer-events-none"
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className="fixed top-0 right-0 h-full w-full max-w-md bg-primary border-l border-surface-border z-50 flex flex-col"
        style={{ transform: 'translateX(100%)' }}
      >

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-surface-border flex-shrink-0">
          <div className="flex items-center gap-3">
            <ShoppingBag size={18} className="text-gold" />
            <h2 className="font-body text-text-primary font-medium text-sm tracking-widest uppercase">
              Your Cart
            </h2>
            {getTotalItems() > 0 && (
              <span className="bg-gold text-primary text-xs font-mono w-5 h-5 rounded-full flex items-center justify-center">
                {getTotalItems()}
              </span>
            )}
          </div>
          <button
            onClick={toggleCart}
            className="w-8 h-8 flex items-center justify-center text-text-secondary hover:text-gold transition-colors border border-surface-border hover:border-gold"
          >
            <X size={16} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center px-6 text-center">
              <ShoppingBag size={48} className="text-text-disabled mb-4" />
              <p className="font-display text-2xl text-text-secondary mb-2">
                Your cart is empty
              </p>
              <p className="font-body text-text-disabled text-sm mb-8">
                Discover our handcrafted collection
              </p>
              <button onClick={toggleCart} className="btn-secondary text-sm">
                <Link to="/shop">Browse Collection</Link>
              </button>
            </div>
          ) : (
            <div className="divide-y divide-surface-border">
              {items.map((item) => {
                const product = item.product
                const price = product.discountPrice || product.price
                return (
                  <div key={product._id} className="p-6 flex gap-4 group">

                    {/* Image */}
                    <Link
                      to={`/shop/${product._id}`}
                      onClick={toggleCart}
                      className="flex-shrink-0"
                    >
                      <div className="w-20 h-20 bg-surface overflow-hidden">
                        {product.images?.[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBag size={20} className="text-text-disabled" />
                          </div>
                        )}
                      </div>
                    </Link>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="section-label text-[9px] mb-1 capitalize">
                            {product.category}
                          </p>
                          <Link
                            to={`/shop/${product._id}`}
                            onClick={toggleCart}
                            className="font-body text-text-primary text-sm font-medium hover:text-gold transition-colors line-clamp-1 block"
                          >
                            {product.name}
                          </Link>
                          <p className="font-mono text-gold text-sm mt-1">
                            ₹{price.toLocaleString('en-IN')}
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemove(product._id)}
                          className="text-text-disabled hover:text-status-error transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      {/* Qty + Line total */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-surface-border">
                          <button
                            onClick={() => handleQuantityChange(product._id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="w-7 h-7 flex items-center justify-center text-text-secondary hover:text-gold transition-colors disabled:opacity-30"
                          >
                            <Minus size={10} />
                          </button>
                          <span className="w-8 h-7 flex items-center justify-center font-mono text-text-primary text-xs border-x border-surface-border">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(product._id, item.quantity + 1)}
                            disabled={item.quantity >= product.stock}
                            className="w-7 h-7 flex items-center justify-center text-text-secondary hover:text-gold transition-colors disabled:opacity-30"
                          >
                            <Plus size={10} />
                          </button>
                        </div>
                        <p className="font-mono text-text-primary text-sm">
                          ₹{(price * item.quantity).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer — only when items exist */}
        {items.length > 0 && (
          <div className="border-t border-surface-border p-6 flex-shrink-0 bg-surface">

            {/* Subtotal */}
            <div className="space-y-2 mb-5">
              <div className="flex justify-between">
                <span className="font-body text-text-secondary text-sm">Subtotal</span>
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
              <div className="flex justify-between pt-3 border-t border-surface-border">
                <span className="font-body text-text-primary font-medium text-sm">Total</span>
                <span className="font-mono text-gold font-medium text-lg">
                  ₹{(subtotal + shipping).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Buttons */}
            <button
              onClick={handleCheckout}
              className="btn-primary w-full flex items-center justify-center gap-2 mb-3"
            >
              Proceed to Checkout
            </button>

            <Link
              to="/cart"
              onClick={toggleCart}
              className="btn-secondary w-full flex items-center justify-center text-sm"
            >
              View Full Cart
            </Link>
          </div>
        )}
      </div>
    </>
  )
}

export default CartDrawer