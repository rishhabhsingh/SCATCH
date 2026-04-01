import { useRef, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ShoppingBag, Star, Heart } from 'lucide-react'
import { productService } from '../../services/product.service'
import { cartService } from '../../services/cart.service'
import { useAuthStore } from '../../store/authStore'
import { useCartStore } from '../../store/cartStore'
import toast from 'react-hot-toast'

gsap.registerPlugin(ScrollTrigger)

// Skeleton loader while products fetch
const ProductSkeleton = () => (
  <div className="card-product">
    <div className="skeleton w-full h-72" />
    <div className="p-5 space-y-3">
      <div className="skeleton h-3 w-20 rounded" />
      <div className="skeleton h-5 w-3/4 rounded" />
      <div className="skeleton h-4 w-1/3 rounded" />
    </div>
  </div>
)

const ProductCard = ({ product, index, cardsRef }) => {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [addingToCart, setAddingToCart] = useState(false)
  const { accessToken } = useAuthStore()
  const { addItem } = useCartStore()

  const handleAddToCart = async (e) => {
    e.preventDefault() // prevent navigating to product page
    e.stopPropagation()

    if (!accessToken) {
      toast.error('Please login to add to cart')
      return
    }

    setAddingToCart(true)
    try {
      await cartService.addToCart(product._id, 1)
      addItem(product, 1)
      toast.success(`${product.name} added to cart`)
    } catch (err) {
      toast.error('Failed to add to cart')
    } finally {
      setAddingToCart(false)
    }
  }

  const discountPercent = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : null

  return (
    <Link
      to={`/shop/${product._id}`}
      ref={el => cardsRef.current[index] = el}
      className="card-product opacity-0 block"
    >
      {/* Image Area */}
      <div className="relative overflow-hidden bg-surface h-72">
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          // Placeholder when no image
          <div className="w-full h-full flex items-center justify-center bg-surface">
            <ShoppingBag size={40} className="text-text-disabled" />
          </div>
        )}

        {/* Discount badge */}
        {discountPercent && (
          <div className="absolute top-4 left-4 bg-gold text-primary text-xs font-mono font-medium px-2 py-1">
            -{discountPercent}%
          </div>
        )}

        {/* Stock warning */}
        {product.stock <= 3 && product.stock > 0 && (
          <div className="absolute top-4 right-4 bg-status-error/90 text-white text-xs px-2 py-1 font-body">
            Only {product.stock} left
          </div>
        )}

        {/* Out of stock */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-primary/60 flex items-center justify-center">
            <span className="text-text-secondary font-body text-sm tracking-widest uppercase">
              Sold Out
            </span>
          </div>
        )}

        {/* Hover actions */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-6 gap-3
                        opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleAddToCart}
            disabled={addingToCart || product.stock === 0}
            className="btn-primary text-xs py-3 px-6 flex items-center gap-2
                       disabled:opacity-50 disabled:cursor-not-allowed w-3/4 justify-center"
          >
            {addingToCart ? (
              <span className="animate-pulse">Adding...</span>
            ) : (
              <>
                <ShoppingBag size={14} />
                Add to Cart
              </>
            )}
          </button>
        </div>

        {/* Wishlist */}
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setIsWishlisted(!isWishlisted)
            toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist')
          }}
          className="absolute top-4 right-4 w-8 h-8 bg-primary/70 backdrop-blur-sm
                     flex items-center justify-center border border-surface-border
                     opacity-0 group-hover:opacity-100 transition-all duration-300
                     hover:border-gold"
        >
          <Heart
            size={14}
            className={isWishlisted ? 'text-gold fill-gold' : 'text-text-secondary'}
          />
        </button>
      </div>

      {/* Product Info */}
      <div className="p-5 border-t border-surface-border">
        {/* Category */}
        <p className="section-label text-[10px] mb-2 capitalize">
          {product.category}
        </p>

        {/* Name */}
        <h3 className="font-body text-text-primary font-medium text-sm mb-3
                       group-hover:text-gold transition-colors duration-300 line-clamp-1">
          {product.name}
        </h3>

        {/* Rating */}
        {product.ratingCount > 0 && (
          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={10}
                  className={star <= Math.round(product.ratingAvg)
                    ? 'text-gold fill-gold'
                    : 'text-text-disabled'
                  }
                />
              ))}
            </div>
            <span className="text-text-disabled font-mono text-xs">
              ({product.ratingCount})
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-3">
          <span className="font-mono text-gold font-medium text-base">
            ₹{(product.discountPrice || product.price).toLocaleString('en-IN')}
          </span>
          {product.discountPrice && (
            <span className="font-mono text-text-disabled text-sm line-through">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}

const FeaturedProducts = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const sectionRef = useRef(null)
  const headingRef = useRef(null)
  const cardsRef = useRef([])

useEffect(() => {
  const fetchProducts = async () => {
    try {
      const categories = ['tote', 'crossbody', 'backpack', 'wallet', 'briefcase', 'duffle']

      const results = await Promise.all(
        categories.map(cat =>
          productService.getAll({ category: cat, limit: 1, sort: 'newest' })
            .then(res => res.data.data.products[0])
            .catch(() => null)
        )
      )

      const validProducts = results.filter(Boolean)

      // If we got less than 4, fill with newest products
      if (validProducts.length < 4) {
        const res = await productService.getAll({ limit: 8, sort: 'newest' })
        setProducts(res.data.data.products)
      } else {
        setProducts(validProducts)
      }
    } catch (err) {
      console.error('Failed to fetch products:', err)
    } finally {
      setLoading(false)
    }
  }
  fetchProducts()
}, [])

  useEffect(() => {
    if (loading || products.length === 0) return

    gsap.fromTo(headingRef.current,
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: headingRef.current, start: 'top 85%' }
      }
    )

    cardsRef.current.forEach((card, i) => {
      if (!card) return
      gsap.fromTo(card,
        { opacity: 0, y: 60 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
          delay: (i % 4) * 0.1,
          scrollTrigger: { trigger: card, start: 'top 90%' }
        }
      )
    })

    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [loading, products])

  return (
    <section ref={sectionRef} className="bg-primary py-32 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div ref={headingRef} className="flex items-end justify-between mb-16 opacity-0">
          <div>
            <p className="section-label mb-3">Handpicked</p>
            <h2 className="font-display text-display-m text-text-primary">
              Featured Products
            </h2>
          </div>
          <Link
            to="/shop"
            className="hidden lg:flex items-center gap-2 text-text-secondary hover:text-gold
                       font-body text-sm tracking-widest uppercase transition-colors duration-300
                       border-b border-transparent hover:border-gold pb-1"
          >
            View All <span className="text-gold">→</span>
          </Link>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-surface-border">
            {[...Array(8)].map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          // Empty state — no products in DB yet
          <div className="text-center py-24 border border-surface-border">
            <ShoppingBag size={48} className="text-text-disabled mx-auto mb-4" />
            <p className="font-display text-2xl text-text-secondary mb-2">
              Collection Coming Soon
            </p>
            <p className="font-body text-text-disabled text-sm">
              Add products from your admin panel to see them here
            </p>
            <Link to="/admin" className="btn-primary mt-8 inline-block">
              Go to Admin
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-surface-border">
            {products.map((product, i) => (
              <ProductCard
                key={product._id}
                product={product}
                index={i}
                cardsRef={cardsRef}
              />
            ))}
          </div>
        )}

        {/* View All — mobile */}
        <div className="text-center mt-12">
          <Link to="/shop" className="btn-secondary">
            View Full Collection
          </Link>
        </div>

      </div>
    </section>
  )
}

export default FeaturedProducts