import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, X, ChevronDown, Search } from 'lucide-react'
import { productService } from '../services/product.service'
import { cartService } from '../services/cart.service'
import { useAuthStore } from '../store/authStore'
import { useCartStore } from '../store/cartStore'
import { Link } from 'react-router-dom'
import { ShoppingBag, Star, Heart } from 'lucide-react'
import toast from 'react-hot-toast'

// ── Skeleton ────────────────────────────────────────────────
const ProductSkeleton = () => (
  <div className="card-product group">
    <div className="skeleton w-full h-72" />
    <div className="p-5 space-y-3">
      <div className="skeleton h-3 w-20 rounded" />
      <div className="skeleton h-5 w-3/4 rounded" />
      <div className="skeleton h-4 w-1/3 rounded" />
    </div>
  </div>
)

// ── Product Card ─────────────────────────────────────────────
const ProductCard = ({ product }) => {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [addingToCart, setAddingToCart] = useState(false)
  const { accessToken } = useAuthStore()
  const { addItem } = useCartStore()

  const handleAddToCart = async (e) => {
    e.preventDefault()
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
    } catch {
      toast.error('Failed to add to cart')
    } finally {
      setAddingToCart(false)
    }
  }

  const discountPercent = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : null

  return (
    <Link to={`/shop/${product._id}`} className="card-product group block">
      <div className="relative overflow-hidden bg-surface h-72">
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-surface">
            <ShoppingBag size={40} className="text-text-disabled" />
          </div>
        )}

        {discountPercent && (
          <div className="absolute top-4 left-4 bg-gold text-primary text-xs font-mono font-medium px-2 py-1">
            -{discountPercent}%
          </div>
        )}

        {product.stock <= 3 && product.stock > 0 && (
          <div className="absolute top-4 right-12 bg-status-error/90 text-white text-xs px-2 py-1">
            Only {product.stock} left
          </div>
        )}

        {product.stock === 0 && (
          <div className="absolute inset-0 bg-primary/60 flex items-center justify-center">
            <span className="text-text-secondary font-body text-sm tracking-widest uppercase">
              Sold Out
            </span>
          </div>
        )}

        <div className="absolute inset-0 flex items-end justify-center pb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleAddToCart}
            disabled={addingToCart || product.stock === 0}
            className="btn-primary text-xs py-3 px-6 flex items-center gap-2 disabled:opacity-50 w-3/4 justify-center"
          >
            {addingToCart ? (
              <span className="animate-pulse">Adding...</span>
            ) : (
              <><ShoppingBag size={14} /> Add to Cart</>
            )}
          </button>
        </div>

        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setIsWishlisted(!isWishlisted)
            toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist')
          }}
          className="absolute top-4 right-4 w-8 h-8 bg-primary/70 backdrop-blur-sm flex items-center justify-center border border-surface-border opacity-0 group-hover:opacity-100 transition-all duration-300 hover:border-gold"
        >
          <Heart size={14} className={isWishlisted ? 'text-gold fill-gold' : 'text-text-secondary'} />
        </button>
      </div>

      <div className="p-5 border-t border-surface-border">
        <p className="section-label text-[10px] mb-2 capitalize">{product.category}</p>
        <h3 className="font-body text-text-primary font-medium text-sm mb-3 group-hover:text-gold transition-colors duration-300 line-clamp-1">
          {product.name}
        </h3>
        {product.ratingCount > 0 && (
          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex">
              {[1,2,3,4,5].map((star) => (
                <Star key={star} size={10} className={star <= Math.round(product.ratingAvg) ? 'text-gold fill-gold' : 'text-text-disabled'} />
              ))}
            </div>
            <span className="text-text-disabled font-mono text-xs">({product.ratingCount})</span>
          </div>
        )}
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

