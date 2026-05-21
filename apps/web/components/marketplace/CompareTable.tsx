// ============================================================
// COMPONENT: Compare Table
// PURPOSE: Display comparison table for selected products
// ============================================================

"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ShoppingCart, Star, CheckCircle, XCircle } from "lucide-react";
import { useCompareContext } from "@/contexts/CompareContext";
import { calculateDiscount } from "@/lib/data/marketplace";
import CompareSelector from "./CompareSelector";
import styles from "./CompareTable.module.css";

interface AttributeConfig {
  key: string;
  label: string;
  type: "text" | "currency" | "points" | "rating" | "number" | "stock" | "boolean" | "nested";
  nestedKey?: string;
  unit?: string;
}

const ATTRIBUTES: AttributeConfig[] = [
  { key: "image", label: "Imagen", type: "text" },
  { key: "name", label: "Producto", type: "text" },
  { key: "category", label: "Categoría", type: "nested", nestedKey: "name" },
  { key: "brand", label: "Marca", type: "text" },
  { key: "pricePVP", label: "Precio PVP", type: "currency" },
  { key: "priceSaidon", label: "Precio Club", type: "currency" },
  { key: "discount", label: "Descuento", type: "text" },
  { key: "pointsEarned", label: "Puntos", type: "points" },
  { key: "rating", label: "Valoración", type: "rating" },
  { key: "reviewsCount", label: "Reseñas", type: "number" },
  { key: "stock", label: "Disponibilidad", type: "stock" },
  { key: "isVerified", label: "Verificado", type: "boolean" },
  { key: "description", label: "Descripción", type: "text" },
];

