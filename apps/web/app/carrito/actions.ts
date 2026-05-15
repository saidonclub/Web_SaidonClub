'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import { calculateRoyalties, processProviderPayments } from '@saidonclub/mlm-engine'
import { config } from '@saidonclub/config-engine'

async function getUserId() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user?.id
}

export async function addToCart(productId: string, quantity: number = 1, options: Record<string, string> = {}) {
  const userId = await getUserId()
  if (!userId) return { error: 'Inicia sesión para añadir al carrito' }

  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    })

    if (!product) return { error: 'Producto no encontrado' }

    // Get or create cart
    let cart = await prisma.cart.findUnique({
      where: { userId },
    })

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
      })
    }

    // Since Prisma JSON equals can be strict, we fetch items and compare
    const existingItems = await prisma.cartItem.findMany({
      where: {
        cartId: cart.id,
        productId,
      },
    })

    const existingItem = existingItems.find(item => {
      const itemOptions = item.options as Record<string, string> || {}
      // Check if both have same keys and values
      const keys1 = Object.keys(options)
      const keys2 = Object.keys(itemOptions)
      if (keys1.length !== keys2.length) return false
      return keys1.every(key => options[key] === itemOptions[key])
    })

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      })
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
          priceAtAdd: product.priceSaidon,
          options: options,
        },
      })
    }

    revalidatePath('/carrito')
    return { success: true }
  } catch (error) {
    console.error('Error adding to cart:', error)
    return { error: 'Error al añadir al carrito' }
  }
}

export async function addServiceToCart(serviceId: string, quantity: number = 1, options: Record<string, string> = {}) {
  const userId = await getUserId()
  if (!userId) return { error: 'Inicia sesión para contratar servicios' }

  try {
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    })

    if (!service) return { error: 'Servicio no encontrado' }

    // Get or create cart
    let cart = await prisma.cart.findUnique({
      where: { userId },
    })

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
      })
    }

    const existingItems = await prisma.cartItem.findMany({
      where: {
        cartId: cart.id,
        serviceId,
      },
    })

    const existingItem = existingItems.find(item => {
      const itemOptions = item.options as Record<string, string> || {}
      const keys1 = Object.keys(options)
      const keys2 = Object.keys(itemOptions)
      if (keys1.length !== keys2.length) return false
      return keys1.every(key => options[key] === itemOptions[key])
    })

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      })
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          serviceId,
          quantity,
          priceAtAdd: service.priceSaidon,
          options: options,
        },
      })
    }

    revalidatePath('/carrito')
    return { success: true }
  } catch (error) {
    console.error('Error adding service to cart:', error)
    return { error: 'Error al añadir al carrito' }
  }
}

export async function updateQuantity(itemId: string, quantity: number) {
  const userId = await getUserId()
  if (!userId) return { error: 'No autorizado' }

  try {
    if (quantity <= 0) {
      await prisma.cartItem.delete({
        where: { id: itemId },
      })
    } else {
      await prisma.cartItem.update({
        where: { id: itemId },
        data: { quantity },
      })
    }

    revalidatePath('/carrito')
    return { success: true }
  } catch (error) {
    console.error('Error updating quantity:', error)
    return { error: 'Error al actualizar cantidad' }
  }
}

export async function removeFromCart(itemId: string) {
  const userId = await getUserId()
  if (!userId) return { error: 'No autorizado' }

  try {
    await prisma.cartItem.delete({
      where: { id: itemId },
    })

    revalidatePath('/carrito')
    return { success: true }
  } catch (error) {
    console.error('Error removing from cart:', error)
    return { error: 'Error al eliminar producto' }
  }
}
export async function getCartCount() {
  const userId = await getUserId()
  if (!userId) return 0

  try {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        _count: {
          select: { items: true }
        }
      }
    })

    if (!cart) return 0

    const items = await prisma.cartItem.findMany({
      where: { cartId: cart.id },
      select: { quantity: true }
    })

    return items.reduce((acc, item) => acc + item.quantity, 0)
  } catch (error) {
    console.error('Error getting cart count:', error)
    return 0
  }
}

