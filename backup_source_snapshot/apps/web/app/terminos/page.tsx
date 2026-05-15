/* eslint-disable react/no-unescaped-entities */
import type { Metadata } from "next";
import styles from "./Terminos.module.css";

export const metadata: Metadata = {
  title: "Términos y Condiciones | SaidonClub",
  description:
    "Lee los términos y condiciones de uso de la plataforma SaidonClub. Conoce tus derechos, obligaciones y la normativa que regula el uso de nuestros servicios.",
};

export default function TerminosPage() {
  const lastUpdate = "1 de mayo de 2026";

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1>Términos y Condiciones</h1>
        <p>Última actualización: {lastUpdate}</p>
      </div>

      <div className={styles.content}>
        <section className={styles.section}>
          <h2>1. Aceptación de los Términos</h2>
          <p>
            Al acceder y utilizar la plataforma SaidonClub (en adelante,
            "la Plataforma"), usted acepta quedar vinculado por estos Términos
            y Condiciones, nuestra Política de Privacidad y todas las leyes y
            regulaciones aplicables en la República del Ecuador. Si no está de
            acuerdo con alguno de estos términos, tiene prohibido usar o
            acceder a este sitio.
          </p>
        </section>

        <section className={styles.section}>
          <h2>2. Descripción del Servicio</h2>
          <p>
            SaidonClub es una plataforma de marketplace colaborativo que
            permite a sus miembros comprar productos premium, contratar
            servicios profesionales y participar en un programa de recompensas
            y referidos. La plataforma opera bajo la legislación comercial
            ecuatoriana y cumple con las disposiciones de la Ley de Comercio
            Electrónico, Firmas Electrónicas y Mensajes de Datos.
          </p>
        </section>

        <section className={styles.section}>
          <h2>3. Registro y Membresías</h2>
          <p>
            Para acceder a las funcionalidades completas de SaidonClub, el
            usuario debe crear una cuenta proporcionando información veraz,
            actualizada y completa. SaidonClub ofrece los siguientes tipos
            de membresía:
          </p>
          <ul>
            <li>
              <strong>Cliente (Gratuito):</strong> Acceso a catálogo público
              con precios estándar.
            </li>
            <li>
              <strong>Socio Preferente:</strong> Descuentos exclusivos,
              cashback y acceso a servicios de salud.
            </li>
            <li>
              <strong>Pionero:</strong> Todos los beneficios anteriores más
              acceso al programa de regalías y construcción de red.
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>4. Programa de Recompensas y Regalías</h2>
          <p>
            SaidonClub opera un programa de recompensas legítimo basado en el
            consumo real de bienes y servicios. Los ingresos por referidos
            están directamente vinculados a la actividad comercial de la red y
            no constituyen un esquema piramidal. El programa cumple con las
            disposiciones del Código de Comercio ecuatoriano.
          </p>
        </section>

        <section className={styles.section}>
          <h2>5. Transacciones y Pagos</h2>
          <p>
            Todos los precios en la plataforma se expresan en dólares
            americanos (USD) e incluyen IVA del 15% según la normativa
            tributaria ecuatoriana vigente. SaidonClub utiliza procesadores
            de pago certificados (Stripe) que cumplen con el estándar PCI DSS.
          </p>
        </section>

        <section className={styles.section}>
          <h2>6. Propiedad Intelectual</h2>
          <p>
            Todo el contenido de la plataforma, incluyendo logos, textos,
            imágenes, diseños y código fuente, es propiedad exclusiva de
            SaidonClub o sus licenciantes y está protegido por las leyes de
            propiedad intelectual ecuatorianas e internacionales.
          </p>
        </section>

        <section className={styles.section}>
          <h2>7. Limitación de Responsabilidad</h2>
          <p>
            SaidonClub no será responsable por daños indirectos, incidentales
            o consecuentes derivados del uso o la imposibilidad de uso de la
            plataforma. La responsabilidad máxima de SaidonClub no excederá
            el monto pagado por el usuario en los últimos 3 meses.
          </p>
        </section>

        <section className={styles.section}>
          <h2>8. Ley Aplicable y Jurisdicción</h2>
          <p>
            Estos términos se rigen por las leyes de la República del Ecuador.
            Cualquier disputa se someterá a los tribunales competentes de la
            ciudad de Loja, Ecuador, salvo acuerdo expreso de las partes en
            contrario.
          </p>
        </section>

        <section className={styles.section}>
          <h2>9. Contacto</h2>
          <p>
            Para consultas sobre estos Términos, comunícate con nosotros en:
            <br />
            <strong>Email:</strong>{" "}
            <a href="mailto:legal@saidonclub.com">legal@saidonclub.com</a>
            <br />
            <strong>Teléfono:</strong>{" "}
            <a href="tel:+593983788477">+593 98 378 8477</a>
          </p>
        </section>
      </div>
    </div>
  );
}

