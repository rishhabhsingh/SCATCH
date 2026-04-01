import { useState, useEffect } from 'react'
import { Users, Search } from 'lucide-react'
import api from '../../services/axios'
import toast from 'react-hot-toast'
import { TableRowSkeleton } from '../../components/ui/Skeleton'

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await api.get('/auth/users')
        setCustomers(res.data.data)
      } catch {
        toast.error('Failed to load customers')
      } finally {
        setLoading(false)
      }
    }
    fetchCustomers()
  }, [])

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="section-label mb-1">Manage</p>
          <h1 className="font-display text-3xl text-text-primary">Customers</h1>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-disabled" />
        <input
          type="text"
          placeholder="Search customers..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="input-field pl-9 text-sm"
        />
      </div>

     if (loading) return (
  <div className="bg-surface border border-surface-border">
    {[...Array(6)].map((_, i) => <TableRowSkeleton key={i} />)}
  </div>
) : filtered.length === 0 ? (
        <div className="text-center py-20 border border-surface-border">
          <Users size={48} className="text-text-disabled mx-auto mb-4" />
          <p className="font-body text-text-secondary">No customers found</p>
        </div>
      ) : (
        <div className="bg-surface border border-surface-border">
          {/* Header */}
          <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-surface-border bg-primary/30">
            {[
              { label: 'Customer', span: 4 },
              { label: 'Email', span: 4 },
              { label: 'Role', span: 2 },
              { label: 'Joined', span: 2 },
            ].map(h => (
              <div key={h.label} className={`section-label text-[10px] col-span-${h.span}`}>
                {h.label}
              </div>
            ))}
          </div>

          <div className="divide-y divide-surface-border">
            {filtered.map(customer => (
              <div key={customer._id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-primary/20 transition-colors">
                <div className="col-span-4 flex items-center gap-3">
                  <div className="w-8 h-8 bg-gold text-primary rounded-full flex items-center justify-center font-body text-xs font-medium flex-shrink-0">
                    {customer.name?.charAt(0).toUpperCase()}
                  </div>
                  <p className="font-body text-text-primary text-sm truncate">{customer.name}</p>
                </div>
                <div className="col-span-4">
                  <p className="font-body text-text-secondary text-sm truncate">{customer.email}</p>
                </div>
                <div className="col-span-2">
                  <span className={`font-mono text-xs px-2 py-1 capitalize
                    ${customer.role === 'admin' ? 'text-gold bg-gold/10' : 'text-text-secondary bg-surface-raised'}`}>
                    {customer.role}
                  </span>
                </div>
                <div className="col-span-2">
                  <p className="font-body text-text-disabled text-xs">
                    {new Date(customer.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminCustomers