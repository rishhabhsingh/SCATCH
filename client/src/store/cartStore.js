import { create } from 'zustand'

export const useCartStore = create((set, get) => ({
  items: [],
  isOpen: false,

  setItems: (items) => set({ items }),

  addItem: (product, quantity = 1) => {
    const items = get().items
    const existing = items.find(i => i.product._id === product._id)
    if (existing) {
      set({
        items: items.map(i =>
          i.product._id === product._id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        )
      })
    } else {
      set({ items: [...items, { product, quantity }] })
    }
  },

  removeItem: (productId) => set({
    items: get().items.filter(i => i.product._id !== productId)
  }),

  updateQuantity: (productId, quantity) => set({
    items: quantity <= 0
      ? get().items.filter(i => i.product._id !== productId)
      : get().items.map(i =>
          i.product._id === productId ? { ...i, quantity } : i
        )
  }),

  clearCart: () => set({ items: [] }),

  toggleCart: () => set({ isOpen: !get().isOpen }),

  getTotalAmount: () => {
    return get().items.reduce((acc, item) => {
      const price = item.product.discountPrice || item.product.price
      return acc + price * item.quantity
    }, 0)
  },

  getTotalItems: () => {
    return get().items.reduce((acc, item) => acc + item.quantity, 0)
  },
}))