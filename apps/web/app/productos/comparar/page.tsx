// ============================================================
// PAGE: Compare Products
// PURPOSE: Full comparison page with table and product cards
// ============================================================

import { Metadata } from "next";
import CompareTable from "@/components/marketplace/CompareTable";
import styles from "./compare.module.css";

export const metadata: Metadata = {
  title: "Comparar Productos | SaidonClub",
  description: "Compara productos side by side para tomar la mejor decisión de compra",
};

export default function ComparePage() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <CompareTable />
      </div>
    </main>
  );
}