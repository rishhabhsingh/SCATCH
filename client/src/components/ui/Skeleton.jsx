// Reusable skeleton components for every loading state

export const SkeletonBox = ({ className = '' }) => (
  <div className={`skeleton ${className}`} />
)

export const ProductCardSkeleton = () => (
  <div className="card-product">
    <div className="skeleton w-full h-72" />
    <div className="p-5 space-y-3">
      <div className="skeleton h-3 w-16 rounded" />
      <div className="skeleton h-4 w-3/4 rounded" />
      <div className="skeleton h-3 w-1/2 rounded" />
      <div className="skeleton h-5 w-1/3 rounded" />
    </div>
  </div>
)

export const ProductDetailSkeleton = () => (
  <div className="bg-primary min-h-screen pt-24">
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="space-y-4">
          <div className="skeleton w-full h-[520px]" />
          <div className="grid grid-cols-4 gap-3">
            {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-24" />)}
          </div>
        </div>
        <div className="space-y-5 pt-4">
          <div className="skeleton h-3 w-20 rounded" />
          <div className="skeleton h-12 w-3/4 rounded" />
          <div className="skeleton h-4 w-32 rounded" />
          <div className="skeleton h-8 w-40 rounded" />
          <div className="skeleton h-px w-full" />
          <div className="skeleton h-20 w-full rounded" />
          <div className="skeleton h-12 w-full rounded" />
          <div className="skeleton h-12 w-full rounded" />
        </div>
      </div>
    </div>
  </div>
)

export const OrderCardSkeleton = () => (
  <div className="bg-surface border border-surface-border p-6 space-y-3">
    <div className="flex items-center gap-3">
      <div className="skeleton h-3 w-24 rounded" />
      <div className="skeleton h-3 w-16 rounded" />
    </div>
    <div className="flex gap-2">
      {[...Array(3)].map((_, i) => <div key={i} className="skeleton w-12 h-12" />)}
    </div>
    <div className="skeleton h-6 w-20 rounded" />
  </div>
)

export const TableRowSkeleton = () => (
  <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-surface-border">
    <div className="col-span-1 skeleton h-10 w-10 rounded-full" />
    <div className="col-span-3 skeleton h-4 rounded" />
    <div className="col-span-3 skeleton h-4 rounded" />
    <div className="col-span-2 skeleton h-4 rounded" />
    <div className="col-span-2 skeleton h-4 rounded" />
    <div className="col-span-1 skeleton h-4 rounded" />
  </div>
)