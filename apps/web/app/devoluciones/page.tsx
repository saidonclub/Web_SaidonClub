import type { Metadata } from "next";
import styles from "./Devoluciones.module.css";

export const metadata: Metadata = {
  title: "Política de Devoluciones | SaidonClub",
  description:
    "Conoce el proceso de devolución, reembolso y garantía de productos y servicios en SaidonClub. Tu satisfacción es nuestra prioridad.",
};

export default function DevolucionesPage() {
  const lastUpdate = "1 de mayo de 2026";

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1>Política de Devoluciones</h1>
        <p>Última actualización: {lastUpdate}</p>
        <div className={styles.guarantee}>
          <span className={styles.guaranteeIcon}>🛡️</span>
          <strong>Garantía SaidonClub: 30 días sin preguntas</strong>
        </div>
      </div>

      <div className={styles.content}>
        <section className={styles.section}>
          <h2>1. Política General</h2>
          <p>
            En SaidonClub queremos que estés 100% satisfecho con cada compra.
            Si por cualquier motivo no estás conforme con tu pedido, tienes
            hasta <strong>30 días calendario</strong> desde la fecha de
            recepción para solicitar una devolución o reembolso completo, sin
            necesidad de explicar el motivo.
          </p>
        </section>

        <section className={styles.section}>
          <h2>2. Condiciones para Devolución de Productos</h2>
          <p>Para que una devolución sea aceptada, el producto debe cumplir:</p>
          <ul>
            <li>Estar en su estado original, sin uso y con empaque intacto.</li>
            <li>Incluir todos sus accesorios, manuales y garantías originales.</li>
            <li>No haber sido personalizado o modificado a pedido del cliente.</li>
            <li>Contar con el comprobante de compra (número de orden).</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>3. Productos No Elegibles para Devolución</h2>
          <ul>
            <li>Productos de higiene personal abiertos (cosméticos, suplementos).</li>
            <li>Artículos digitales o licencias de software descargados.</li>
            <li>Alimentos perecederos y productos frescos.</li>
            <li>Productos dañados por mal uso del cliente.</li>
            <li>Membresías y puntos una vez utilizados.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>4. Devolución de Servicios</h2>
          <p>
            Para servicios profesionales agendados a través del marketplace:
          </p>
          <ul>
            <li>
              <strong>Cancelación con más de 24h de anticipación:</strong>{" "}
              Reembolso completo al método de pago original.
            </li>
            <li>
              <strong>Cancelación con menos de 24h:</strong> Reembolso del 50%
              o reprogramación sin costo.
            </li>
            <li>
              <strong>No show del proveedor:</strong> Reembolso completo
              más $10 USD en créditos SaidonClub.
            </li>
            <li>
              <strong>Servicio insatisfactorio:</strong> Revisión del caso en
              un plazo de 48h y solución garantizada.
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>5. Proceso de Devolución</h2>
          <ol className={styles.orderedList}>
            <li>
              <strong>Paso 1 — Solicitud:</strong> Ingresa a tu dashboard,
              ve a &quot;Mis Pedidos&quot; y selecciona &quot;Solicitar Devolución&quot; en el pedido
              correspondiente. También puedes escribirnos a{" "}
              <a href="mailto:soporte@saidonclub.com">soporte@saidonclub.com</a>.
            </li>
            <li>
              <strong>Paso 2 — Confirmación:</strong> Recibirás un email con
              la guía de devolución y etiqueta de envío prepagada en un plazo
              de 24 horas hábiles.
            </li>
            <li>
              <strong>Paso 3 — Envío:</strong> Empaca el producto y llévalo
              al punto de recolección indicado. Sin costo de envío para ti.
            </li>
            <li>
              <strong>Paso 4 — Inspección:</strong> Inspeccionamos el producto
              en un plazo de 3-5 días hábiles tras recibirlo.
            </li>
            <li>
              <strong>Paso 5 — Reembolso:</strong> Procesamos el reembolso en
              un plazo de 5-10 días hábiles al método de pago original o en
              créditos SaidonClub (procesamiento inmediato si prefieres créditos).
            </li>
          </ol>
        </section>

        <section className={styles.section}>
          <h2>6. Garantías de Productos</h2>
          <p>
            Todos los productos en SaidonClub cuentan con la garantía del
            fabricante. Adicionalmente, ofrecemos:
          </p>
          <ul>
            <li>
              <strong>Garantía SaidonClub (Electrónicos):</strong> 12 meses
              adicionales a la garantía del fabricante.
            </li>
            <li>
              <strong>Garantía de Autenticidad:</strong> Todos los productos
              son 100% originales. Si recibes un producto no auténtico,
              reembolso completo + 20% adicional en créditos.
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>7. Reembolso de Puntos y Créditos</h2>
          <p>
            Los puntos SaidonClub utilizados en una compra devuelta serán
            reinstaurados a tu cuenta en un plazo de 24 horas tras la
            aprobación de la devolución. Los descuentos de membresía aplicados
            en la compra original no son reembolsables en efectivo.
          </p>
        </section>

        <section className={styles.section}>
          <h2>8. Contacto para Devoluciones</h2>
          <p>Nuestro equipo de soporte está disponible 24/7:</p>
          <ul>
            <li>
              <strong>Email:</strong>{" "}
              <a href="mailto:soporte@saidonclub.com">soporte@saidonclub.com</a>
            </li>
            <li>
              <strong>WhatsApp:</strong>{" "}
              <a href="https://wa.me/593983788477" target="_blank" rel="noopener noreferrer">
                +593 98 378 8477
              </a>
            </li>
            <li>
              <strong>Centro de Ayuda:</strong>{" "}
              <a href="/ayuda">saidonclub.com/ayuda</a>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