// ── Main Shop Page ────────────────────────────────────────────
const categories = [
  { value: '', label: 'All Categories' },
  { value: 'tote', label: 'Tote Bags' },
  { value: 'crossbody', label: 'Crossbody' },
  { value: 'backpack', label: 'Backpacks' },
  { value: 'wallet', label: 'Wallets' },
  { value: 'briefcase', label: 'Briefcases' },
  { value: 'duffle', label: 'Duffle Bags' },
  { value: 'clutch', label: 'Clutch' },
]

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
]

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const [showFilters, setShowFilters] = useState(false)

  // Filter state — read from URL
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: searchParams.get('sort') || 'newest',
    page: Number(searchParams.get('page')) || 1,
  })

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const params = {}
      if (filters.search) params.search = filters.search
      if (filters.category) params.category = filters.category
      if (filters.minPrice) params.minPrice = filters.minPrice
      if (filters.maxPrice) params.maxPrice = filters.maxPrice
      if (filters.sort) params.sort = filters.sort
      params.page = filters.page
      params.limit = 12

      const res = await productService.getAll(params)
      setProducts(res.data.data.products)
      setTotal(res.data.data.pagination.total)
      setPages(res.data.data.pagination.pages)
    } catch {
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
  fetchProducts()
  const params = {}
  if (filters.search) params.search = filters.search
  if (filters.category) params.category = filters.category
  if (filters.minPrice) params.minPrice = filters.minPrice
  if (filters.maxPrice) params.maxPrice = filters.maxPrice
  if (filters.sort && filters.sort !== 'newest') params.sort = filters.sort
  if (filters.page && filters.page > 1) params.page = filters.page
  setSearchParams(params)
}, [filters])

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }))
  }

  const clearFilters = () => {
    setFilters({ search: '', category: '', minPrice: '', maxPrice: '', sort: 'newest', page: 1 })
  }

  const activeFilterCount = [filters.category, filters.minPrice, filters.maxPrice, filters.search]
    .filter(Boolean).length

  return (
    <div className="bg-primary min-h-screen pt-24">

      {/* Page Header */}
      <div className="border-b border-surface-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
          <p className="section-label mb-2">Browse</p>
          <div className="flex items-end justify-between">
            <h1 className="font-display text-display-m text-text-primary">
              {filters.category
                ? categories.find(c => c.value === filters.category)?.label || 'The Collection'
                : 'The Collection'
              }
            </h1>
            <p className="font-body text-text-secondary text-sm hidden lg:block">
              {total} {total === 1 ? 'product' : 'products'} found
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8">
        <div className="flex gap-8">

          {/* ── SIDEBAR FILTERS ── */}
          <aside className={`
            fixed lg:relative inset-0 z-40 bg-primary lg:bg-transparent
            w-72 lg:w-64 flex-shrink-0 overflow-y-auto
            transition-transform duration-300
            ${showFilters ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}>
            <div className="p-6 lg:p-0 space-y-8">

              {/* Mobile close */}
              <div className="flex items-center justify-between lg:hidden">
                <h3 className="font-body text-text-primary font-medium">Filters</h3>
                <button onClick={() => setShowFilters(false)}>
                  <X size={20} className="text-text-secondary" />
                </button>
              </div>

              {/* Search */}
              <div>
                <h4 className="section-label mb-4">Search</h4>
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-disabled" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={filters.search}
                    onChange={e => updateFilter('search', e.target.value)}
                    className="input-field pl-9 text-xs"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <h4 className="section-label mb-4">Category</h4>
                <div className="space-y-2">
                  {categories.map(cat => (
                    <button
                      key={cat.value}
                      onClick={() => updateFilter('category', cat.value)}
                      className={`w-full text-left px-3 py-2 font-body text-sm transition-all duration-200
                        ${filters.category === cat.value
                          ? 'text-gold border-l-2 border-gold pl-4'
                          : 'text-text-secondary hover:text-text-primary border-l-2 border-transparent'
                        }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h4 className="section-label mb-4">Price Range</h4>
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    placeholder="Min ₹"
                    value={filters.minPrice}
                    onChange={e => updateFilter('minPrice', e.target.value)}
                    className="input-field text-xs w-full"
                  />
                  <span className="text-text-disabled">—</span>
                  <input
                    type="number"
                    placeholder="Max ₹"
                    value={filters.maxPrice}
                    onChange={e => updateFilter('maxPrice', e.target.value)}
                    className="input-field text-xs w-full"
                  />
                </div>
              </div>

              {/* Clear filters */}
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="w-full btn-secondary text-xs py-2"
                >
                  Clear All Filters ({activeFilterCount})
                </button>
              )}
            </div>
          </aside>

          {/* Mobile overlay */}
          {showFilters && (
            <div
              className="fixed inset-0 z-30 bg-primary/80 lg:hidden"
              onClick={() => setShowFilters(false)}
            />
          )}

          {/* ── MAIN CONTENT ── */}
          <div className="flex-1 min-w-0">

            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-surface-border">
              <button
                onClick={() => setShowFilters(true)}
                className="lg:hidden flex items-center gap-2 text-text-secondary hover:text-gold text-sm font-body transition-colors"
              >
                <SlidersHorizontal size={16} />
                Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
              </button>

              <p className="text-text-disabled font-body text-sm lg:hidden">
                {total} results
              </p>

              {/* Sort */}
              <div className="relative ml-auto">
                <select
                  value={filters.sort}
                  onChange={e => updateFilter('sort', e.target.value)}
                  className="input-field text-xs pr-8 appearance-none cursor-pointer w-48"
                >
                  {sortOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-disabled pointer-events-none" />
              </div>
            </div>

            {/* Active filter pills */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {filters.category && (
                  <span className="flex items-center gap-1 bg-surface border border-gold text-gold text-xs px-3 py-1 font-body">
                    {categories.find(c => c.value === filters.category)?.label}
                    <button onClick={() => updateFilter('category', '')}>
                      <X size={10} />
                    </button>
                  </span>
                )}
                {filters.search && (
                  <span className="flex items-center gap-1 bg-surface border border-gold text-gold text-xs px-3 py-1 font-body">
                    "{filters.search}"
                    <button onClick={() => updateFilter('search', '')}>
                      <X size={10} />
                    </button>
                  </span>
                )}
                {(filters.minPrice || filters.maxPrice) && (
                  <span className="flex items-center gap-1 bg-surface border border-gold text-gold text-xs px-3 py-1 font-body">
                    ₹{filters.minPrice || '0'} — ₹{filters.maxPrice || '∞'}
                    <button onClick={() => { updateFilter('minPrice', ''); updateFilter('maxPrice', '') }}>
                      <X size={10} />
                    </button>
                  </span>
                )}
              </div>
            )}

            {/* Product Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-px bg-surface-border">
                {[...Array(12)].map((_, i) => <ProductSkeleton key={i} />)}
              </div>
            ) : products.length === 0 ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-px bg-surface-border">
                <ShoppingBag size={48} className="text-text-disabled mx-auto mb-4" />
                <p className="font-display text-2xl text-text-secondary mb-2">No products found</p>
                <p className="font-body text-text-disabled text-sm mb-8">
                  Try adjusting your filters or search terms
                </p>
                <button onClick={clearFilters} className="btn-primary">
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-px bg-surface-border">
                {products.map(product => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button
                  onClick={() => updateFilter('page', filters.page - 1)}
                  disabled={filters.page === 1}
                  className="w-10 h-10 border border-surface-border flex items-center justify-center text-text-secondary hover:text-gold hover:border-gold transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  ←
                </button>

                {[...Array(pages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => updateFilter('page', i + 1)}
                    className={`w-10 h-10 border font-mono text-sm transition-colors
                      ${filters.page === i + 1
                        ? 'border-gold text-gold bg-surface'
                        : 'border-surface-border text-text-secondary hover:text-gold hover:border-gold'
                      }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() => updateFilter('page', filters.page + 1)}
                  disabled={filters.page === pages}
                  className="w-10 h-10 border border-surface-border flex items-center justify-center text-text-secondary hover:text-gold hover:border-gold transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Shop