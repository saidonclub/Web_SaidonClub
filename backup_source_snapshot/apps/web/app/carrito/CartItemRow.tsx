'use client'

import React, { useState, useTransition } from 'react'
import { Plus, Minus, Trash2 } from 'lucide-react'
import styles from './Carrito.module.css'
import { removeFromCart, updateQuantity } from './actions'
import { useCart } from '@/context/CartContext'
import Image from 'next/image'

interface CartItemData {
  id: string
  quantity: number
  options?: unknown
  product: {
    id: string
    name: string
    priceSaidon: number
    images: string[]
    category: { name: string }
  }
}

interface CartItemRowProps {
  item: CartItemData
}

export default function CartItemRow({ item }: CartItemRowProps) {
  const [isPending, startTransition] = useTransition()
  const [optimisticQty, setOptimisticQty] = useState(item.quantity)
  const { refreshCart } = useCart()

  const handleUpdateQuantity = async (newQty: number) => {
    if (newQty < 1) return
    setOptimisticQty(newQty)
    startTransition(async () => {
      await updateQuantity(item.id, newQty)
      refreshCart()
    })
  }

  const handleRemove = async () => {
    startTransition(async () => {
      await removeFromCart(item.id)
      refreshCart()
    })
  }
  
  // Format options
  const formattedOptions = React.useMemo(() => {
    if (!item.options) return []
    try {
      const parsed = typeof item.options === 'string' ? JSON.parse(item.options) : item.options
      return Object.entries(parsed).map(([key, value]) => `${key}: ${value}`)
    } catch {
      return []
    }
  }, [item.options])

  return (
    <div className={styles.cartItem} style={{ opacity: isPending ? 0.6 : 1 }}>
      <Image 
        src={item.product.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80'} 
        alt={item.product.name} 
        width={80}
        height={80}
        className={styles.itemImage}
      />
      
      <div className={styles.itemDetails}>
        <span className={styles.itemCategory}>{item.product.category.name}</span>
        <h3 className={styles.itemName}>{item.product.name}</h3>
        {formattedOptions.length > 0 && (
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
            {formattedOptions.map(opt => (
              <span key={opt} style={{ background: '#1e293b', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>{opt}</span>
            ))}
          </div>
        )}
        
        <div className={styles.quantityControl}>
          <button 
            className={styles.qtyBtn} 
            onClick={() => handleUpdateQuantity(optimisticQty - 1)}
            disabled={isPending || optimisticQty <= 1}
          >
            <Minus size={14} />
          </button>
          <span className={styles.qtyValue}>{optimisticQty}</span>
          <button 
            className={styles.qtyBtn} 
            onClick={() => handleUpdateQuantity(optimisticQty + 1)}
            disabled={isPending}
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      <div className={styles.itemPrice}>
        <span className={styles.price}>${(item.product.priceSaidon * optimisticQty).toFixed(2)}</span>
        <button className={styles.removeBtn} onClick={handleRemove} disabled={isPending}>
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  )
}
