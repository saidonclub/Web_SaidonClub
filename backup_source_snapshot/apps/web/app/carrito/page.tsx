import React from "react";
import Link from "next/link";
import { ShoppingBag, ShieldCheck, ArrowLeft } from "lucide-react";
import styles from "./Carrito.module.css";
import { prisma } from "@saidonclub/database";
import { createClient } from "@/utils/supabase/server";
import CartItemRow from "./CartItemRow";
import CheckoutButton from "./CheckoutButton";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Carrito de Compras | SaidonClub",
  description:
    "Revisa tu carrito de compras en SaidonClub. Productos premium a precios de importador con envío a todo Ecuador.",
  robots: { index: false, follow: false },
};

async function getCart() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  return await prisma.cart.findUnique({
    where: { userId: user.id },
    include: {
      items: {
        include: {
          product: {
            include: {
              category: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  type: true,
                  description: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export default async function CarritoPage() {
  const cart = await getCart();
  const items = cart?.items || [];

  const subtotal = items.reduce((acc, item) => {
    return (
      acc +
      (item.product ? Number(item.product.priceSaidon) * item.quantity : 0)
    );
  }, 0);

  const totalPoints = items.reduce((acc, item) => {
    return (
      acc +
      (item.product ? Number(item.product.pointsEarned) * item.quantity : 0)
    );
  }, 0);

  const FREE_SHIPPING_THRESHOLD = 50; // Pedido mínimo para envío gratis
  const SHIPPING_COST = 5.99;
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const remainingForFreeShipping = FREE_SHIPPING_THRESHOLD - subtotal;
  const total = subtotal + shipping;

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Tu Carrito</h1>

{items.length > 0 ? (
          <div className={styles.layout}>
            <div className={styles.cartList}>
              {items.map((item) => (
                <CartItemRow
                  key={item.id}
                  item={{
                    id: item.id,
                    quantity: item.quantity,
                    options: item.options,
                    product: {
                      id: item.product!.id,
                      name: item.product!.name,
                      priceSaidon: Number(item.product!.priceSaidon),
                      images: item.product!.images,
                      category: { name: item.product!.category.name },
                    },
                  }}
                />
              ))}
            </div>

            <aside className={styles.summary}>
              <h2 className={styles.summaryTitle}>Resumen de Orden</h2>

              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              <div className={styles.summaryRow}>
                <span>Envío</span>
                <span>
                  {shipping === 0 ? "GRATIS" : `$${shipping.toFixed(2)}`}
                </span>
              </div>

              {remainingForFreeShipping > 0 && (
                <div className={styles.freeShippingBanner}>
                  <span>
                    🚚 ¡Añade ${remainingForFreeShipping.toFixed(2)} más para
                    envío{" "}
                  </span>
                  <strong>GRATIS!</strong>
                </div>
              )}

              {shipping === 0 && (
                <div className={styles.freeShippingBadge}>
                  ✓ Envío gratis aplicado
                </div>
              )}

              <div className={styles.summaryTotal}>
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <div className={styles.pointsEarned}>
                Ganarás {totalPoints.toFixed(2)} puntos con esta compra
              </div>

              <CheckoutButton />

              <Link href="/productos" className={styles.continueLink}>
                <ArrowLeft size={16} />
                Seguir Comprando
              </Link>

              <div className={styles.secureBadge}>
                <ShieldCheck size={16} color="var(--clr-orange)" />
                Compra 100% Segura
              </div>
            </aside>
          </div>
        ) : (
          <div className={styles.emptyCart}>
            <div className={styles.emptyIconWrapper}>
              <ShoppingBag size={60} className={styles.emptyIcon} />
            </div>
            <h2 className={styles.emptyTitle}>Tu carrito está vacío</h2>
            <p className={styles.emptySubtitle}>
              Parece que aún no has añadido productos. Explora nuestro marketplace y descubre ofertas exclusivas.
            </p>
            <Link href="/productos" className={styles.shopBtn}>
              <ShoppingBag size={20} />
              Explorar Productos
            </Link>

            <div className={styles.emptyFeatured}>
              <h3>Productos populares</h3>
              <div className={styles.emptyFeaturedGrid}>
                {/* Placeholder for featured products - to be populated dynamically */}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