export async function checkout(pointsToUse: number = 0) {
  const userId = await getUserId()
  if (!userId) return { error: 'No autorizado' }

  try {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
            service: true
          }
        }
      }
    })

    if (!cart || cart.items.length === 0) {
      return { error: 'El carrito está vacío' }
    }

    // Validate Points if used
    if (pointsToUse > 0) {
      const pointsLedger = await prisma.pointsLedger.aggregate({
        where: { userId },
        _sum: { amount: true }
      })
      const availablePoints = Number(pointsLedger._sum.amount || 0)
      
      if (pointsToUse > availablePoints) {
        return { error: 'No tienes suficientes puntos disponibles' }
      }
    }

    const subtotal = cart.items.reduce((acc, item) => {
      const price = item.product ? Number(item.product.priceSaidon) : (item.service ? Number(item.service.priceSaidon) : 0)
      return acc + (price * item.quantity)
    }, 0)

    // Calculate points discount (using exchange rate from config)
    const exchangeRate = await config.get<number>('POINTS_EXCHANGE_RATE', 100);
    const discount = pointsToUse / exchangeRate;
    const finalAmount = Math.max(0, subtotal - discount);

    const totalPoints = cart.items.reduce((acc, item) => {
      const points = item.product ? Number(item.product.pointsEarned) : (item.service ? Number(item.service.pointsEarned) : 0)
      return acc + (points * item.quantity)
    }, 0)

    // Validate Stock (only for products)
    for (const item of cart.items) {
      if (item.product && item.product.stock < item.quantity) {
        return { error: `Stock insuficiente para ${item.product.name}. Solo quedan ${item.product.stock} unidades.` }
      }
    }

    // Create Order and update stock in a transaction
    const order = await prisma.$transaction(async (tx) => {
      // 1. Create the order
      const newOrder = await tx.order.create({
        data: {
          userId,
          status: 'PENDING',
          totalAmount: finalAmount,
          pointsUsed: pointsToUse,
          pointsEarned: totalPoints,
          paymentMethod: pointsToUse > 0 && finalAmount === 0 ? 'POINTS' : 'STRIPE',
          paymentStatus: finalAmount === 0 ? 'COMPLETED' : 'PENDING',
          items: {
            create: cart.items.map(item => ({
              productId: item.productId,
              serviceId: item.serviceId,
              quantity: item.quantity,
              unitPrice: item.product ? item.product.priceSaidon : (item.service ? item.service.priceSaidon : 0),
              totalPrice: (item.product ? Number(item.product.priceSaidon) : (item.service ? Number(item.service.priceSaidon) : 0)) * item.quantity,
              options: item.options || {},
            }))
          }
        }
      })

      // 2. Update stock for each product
      for (const item of cart.items) {
        if (item.product) {
          const updatedProduct = await tx.product.update({
            where: { id: item.productId! },
            data: {
              stock: {
                decrement: item.quantity
              }
            }
          })
          
          if (updatedProduct.stock < 0) {
            throw new Error(`Stock insuficiente para ${item.product.name}.`);
          }
        }
      }

      // 3. Deduct points from ledger if used
      if (pointsToUse > 0) {
        const now = new Date();
        await tx.pointsLedger.create({
          data: {
            userId,
            amount: -pointsToUse,
            sourceType: 'REDEMPTION',
            orderId: newOrder.id,
            cycleMonth: now.getMonth() + 1,
            cycleYear: now.getFullYear(),
            description: `Uso de puntos en orden ${newOrder.id}`,
          }
        })
      }

      // 4. Calculate and generate Royalties within the same transaction
      try {
        await calculateRoyalties(newOrder.id, tx)
      } catch (e) {
        console.error('Error calculating royalties for order', newOrder.id, e)
        // Re-throw if funds are insufficient, blocking the checkout
        throw e
      }

      // 4. Process payments to providers
      try {
        await processProviderPayments(newOrder.id, tx);
      } catch (e) {
        console.error('Error processing provider payments for order', newOrder.id, e);
        throw e;
      }

      return newOrder
    })

    // Clear Cart
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id }
    })

    revalidatePath('/carrito')
    revalidatePath('/dashboard')
    
    return { success: true, orderId: order.id }
  } catch (error: unknown) {
    console.error('Error during checkout:', error)
    const message = error instanceof Error ? error.message : ''
    if (message.includes('Stock insuficiente') || message.includes('Royalties')) {
      return { error: message }
    }
    return { error: 'Error al procesar el pedido' }
  }
}

export async function clearCartUser() {
  const userId = await getUserId()
  if (!userId) return { error: 'No autorizado' }

  try {
    const cart = await prisma.cart.findUnique({
      where: { userId }
    })

    if (cart) {
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id }
      })
    }

    revalidatePath('/carrito')
    return { success: true }
  } catch (error) {
    console.error('Error clearing cart:', error)
    return { error: 'Error al vaciar el carrito' }
  }
}