export default function CompareTable() {
  const { compareItems, removeFromCompare, clearCompare } = useCompareContext();

  if (compareItems.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>⚖️</div>
        <h3>No hay productos para comparar</h3>
        <p>Busca productos abajo para empezar a comparar</p>
        <div className={styles.emptySelector}>
          <CompareSelector />
        </div>
      </div>
    );
  }

  const getNestedValue = (obj: Record<string, unknown>, path: string): unknown => {
    return path.split(".").reduce<unknown>((acc: unknown, part: string) => {
      if (acc && typeof acc === 'object') {
        return (acc as Record<string, unknown>)[part];
      }
      return undefined;
    }, obj);
  };

  const renderCellValue = (item: Record<string, unknown>, attr: AttributeConfig) => {
    const itemAny = item as Record<string, unknown>;
    switch (attr.type) {
      case "currency":
        const val = Number(getNestedValue(itemAny, attr.key) || 0);
        return `$${val.toFixed(2)}`;
      
      case "points":
        const points = Number(getNestedValue(itemAny, attr.key) || 0);
        return `${points.toLocaleString()} pts`;
      
      case "rating":
        const rating = Number(getNestedValue(itemAny, attr.key) || 0);
        const maxRating = 5;
        const fullStars = Math.round(rating);
        return (
          <div className={styles.ratingCell}>
            {Array.from({ length: maxRating }, (_, i) => (
              <Star
                key={i}
                size={16}
                className={i < fullStars ? styles.starFilled : styles.starEmpty}
              />
            ))}
            <span>({rating.toFixed(1)})</span>
          </div>
        );
      
      case "number":
        const num = Number(getNestedValue(itemAny, attr.key) || 0);
        return num.toLocaleString();
      
      case "stock":
        const stock = Number(getNestedValue(itemAny, attr.key) || 0);
        if (stock <= 0)
          return <span className={styles.noStock}>Sin stock</span>;
        if (stock < 10)
          return <span className={styles.lowStock}>Quedan {stock}</span>;
        return <span className={styles.inStock}>Disponible</span>;
      
      case "boolean":
        const bool = Boolean(getNestedValue(itemAny, attr.key) || false);
        return bool ? <CheckCircle color="green" size={18} /> : <XCircle color="red" size={18} />;
      
      case "text":
      default:
        if (attr.key === "image") {
          const images = itemAny.images as Array<string> | undefined;
          const img = images?.[0];
          if (!img) return <span className={styles.noImage}>Sin imagen</span>;
          return (
            <div className={styles.imageCell}>
              <Image
                src={img}
                alt={(itemAny.name as string) || ''}
                width={80}
                height={80}
                style={{ objectFit: "contain" }}
              />
            </div>
          );
        }
        if (attr.key === "discount") {
          const pvp = Number((itemAny as Record<string, unknown>).pricePVP || 0);
          const saidon = Number((itemAny as Record<string, unknown>).priceSaidon || 0);
          const disc = calculateDiscount(pvp, saidon);
          return disc > 0 ? (
            <span className={styles.discountBadge}>-{disc}%</span>
          ) : "-";
        }
        if (attr.key === "description") {
          const desc = (getNestedValue(itemAny, attr.key) as string) || "";
          return desc ? (
            <span className={styles.descriptionCell} title={desc}>
              {desc.substring(0, 100)}{desc.length > 100 ? "..." : ""}
            </span>
          ) : "-";
        }
        return (getNestedValue(itemAny, attr.key) as string) || "-";
    }
  };

  const findBestValue = (attr: AttributeConfig): number => {
    if (attr.type === "currency") {
      const values = compareItems.map(item => Number(item.priceSaidon || 0));
      return values.indexOf(Math.min(...values));
    }
    if (attr.type === "rating") {
      const values = compareItems.map(item => Number(item.rating || 0));
      return values.indexOf(Math.max(...values));
    }
    if (attr.type === "points") {
      const values = compareItems.map(item => Number(item.pointsEarned || 0));
      return values.indexOf(Math.max(...values));
    }
    return -1;
  };

  return (
    <div className={styles.compareContainer}>
      <div className={styles.header}>
        <h2 className={styles.title}>Comparar Productos</h2>
        <div className={styles.headerActions}>
          <CompareSelector />
          <button onClick={clearCompare} className={styles.clearBtn}>
            Limpiar todo
          </button>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.featureCol}>Característica</th>
              {compareItems.map((item) => (
                <th key={item.id} className={styles.productCol}>
                  <div className={styles.productHeader}>
                    <button 
                      onClick={() => removeFromCompare(item.id)}
                      className={styles.removeBtn}
                      title="Quitar de comparación"
                    >
                      <X size={16} />
                    </button>
                    <Link href={`/productos/${item.slug}`} className={styles.productLink}>
                      <span className={styles.productName}>{item.name}</span>
                    </Link>
                    <div className={styles.productActions}>
                      <Link href={`/productos/${item.slug}`} className={styles.viewBtn}>
                        Ver detalles
                      </Link>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ATTRIBUTES.map((attr) => {
              const bestIdx = findBestValue(attr);
              return (
                <tr key={attr.key}>
                  <td className={styles.featureCell}>{attr.label}</td>
                  {compareItems.map((item, idx) => (
                    <td 
                      key={item.id} 
                      className={`${styles.valueCell} ${idx === bestIdx && bestIdx >= 0 ? styles.bestValue : ""}`}
                    >
                      {renderCellValue(item as unknown as Record<string, unknown>, attr)}
                      {idx === bestIdx && bestIdx >= 0 && attr.type === "currency" && (
                        <span className={styles.bestBadge}>Mejor precio</span>
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className={styles.summary}>
        <h3>Resumen</h3>
        <div className={styles.summaryGrid}>
          {compareItems.map((item) => {
            const pvp = Number(item.pricePVP || 0);
            const saidon = Number(item.priceSaidon || 0);
            const discount = calculateDiscount(pvp, saidon);
            return (
              <div key={item.id} className={styles.summaryCard}>
                <Link href={`/productos/${item.slug}`}>
                  <div className={styles.summaryImage}>
                    {item.images?.[0] ? (
                      <Image
                        src={item.images[0]}
                        alt={item.name}
                        fill
                        style={{ objectFit: "contain" }}
                      />
                    ) : (
                      <span>📦</span>
                    )}
                  </div>
                </Link>
                <div className={styles.summaryInfo}>
                  <h4>{item.name}</h4>
                  <div className={styles.summaryPrices}>
                    <span className={styles.summaryPvp}>${pvp.toFixed(2)}</span>
                    <span className={styles.summarySaidon}>${saidon.toFixed(2)}</span>
                    {discount > 0 && <span className={styles.summaryDiscount}>-{discount}%</span>}
                  </div>
                  <Link href={`/productos/${item.slug}`} className={styles.summaryBuyBtn}>
                    <ShoppingCart size={14} /> Comprar
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}