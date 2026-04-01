import { useState, useEffect, useRef } from 'react'
import { Plus, Search, Edit2, Trash2, X, Package, Save } from 'lucide-react'
import { productService } from '../../services/product.service'
import toast from 'react-hot-toast'

const CATEGORIES = ['tote', 'crossbody', 'wallet', 'backpack', 'clutch', 'briefcase', 'duffle']

const emptyForm = {
  name: '', description: '', price: '', discountPrice: '',
  category: 'tote', stock: '', tags: '', images: '',
}

const ProductModal = ({ product, onClose, onSave }) => {
  const [form, setForm] = useState(product
    ? {
        ...product,
        tags: product.tags?.join(', ') || '',
        images: product.images?.join(', ') || '',
      }
    : emptyForm
  )
  const [saving, setSaving] = useState(false)

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        discountPrice: form.discountPrice ? Number(form.discountPrice) : undefined,
        stock: Number(form.stock),
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        images: form.images.split(',').map(i => i.trim()).filter(Boolean),
      }
      if (product) {
        await productService.update(product._id, payload)
        toast.success('Product updated')
      } else {
        await productService.create(payload)
        toast.success('Product created')
      }
      onSave()
      onClose()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-primary/90 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-surface border border-surface-border w-full max-w-2xl max-h-[90vh] overflow-y-auto z-10">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-border sticky top-0 bg-surface">
          <h2 className="font-body text-text-primary font-medium text-sm tracking-widest uppercase">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button onClick={onClose} className="text-text-disabled hover:text-gold transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="section-label block mb-2">Product Name *</label>
              <input name="name" value={form.name} onChange={handleChange} required className="input-field" placeholder="The Milano Tote" />
            </div>
            <div className="col-span-2">
              <label className="section-label block mb-2">Description *</label>
              <textarea name="description" value={form.description} onChange={handleChange} required rows={3} className="input-field resize-none" placeholder="Handcrafted full-grain leather..." />
            </div>
            <div>
              <label className="section-label block mb-2">Price (₹) *</label>
              <input name="price" type="number" value={form.price} onChange={handleChange} required className="input-field" placeholder="8999" />
            </div>
            <div>
              <label className="section-label block mb-2">Discount Price (₹)</label>
              <input name="discountPrice" type="number" value={form.discountPrice} onChange={handleChange} className="input-field" placeholder="7499" />
            </div>
            <div>
              <label className="section-label block mb-2">Category *</label>
              <select name="category" value={form.category} onChange={handleChange} className="input-field">
                {CATEGORIES.map(c => (
                  <option key={c} value={c} className="bg-surface capitalize">{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="section-label block mb-2">Stock *</label>
              <input name="stock" type="number" value={form.stock} onChange={handleChange} required className="input-field" placeholder="20" />
            </div>
            <div className="col-span-2">
              <label className="section-label block mb-2">Image URLs (comma separated)</label>
              <textarea name="images" value={form.images} onChange={handleChange} rows={2} className="input-field resize-none text-xs" placeholder="https://image1.jpg, https://image2.jpg" />
            </div>
            <div className="col-span-2">
              <label className="section-label block mb-2">Tags (comma separated)</label>
              <input name="tags" value={form.tags} onChange={handleChange} className="input-field" placeholder="leather, premium, office" />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-60">
              <Save size={14} />
              {saving ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const AdminProducts = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [modalProduct, setModalProduct] = useState(undefined)
  const [showModal, setShowModal] = useState(false)
  const [deleting, setDeleting] = useState(null)

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params = { limit: 100 }
      if (categoryFilter) params.category = categoryFilter
      if (search) params.search = search
      const res = await productService.getAll(params)
      setProducts(res.data.data.products)
    } catch {
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchProducts() }, [categoryFilter, search])

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    setDeleting(id)
    try {
      await productService.delete(id)
      toast.success('Product deleted')
      fetchProducts()
    } catch {
      toast.error('Failed to delete product')
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="section-label mb-1">Manage</p>
          <h1 className="font-display text-3xl text-text-primary">Products</h1>
        </div>
        <button
          onClick={() => { setModalProduct(undefined); setShowModal(true) }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-disabled" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field pl-9 text-sm"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className="input-field w-40 text-sm"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map(c => (
            <option key={c} value={c} className="bg-surface capitalize">{c}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-2">
          {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-16 rounded" />)}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 border border-surface-border">
          <Package size={48} className="text-text-disabled mx-auto mb-4" />
          <p className="font-body text-text-secondary">No products found</p>
        </div>
      ) : (
        <div className="bg-surface border border-surface-border overflow-hidden">

          {/* Header */}
          <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-surface-border bg-primary/30">
            {['Product', 'Category', 'Price', 'Stock', 'Actions'].map(h => (
              <div key={h} className={`section-label text-[10px] ${h === 'Product' ? 'col-span-4' : h === 'Actions' ? 'col-span-2 text-right' : 'col-span-2'}`}>
                {h}
              </div>
            ))}
          </div>

          {/* Rows */}
          <div className="divide-y divide-surface-border">
            {products.map(product => (
              <div key={product._id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-primary/20 transition-colors">

                {/* Product */}
                <div className="col-span-4 flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 bg-primary border border-surface-border overflow-hidden flex-shrink-0">
                    {product.images?.[0]
                      ? <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                      : <Package size={14} className="text-text-disabled m-auto mt-2" />
                    }
                  </div>
                  <p className="font-body text-text-primary text-sm truncate">{product.name}</p>
                </div>

                {/* Category */}
                <div className="col-span-2">
                  <span className="font-body text-text-secondary text-xs capitalize">{product.category}</span>
                </div>

                {/* Price */}
                <div className="col-span-2">
                  <p className="font-mono text-gold text-sm">
                    ₹{(product.discountPrice || product.price).toLocaleString('en-IN')}
                  </p>
                  {product.discountPrice && (
                    <p className="font-mono text-text-disabled text-xs line-through">
                      ₹{product.price.toLocaleString('en-IN')}
                    </p>
                  )}
                </div>

                {/* Stock */}
                <div className="col-span-2">
                  <span className={`font-mono text-sm font-medium
                    ${product.stock === 0 ? 'text-status-error' :
                      product.stock <= 3 ? 'text-status-warning' : 'text-status-success'}`}>
                    {product.stock}
                  </span>
                </div>

                {/* Actions */}
                <div className="col-span-2 flex items-center justify-end gap-2">
                  <button
                    onClick={() => { setModalProduct(product); setShowModal(true) }}
                    className="w-8 h-8 flex items-center justify-center border border-surface-border text-text-secondary hover:text-gold hover:border-gold transition-colors"
                  >
                    <Edit2 size={13} />
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    disabled={deleting === product._id}
                    className="w-8 h-8 flex items-center justify-center border border-surface-border text-text-secondary hover:text-status-error hover:border-status-error transition-colors disabled:opacity-40"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <ProductModal
          product={modalProduct}
          onClose={() => setShowModal(false)}
          onSave={fetchProducts}
        />
      )}
    </div>
  )
}

export default AdminProducts