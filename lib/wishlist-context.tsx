'use client'
import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { type Producto, type Variante } from '@/lib/products'

export type WishItem = { producto: Producto; variante: Variante }

type WishlistCtx = {
  items: WishItem[]
  add: (p: Producto, v: Variante) => void
  remove: (id: string) => void
  toggle: (p: Producto, v: Variante) => void
  clear: () => void
  has: (id: string) => boolean
}

const STORAGE_KEY = 'essen_wishlist'

const WishlistContext = createContext<WishlistCtx>({
  items: [],
  add: () => {},
  remove: () => {},
  toggle: () => {},
  clear: () => {},
  has: () => false,
})

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishItem[]>([])
  const [hydrated, setHydrated] = useState(false)

  // Cargar desde localStorage al montar
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) setItems(JSON.parse(saved))
    } catch {}
    setHydrated(true)
  }, [])

  // Guardar en localStorage cuando cambia
  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {}
  }, [items, hydrated])

  const add = useCallback((p: Producto, v: Variante) => {
    setItems(prev => {
      if (prev.some(i => i.producto.id === p.id)) return prev
      return [...prev, { producto: p, variante: v }]
    })
  }, [])

  const remove = useCallback((id: string) => {
    setItems(prev => prev.filter(i => i.producto.id !== id))
  }, [])

  const toggle = useCallback((p: Producto, v: Variante) => {
    setItems(prev => {
      if (prev.some(i => i.producto.id === p.id)) {
        return prev.filter(i => i.producto.id !== p.id)
      }
      return [...prev, { producto: p, variante: v }]
    })
  }, [])

  const clear = useCallback(() => setItems([]), [])
  const has = useCallback((id: string) => items.some(i => i.producto.id === id), [items])

  return (
    <WishlistContext.Provider value={{ items, add, remove, toggle, clear, has }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  return useContext(WishlistContext)
}
