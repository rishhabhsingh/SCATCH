import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  ShoppingBag, Heart, Star, ChevronLeft,
  ChevronRight, Minus, Plus, Share2,
  Shield, Truck, RotateCcw, Award
} from 'lucide-react'
import { productService } from '../services/product.service'
import { cartService } from '../services/cart.service'
import { useAuthStore } from '../store/authStore'
import { useCartStore } from '../store/cartStore'
import toast from 'react-hot-toast'
import { ProductDetailSkeleton } from '../components/ui/Skeleton'

gsap.registerPlugin(ScrollTrigger)

// ── Accordion ────────────────────────────────────────────────
const Accordion = ({ title, children }) => {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-t border-surface-border">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left"
      >
        <span className="font-body text-text-primary text-sm tracking-wider uppercase font-medium">
          {title}
        </span>
        <span className={`text-gold transition-transform duration-300 ${open ? 'rotate-45' : ''}`}>
          +
        </span>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-96 pb-4' : 'max-h-0'}`}>
        <div className="font-body text-text-secondary text-sm leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  )
}

// ── Review Card ──────────────────────────────────────────────
const ReviewCard = ({ review }) => (
  <div className="border-b border-surface-border py-6">
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-gold text-primary rounded-full flex items-center justify-center font-body font-medium text-xs">
          {review.user?.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-body text-text-primary text-sm font-medium">
            {review.user?.name}
          </p>
          <p className="font-body text-text-disabled text-xs">
            {new Date(review.createdAt).toLocaleDateString('en-IN', {
              year: 'numeric', month: 'long', day: 'numeric'
            })}
          </p>
        </div>
      </div>
      <div className="flex gap-0.5">
        {[1,2,3,4,5].map(s => (
          <Star key={s} size={12} className={s <= review.rating ? 'text-gold fill-gold' : 'text-text-disabled'} />
        ))}
      </div>
    </div>
    <p className="font-body text-text-secondary text-sm leading-relaxed">
      {review.comment}
    </p>
  </div>
)

// ── Main Component ───────────────────────────────────────────
const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { accessToken } = useAuthStore()
  const { addItem } = useCartStore()

  const [product, setProduct] = useState(null)
  const [reviews, setReviews] = useState([])
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)

  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [addingToCart, setAddingToCart] = useState(false)

  // Review form
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' })
  const [submittingReview, setSubmittingReview] = useState(false)

  const imageRef = useRef(null)
  const contentRef = useRef(null)
  const detailsRef = useRef(null)

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true)
      try {
        const res = await productService.getById(id)
        const p = res.data.data
        setProduct(p)
        setSelectedImage(0)

        // Fetch related products
        const relRes = await productService.getAll({
          category: p.category,
          limit: 4,
        })
        setRelated(relRes.data.data.products.filter(r => r._id !== id))
      } catch {
        toast.error('Product not found')
        navigate('/shop')
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [id])

  useEffect(() => {
    if (!product || loading) return

    // Animate image panel
    gsap.fromTo(imageRef.current,
      { opacity: 0, x: -40 },
      { opacity: 1, x: 0, duration: 0.9, ease: 'power3.out' }
    )

    // Animate content panel — stagger children
    gsap.fromTo(contentRef.current.children,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out', delay: 0.2 }
    )

    // Animate details section
    gsap.fromTo(detailsRef.current,
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: detailsRef.current, start: 'top 85%' }
      }
    )

    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [product, loading])

  const handleAddToCart = async () => {
    if (!accessToken) {
      toast.error('Please login to add to cart')
      navigate('/login')
      return
    }
    setAddingToCart(true)
    try {
      await cartService.addToCart(product._id, quantity)
      addItem(product, quantity)
      toast.success(`${product.name} added to cart`)
    } catch {
      toast.error('Failed to add to cart')
    } finally {
      setAddingToCart(false)
    }
  }

  const handleSubmitReview = async (e) => {
    e.preventDefault()
    if (!accessToken) {
      toast.error('Please login to submit a review')
      return
    }
    setSubmittingReview(true)
    try {
      await productService.addReview(id, reviewData)
      toast.success('Review submitted!')
      setShowReviewForm(false)
      setReviewData({ rating: 5, comment: '' })
      // Refresh product for updated rating
      const res = await productService.getById(id)
      setProduct(res.data.data)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review')
    } finally {
      setSubmittingReview(false)
    }
  }

  const discountPercent = product?.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : null

  // ── Loading State ────────────────────────────────────────
  if (loading) return <ProductDetailSkeleton />

  if (!product) return null

  return (
    <div className="bg-primary min-h-screen pt-20">

      {/* Breadcrumb */}
      <div className="border-b border-surface-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4 flex items-center gap-2 text-xs font-body">
          <Link to="/" className="text-text-disabled hover:text-gold transition-colors">Home</Link>
          <span className="text-text-disabled">/</span>
          <Link to="/shop" className="text-text-disabled hover:text-gold transition-colors">Shop</Link>
          <span className="text-text-disabled">/</span>
          <Link to={`/shop?category=${product.category}`} className="text-text-disabled hover:text-gold transition-colors capitalize">
            {product.category}
          </Link>
          <span className="text-text-disabled">/</span>
          <span className="text-text-secondary">{product.name}</span>
        </div>
      </div>

      {/* Main Product Section */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* ── LEFT — Image Gallery ── */}
          <div ref={imageRef} className="opacity-0">

            {/* Main Image */}
            <div className="relative overflow-hidden bg-surface mb-4 group h-72 lg:h-[520px]">
              {product.images?.[selectedImage] ? (
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ShoppingBag size={64} className="text-text-disabled" />
                </div>
              )}

              {/* Discount badge */}
              {discountPercent && (
                <div className="absolute top-4 left-4 bg-gold text-primary text-xs font-mono font-medium px-3 py-1.5">
                  -{discountPercent}% OFF
                </div>
              )}

              {/* Prev / Next arrows if multiple images */}
              {product.images?.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImage(prev =>
                      prev === 0 ? product.images.length - 1 : prev - 1
                    )}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-primary/70 backdrop-blur-sm border border-surface-border flex items-center justify-center text-text-secondary hover:text-gold hover:border-gold transition-all opacity-0 group-hover:opacity-100"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={() => setSelectedImage(prev =>
                      prev === product.images.length - 1 ? 0 : prev + 1
                    )}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-primary/70 backdrop-blur-sm border border-surface-border flex items-center justify-center text-text-secondary hover:text-gold hover:border-gold transition-all opacity-0 group-hover:opacity-100"
                  >
                    <ChevronRight size={18} />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Strip */}
            {product.images?.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`relative overflow-hidden h-24 transition-all duration-200
                      ${selectedImage === i
                        ? 'border-2 border-gold'
                        : 'border border-surface-border hover:border-text-secondary'
                      }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── RIGHT — Product Info ── */}
          <div ref={contentRef}>

            {/* Category + Share */}
            <div className="flex items-center justify-between opacity-0">
              <p className="section-label capitalize">{product.category}</p>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href)
                  toast.success('Link copied!')
                }}
                className="text-text-disabled hover:text-gold transition-colors"
              >
                <Share2 size={16} />
              </button>
            </div>

            {/* Name */}
            <h1 className="font-display text-4xl lg:text-5xl text-text-primary leading-tight mt-3 mb-4 opacity-0">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-6 opacity-0">
              <div className="flex gap-1">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} size={14}
                    className={s <= Math.round(product.ratingAvg) ? 'text-gold fill-gold' : 'text-text-disabled'} />
                ))}
              </div>
              <span className="font-mono text-text-secondary text-sm">
                {product.ratingAvg > 0
                  ? `${product.ratingAvg} (${product.ratingCount} reviews)`
                  : 'No reviews yet'
                }
              </span>
              {product.ratingCount > 0 && (
                <button
                  onClick={() => document.getElementById('reviews').scrollIntoView({ behavior: 'smooth' })}
                  className="text-gold text-xs font-body underline"
                >
                  Read reviews
                </button>
              )}
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-4 mb-6 opacity-0">
              <span className="font-mono text-gold text-3xl font-medium">
                ₹{(product.discountPrice || product.price).toLocaleString('en-IN')}
              </span>
              {product.discountPrice && (
                <>
                  <span className="font-mono text-text-disabled text-xl line-through">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  <span className="bg-gold/20 text-gold text-xs font-mono px-2 py-1">
                    SAVE ₹{(product.price - product.discountPrice).toLocaleString('en-IN')}
                  </span>
                </>
              )}
            </div>

            {/* Divider */}
            <div className="w-full h-px bg-surface-border mb-6 opacity-0" />

            {/* Description */}
            <p className="font-body text-text-secondary leading-relaxed mb-8 opacity-0">
              {product.description}
            </p>

            {/* Tags */}
            {product.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8 opacity-0">
                {product.tags.map(tag => (
                  <span key={tag} className="font-body text-xs text-text-disabled border border-surface-border px-3 py-1 capitalize">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Stock */}
            <div className="flex items-center gap-2 mb-6 opacity-0">
              <div className={`w-2 h-2 rounded-full ${product.stock > 5 ? 'bg-status-success' : product.stock > 0 ? 'bg-status-warning' : 'bg-status-error'}`} />
              <span className="font-body text-sm text-text-secondary">
                {product.stock > 5
                  ? 'In Stock'
                  : product.stock > 0
                  ? `Only ${product.stock} left`
                  : 'Out of Stock'
                }
              </span>
            </div>

            {/* Quantity + Add to Cart */}
            <div className="flex gap-3 mb-6 opacity-0">
              {/* Qty selector */}
              <div className="flex items-center border border-surface-border">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-10 h-12 flex items-center justify-center text-text-secondary hover:text-gold transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="w-12 h-12 flex items-center justify-center font-mono text-text-primary text-sm border-x border-surface-border">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                  disabled={product.stock === 0}
                  className="w-10 h-12 flex items-center justify-center text-text-secondary hover:text-gold transition-colors disabled:opacity-30"
                >
                  <Plus size={14} />
                </button>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                disabled={addingToCart || product.stock === 0}
                className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {addingToCart ? (
                  <span className="animate-pulse">Adding...</span>
                ) : product.stock === 0 ? (
                  'Sold Out'
                ) : (
                  <><ShoppingBag size={16} /> Add to Cart</>
                )}
              </button>

              {/* Wishlist */}
              <button
                onClick={() => {
                  setIsWishlisted(!isWishlisted)
                  toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist')
                }}
                className="w-12 h-12 border border-surface-border flex items-center justify-center hover:border-gold transition-colors"
              >
                <Heart size={16} className={isWishlisted ? 'text-gold fill-gold' : 'text-text-secondary'} />
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-2 gap-3 mb-8 opacity-0">
              {[
                { icon: Truck, text: 'Free shipping above ₹2000' },
                { icon: RotateCcw, text: '7-day easy returns' },
                { icon: Shield, text: 'Secure payments' },
                { icon: Award, text: 'Genuine leather' },
              ].map((badge) => {
                const Icon = badge.icon
                return (
                  <div key={badge.text} className="flex items-center gap-2 bg-surface px-3 py-2 border border-surface-border">
                    <Icon size={14} className="text-gold flex-shrink-0" />
                    <span className="font-body text-text-secondary text-xs">{badge.text}</span>
                  </div>
                )
              })}
            </div>

            {/* Accordions */}
            <div className="opacity-0">
              <Accordion title="Product Details">
                <ul className="space-y-2">
                  <li>Material: Full-grain genuine leather</li>
                  <li>Hardware: Gold-plated metal fittings</li>
                  <li>Lining: Premium suede interior</li>
                  <li>Closure: Magnetic snap + zip compartment</li>
                  <li>Category: <span className="capitalize">{product.category}</span></li>
                </ul>
              </Accordion>
              <Accordion title="Shipping & Delivery">
                <p>Free shipping on orders above ₹2000. Standard delivery 3-5 business days across India. Express delivery available at checkout.</p>
              </Accordion>
              <Accordion title="Returns & Exchanges">
                <p>7-day easy returns for unused items in original condition. Contact support@scatch.in or use your dashboard to initiate a return.</p>
              </Accordion>
              <Accordion title="Care Instructions">
                <p>Wipe with a dry cloth after use. Apply leather conditioner every 3 months. Avoid direct sunlight and moisture. Store in the dust bag provided.</p>
              </Accordion>
            </div>
          </div>
        </div>
      </div>

      {/* ── Reviews Section ── */}
      <div ref={detailsRef} id="reviews" className="border-t border-surface-border mt-8 opacity-0">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">

          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="section-label mb-2">Verified Buyers</p>
              <h2 className="font-display text-display-m text-text-primary">
                Customer Reviews
              </h2>
            </div>
            {accessToken && (
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="btn-secondary text-sm"
              >
                {showReviewForm ? 'Cancel' : 'Write a Review'}
              </button>
            )}
          </div>

          {/* Rating Summary */}
          {product.ratingCount > 0 && (
            <div className="flex items-center gap-8 mb-12 p-8 bg-surface border border-surface-border">
              <div className="text-center">
                <p className="font-mono text-gold text-5xl font-medium">{product.ratingAvg}</p>
                <div className="flex gap-1 justify-center my-2">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} size={14} className={s <= Math.round(product.ratingAvg) ? 'text-gold fill-gold' : 'text-text-disabled'} />
                  ))}
                </div>
                <p className="font-body text-text-disabled text-xs">{product.ratingCount} reviews</p>
              </div>
              <div className="flex-1">
                {[5,4,3,2,1].map(star => {
                  const count = reviews.filter(r => r.rating === star).length
                  const percent = reviews.length > 0 ? (count / reviews.length) * 100 : 0
                  return (
                    <div key={star} className="flex items-center gap-3 mb-2">
                      <span className="font-mono text-text-disabled text-xs w-4">{star}</span>
                      <Star size={10} className="text-gold fill-gold" />
                      <div className="flex-1 h-1 bg-surface-raised rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gold transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <span className="font-mono text-text-disabled text-xs w-6">{count}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Review Form */}
          {showReviewForm && (
            <form onSubmit={handleSubmitReview} className="bg-surface border border-surface-border p-8 mb-8">
              <h3 className="font-body text-text-primary font-medium mb-6">Your Review</h3>

              {/* Star selector */}
              <div className="flex gap-2 mb-6">
                {[1,2,3,4,5].map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setReviewData(prev => ({ ...prev, rating: s }))}
                  >
                    <Star
                      size={24}
                      className={s <= reviewData.rating ? 'text-gold fill-gold' : 'text-text-disabled'}
                    />
                  </button>
                ))}
              </div>

              <textarea
                value={reviewData.comment}
                onChange={e => setReviewData(prev => ({ ...prev, comment: e.target.value }))}
                placeholder="Share your experience with this product..."
                rows={4}
                required
                className="input-field resize-none mb-4"
              />

              <button
                type="submit"
                disabled={submittingReview}
                className="btn-primary disabled:opacity-50"
              >
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          )}

          {/* Reviews List */}
          {reviews.length === 0 ? (
            <div className="text-center py-16 border border-surface-border">
              <Star size={40} className="text-text-disabled mx-auto mb-4" />
              <p className="font-display text-xl text-text-secondary mb-2">No reviews yet</p>
              <p className="font-body text-text-disabled text-sm">Be the first to review this product</p>
            </div>
          ) : (
            <div>
              {reviews.map(review => (
                <ReviewCard key={review._id} review={review} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Related Products ── */}
      {related.length > 0 && (
        <div className="border-t border-surface-border">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
            <div className="mb-10">
              <p className="section-label mb-2">More Like This</p>
              <h2 className="font-display text-display-m text-text-primary">
                You May Also Like
              </h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-surface-border">
              {related.map(product => (
                <Link
                  key={product._id}
                  to={`/shop/${product._id}`}
                  className="card-product group block"
                >
                  <div className="relative overflow-hidden h-64">
                    {product.images?.[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-surface">
                        <ShoppingBag size={32} className="text-text-disabled" />
                      </div>
                    )}
                  </div>
                  <div className="p-4 border-t border-surface-border">
                    <p className="section-label text-[10px] mb-1 capitalize">{product.category}</p>
                    <p className="font-body text-text-primary text-sm mb-2 group-hover:text-gold transition-colors line-clamp-1">
                      {product.name}
                    </p>
                    <p className="font-mono text-gold text-sm">
                      ₹{(product.discountPrice || product.price).toLocaleString('en-IN')}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductDetail
