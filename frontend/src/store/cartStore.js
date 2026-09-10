import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useAuthStore } from './authStore'

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      coupon: null, // { id, code, discount_amount, discount_type }

      applyCoupon: (couponData) => set({ coupon: couponData }),
      removeCoupon: () => set({ coupon: null }),

      addItem: (product, variant = null, quantity = 1, packaging = 'boite', collectionChoices = null) => {
        const items = get().items
        
        let variantKey = variant?.id || 'default'
        if (collectionChoices) {
          variantKey = 'coll-' + collectionChoices.map(v => v.id).sort().join('-')
        }
        const key = `${product.id}-${variantKey}-${packaging}`
        const existing = items.find((i) => i.key === key)

        if (existing) {
          set({
            items: items.map((i) =>
              i.key === key ? { ...i, quantity: i.quantity + quantity } : i
            ),
          })
        } else {
          set({
            items: [
              ...items,
              {
                key,
                product,
                variant,
                collectionChoices,
                quantity,
                packaging,
                price: (() => {
                  // Collection price is the base product price
                  if (collectionChoices) {
                    return parseFloat(product.is_promo && product.promo_price ? product.promo_price : product.price);
                  }
                  // Si le produit est en promo, on utilise toujours promo_price
                  if (product.is_promo && product.promo_price) return parseFloat(product.promo_price);
                  // Sinon, prix variante > prix effectif
                  if (variant?.price) return parseFloat(variant.price);
                  return parseFloat(product.effective_price);
                })(),
                weight: 0,
              },
            ],
          })
        }
      },

      removeItem: (key) =>
        set({ items: get().items.filter((i) => i.key !== key) }),

      updateQuantity: (key, quantity) => {
        if (quantity <= 0) {
          set({ items: get().items.filter((i) => i.key !== key) })
        } else {
          set({
            items: get().items.map((i) =>
              i.key === key ? { ...i, quantity } : i
            ),
          })
        }
      },

      clearCart: () => set({ items: [], coupon: null }),

      get total() {
        return get().items.reduce(
          (sum, i) => sum + i.price * i.quantity,
          0
        )
      },

      get count() {
        return get().items.reduce((sum, i) => sum + i.quantity, 0)
      },
    }),
    { name: 'piove-cart' }
  )
)
