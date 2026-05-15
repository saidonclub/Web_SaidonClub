import type { Metadata } from "next";
import styles from "./Privacidad.module.css";

export const metadata: Metadata = {
  title: "Política de Privacidad | SaidonClub",
  description:
    "Conoce cómo SaidonClub recopila, usa y protege tus datos personales conforme a la Ley Orgánica de Protección de Datos Personales del Ecuador.",
};

export default function PrivacidadPage() {
  const lastUpdate = "1 de mayo de 2026";

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1>Política de Privacidad</h1>
        <p>Última actualización: {lastUpdate}</p>
      </div>

      <div className={styles.content}>
        <section className={styles.section}>
          <h2>1. Responsable del Tratamiento</h2>
          <p>
            SaidonClub (en adelante, &quot;nosotros&quot; o &quot;la Empresa&quot;) es responsable
            del tratamiento de sus datos personales. Operamos bajo la
            legislación ecuatoriana, específicamente la <strong>Ley Orgánica
            de Protección de Datos Personales (LOPDP)</strong> y su reglamento.
          </p>
          <ul>
            <li><strong>Empresa:</strong> SaidonClub OS</li>
            <li><strong>Email de privacidad:</strong> privacidad@saidonclub.com</li>
            <li><strong>Teléfono:</strong> +593 98 378 8477</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>2. Datos que Recopilamos</h2>
          <p>Recopilamos los siguientes tipos de información:</p>
          <ul>
            <li><strong>Datos de identificación:</strong> Nombre, cédula/pasaporte, fecha de nacimiento.</li>
            <li><strong>Datos de contacto:</strong> Email, teléfono, dirección de entrega.</li>
            <li><strong>Datos financieros:</strong> Información de pago procesada de forma segura por Stripe (nunca almacenamos números de tarjeta completos).</li>
            <li><strong>Datos de uso:</strong> Historial de compras, interacciones con la plataforma, preferencias.</li>
            <li><strong>Datos técnicos:</strong> Dirección IP, tipo de dispositivo, navegador y cookies de sesión.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>3. Finalidad del Tratamiento</h2>
          <p>Tratamos sus datos para:</p>
          <ul>
            <li>Gestionar su cuenta y membresía en SaidonClub.</li>
            <li>Procesar compras, pagos y devoluciones.</li>
            <li>Administrar el programa de recompensas y referidos.</li>
            <li>Enviar comunicaciones transaccionales y, con su consentimiento, comerciales.</li>
            <li>Cumplir con obligaciones legales y regulatorias.</li>
            <li>Prevenir fraudes y garantizar la seguridad de la plataforma.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>4. Base Legal del Tratamiento</h2>
          <p>El tratamiento de sus datos se fundamenta en:</p>
          <ul>
            <li><strong>Ejecución contractual:</strong> Para cumplir el contrato de membresía y transacciones.</li>
            <li><strong>Consentimiento:</strong> Para comunicaciones de marketing (puede retirarlo en cualquier momento).</li>
            <li><strong>Interés legítimo:</strong> Para prevención de fraude y mejora del servicio.</li>
            <li><strong>Obligación legal:</strong> Para cumplir con el SRI y demás autoridades ecuatorianas.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>5. Cookies y Tecnologías de Seguimiento</h2>
          <p>
            Utilizamos cookies esenciales para el funcionamiento de la
            plataforma (sesión de usuario, carrito de compras) y cookies
            analíticas para mejorar la experiencia. No compartimos datos de
            cookies con terceros para fines publicitarios sin su consentimiento.
          </p>
        </section>

        <section className={styles.section}>
          <h2>6. Compartición de Datos</h2>
          <p>
            SaidonClub no vende sus datos personales. Podemos compartirlos con:
          </p>
          <ul>
            <li><strong>Proveedores de servicios:</strong> Stripe (pagos), Supabase (base de datos), Resend (email). Todos con acuerdos de procesamiento de datos.</li>
            <li><strong>Autoridades:</strong> Cuando sea requerido por ley ecuatoriana.</li>
            <li><strong>Proveedores del marketplace:</strong> Solo los datos mínimos necesarios para cumplir el servicio contratado.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>7. Sus Derechos (LOPDP)</h2>
          <p>Conforme a la Ley Orgánica de Protección de Datos Personales, usted tiene derecho a:</p>
          <ul>
            <li><strong>Acceso:</strong> Solicitar una copia de sus datos personales.</li>
            <li><strong>Rectificación:</strong> Corregir datos inexactos o incompletos.</li>
            <li><strong>Supresión:</strong> Eliminar sus datos cuando ya no sean necesarios.</li>
            <li><strong>Portabilidad:</strong> Recibir sus datos en formato estructurado.</li>
            <li><strong>Oposición:</strong> Oponerse al tratamiento basado en interés legítimo.</li>
          </ul>
          <p>
            Para ejercer estos derechos, escríbanos a{" "}
            <a href="mailto:privacidad@saidonclub.com">privacidad@saidonclub.com</a>.
            Responderemos en un máximo de 15 días hábiles.
          </p>
        </section>

        <section className={styles.section}>
          <h2>8. Seguridad de los Datos</h2>
          <p>
            Implementamos medidas técnicas y organizativas de seguridad,
            incluyendo cifrado SSL/TLS, autenticación de dos factores (2FA),
            control de acceso basado en roles (RBAC) y auditorías de seguridad
            periódicas para proteger sus datos contra accesos no autorizados.
          </p>
        </section>

        <section className={styles.section}>
          <h2>9. Retención de Datos</h2>
          <p>
            Conservamos sus datos mientras mantenga una cuenta activa en
            SaidonClub. Tras la eliminación de la cuenta, conservamos datos
            fiscales por el período requerido por el SRI (7 años) y eliminamos
            el resto en un plazo máximo de 90 días.
          </p>
        </section>

        <section className={styles.section}>
          <h2>10. Contacto y Reclamaciones</h2>
          <p>
            Si tiene dudas sobre esta política o desea presentar una
            reclamación, contáctenos en{" "}
            <a href="mailto:privacidad@saidonclub.com">
              privacidad@saidonclub.com
            </a>
            . También puede presentar una queja ante la{" "}
            <strong>Autoridad de Protección de Datos Personales</strong> del
            Ecuador.
          </p>
        </section>
      </div>
    </div>
  );
}
