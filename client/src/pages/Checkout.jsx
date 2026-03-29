import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CheckCircle, ShoppingBag } from 'lucide-react'
import { orderService } from '../services/order.service'
import { useCartStore } from '../store/cartStore'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'

const schema = z.object({
  street: z.string().min(5, 'Enter a valid street address'),
  city: z.string().min(2, 'Enter a valid city'),
  state: z.string().min(2, 'Enter a valid state'),
  pincode: z.string().length(6, 'Pincode must be 6 digits'),
})

// Steps
const STEPS = ['Address', 'Review', 'Payment']

const Checkout = () => {
  const [step, setStep] = useState(0)
  const [shippingAddress, setShippingAddress] = useState(null)
  const [placing, setPlacing] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderId, setOrderId] = useState(null)

  const { items, clearCart, getTotalAmount } = useCartStore()
  const { user } = useAuthStore()
  const navigate = useNavigate()

  const subtotal = getTotalAmount()
  const shipping = subtotal >= 2000 ? 0 : 199
  const total = subtotal + shipping

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    if (items.length === 0 && !orderPlaced) navigate('/cart')
  }, [items, orderPlaced])

  const onAddressSubmit = (data) => {
    setShippingAddress(data)
    setStep(1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handlePlaceOrder = async () => {
    setPlacing(true)
    try {
      const res = await orderService.placeOrder({ shippingAddress })
      setOrderId(res.data.data.order._id)
      clearCart()
      setOrderPlaced(true)
      setStep(2)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order')
    } finally {
      setPlacing(false)
    }
  }

  // ── Order Success ────────────────────────────────────────
  if (orderPlaced) {
    return (
      <div className="bg-primary min-h-screen pt-24 flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <CheckCircle size={64} className="text-gold mx-auto mb-6" />
          <h2 className="font-display text-4xl text-text-primary mb-3">
            Order Confirmed!
          </h2>
          <p className="font-body text-text-secondary mb-2">
            Thank you, {user?.name?.split(' ')[0]}. Your order has been placed.
          </p>
          {orderId && (
            <p className="font-mono text-text-disabled text-xs mb-8">
              Order ID: {orderId}
            </p>
          )}
          <div className="flex gap-4 justify-center">
            <Link to="/dashboard" className="btn-primary">
              Track Order
            </Link>
            <Link to="/shop" className="btn-secondary">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-primary min-h-screen pt-20">

      {/* Header */}
      <div className="border-b border-surface-border">
        <div className="max-w-4xl mx-auto px-6 py-10">
          <p className="section-label mb-2">Checkout</p>
          <h1 className="font-display text-display-m text-text-primary mb-8">
            Complete Your Order
          </h1>

          {/* Stepper */}
          <div className="flex items-center gap-0">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center">
                <div className={`flex items-center gap-2 ${i <= step ? 'text-gold' : 'text-text-disabled'}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-medium border
                    ${i < step ? 'bg-gold text-primary border-gold' :
                      i === step ? 'border-gold text-gold' :
                      'border-surface-border text-text-disabled'}`}>
                    {i < step ? '✓' : i + 1}
                  </div>
                  <span className="font-body text-sm tracking-wider uppercase hidden sm:block">{s}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`w-12 sm:w-24 h-px mx-3 ${i < step ? 'bg-gold' : 'bg-surface-border'}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Main Content */}
          <div className="lg:col-span-2">

            {/* STEP 0 — Address */}
            {step === 0 && (
              <div>
                <h2 className="font-body text-text-primary font-medium text-sm tracking-widest uppercase mb-8">
                  Shipping Address
                </h2>
                <form onSubmit={handleSubmit(onAddressSubmit)} className="space-y-5">
                  <div>
                    <label className="section-label block mb-2">Street Address</label>
                    <input {...register('street')} placeholder="House no, Street, Area" className="input-field" />
                    {errors.street && <p className="text-status-error text-xs mt-1 font-body">{errors.street.message}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="section-label block mb-2">City</label>
                      <input {...register('city')} placeholder="Mumbai" className="input-field" />
                      {errors.city && <p className="text-status-error text-xs mt-1 font-body">{errors.city.message}</p>}
                    </div>
                    <div>
                      <label className="section-label block mb-2">State</label>
                      <input {...register('state')} placeholder="Maharashtra" className="input-field" />
                      {errors.state && <p className="text-status-error text-xs mt-1 font-body">{errors.state.message}</p>}
                    </div>
                  </div>
                  <div>
                    <label className="section-label block mb-2">Pincode</label>
                    <input {...register('pincode')} placeholder="400001" maxLength={6} className="input-field" />
                    {errors.pincode && <p className="text-status-error text-xs mt-1 font-body">{errors.pincode.message}</p>}
                  </div>
                  <button type="submit" className="btn-primary w-full justify-center flex">
                    Continue to Review
                  </button>
                </form>
              </div>
            )}

            {/* STEP 1 — Review */}
            {step === 1 && (
              <div>
                <h2 className="font-body text-text-primary font-medium text-sm tracking-widest uppercase mb-8">
                  Review Your Order
                </h2>

                {/* Items */}
                <div className="space-y-px bg-surface-border border border-surface-border mb-8">
                  {items.map(item => {
                    const product = item.product
                    const price = product.discountPrice || product.price
                    return (
                      <div key={product._id} className="bg-primary p-5 flex gap-4">
                        <div className="w-16 h-16 bg-surface overflow-hidden flex-shrink-0">
                          {product.images?.[0] ? (
                            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ShoppingBag size={20} className="text-text-disabled" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-body text-text-primary text-sm font-medium line-clamp-1">{product.name}</p>
                          <p className="font-body text-text-secondary text-xs mt-1">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-mono text-gold text-sm flex-shrink-0">
                          ₹{(price * item.quantity).toLocaleString('en-IN')}
                        </p>
                      </div>
                    )
                  })}
                </div>

                {/* Address summary */}
                <div className="bg-surface border border-surface-border p-6 mb-8">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="section-label">Delivering to</h4>
                    <button onClick={() => setStep(0)} className="text-gold text-xs font-body hover:underline">
                      Edit
                    </button>
                  </div>
                  <p className="font-body text-text-secondary text-sm leading-relaxed">
                    {shippingAddress?.street}, {shippingAddress?.city},{' '}
                    {shippingAddress?.state} — {shippingAddress?.pincode}
                  </p>
                </div>

                <button onClick={() => setStep(2)} className="btn-primary w-full justify-center flex">
                  Continue to Payment
                </button>
              </div>
            )}

            {/* STEP 2 — Payment */}
            {step === 2 && (
              <div>
                <h2 className="font-body text-text-primary font-medium text-sm tracking-widest uppercase mb-8">
                  Payment
                </h2>

                <div className="bg-surface border border-surface-border p-8 mb-8 text-center">
                  <div className="w-16 h-16 bg-gold/10 border border-gold rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-gold text-2xl">₹</span>
                  </div>
                  <p className="font-mono text-gold text-3xl font-medium mb-2">
                    ₹{total.toLocaleString('en-IN')}
                  </p>
                  <p className="font-body text-text-secondary text-sm mb-8">
                    Total amount to be paid
                  </p>

                  <div className="bg-primary border border-surface-border p-4 mb-6 text-left">
                    <p className="section-label mb-2">Demo Payment Mode</p>
                    <p className="font-body text-text-secondary text-xs leading-relaxed">
                      This is a portfolio project. Clicking "Place Order" will simulate a successful payment and create your order instantly.
                    </p>
                  </div>

                  <button
                    onClick={handlePlaceOrder}
                    disabled={placing}
                    className="btn-primary w-full justify-center flex items-center gap-2 disabled:opacity-60"
                  >
                    {placing ? (
                      <span className="animate-pulse">Processing...</span>
                    ) : (
                      `Place Order — ₹${total.toLocaleString('en-IN')}`
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-4 mt-6">
                    {['🔒 SSL Secured', '✓ Encrypted', '🛡 Safe Checkout'].map(item => (
                      <p key={item} className="font-body text-text-disabled text-xs">{item}</p>
                    ))}
                  </div>
                </div>

                <button onClick={() => setStep(1)} className="btn-ghost text-sm">
                  ← Back to Review
                </button>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="h-fit bg-surface border border-surface-border p-6">
            <h3 className="section-label mb-6">Order Summary</h3>
            <div className="space-y-3 mb-4">
              {items.map(item => {
                const price = item.product.discountPrice || item.product.price
                return (
                  <div key={item.product._id} className="flex justify-between">
                    <span className="font-body text-text-secondary text-xs line-clamp-1 flex-1 mr-2">
                      {item.product.name} × {item.quantity}
                    </span>
                    <span className="font-mono text-text-primary text-xs flex-shrink-0">
                      ₹{(price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                )
              })}
            </div>
            <div className="border-t border-surface-border pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="font-body text-text-secondary text-xs">Subtotal</span>
                <span className="font-mono text-text-primary text-xs">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-body text-text-secondary text-xs">Shipping</span>
                <span className="font-mono text-xs">
                  {shipping === 0
                    ? <span className="text-status-success">Free</span>
                    : <span className="text-text-primary">₹{shipping}</span>
                  }
                </span>
              </div>
              <div className="border-t border-surface-border pt-3 flex justify-between">
                <span className="font-body text-text-primary text-sm font-medium">Total</span>
                <span className="font-mono text-gold font-medium">₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Checkout