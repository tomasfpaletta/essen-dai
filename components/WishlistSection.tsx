'use client'
import { WishlistProvider } from '@/lib/wishlist-context'
import Productos from './Productos'
import ListaInteres from './ListaInteres'

export default function WishlistSection() {
  return (
    <WishlistProvider>
      <Productos />
      <ListaInteres />
    </WishlistProvider>
  )
}
