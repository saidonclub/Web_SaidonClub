// ============================================================
// COMPONENT: Motivation Section
// PURPOSE: MLM motivation with ranking and rewards info
// ============================================================

import styles from "./MotivationSection.module.css";
import Image from "next/image";
import Link from "next/link";
import { Gem, Trophy, Zap } from "lucide-react";

export default function MotivationSection() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <span className={styles.eyebrow}>TOMA EL CONTROL</span>
          <h2 className={styles.title}>
            ¿Cómo quieres mejorar tu experiencia en SaidonClub?
          </h2>
          <p className={styles.subtitle}>
            En el corazón de la nueva economía ecuatoriana, hemos creado tres
            caminos para que cada familia alcance su máximo potencial. Elige el
            tuyo.
          </p>
        </div>

        <div className={styles.grid}>
          {/* Card 1: Compradores */}
          <div className={styles.card}>
            <div className={styles.imageWrapper}>
              <Image
                src="/images/saidon-client-luxury.png"
                alt="Consumo Inteligente SaidonClub"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className={styles.image}
              />
              <div className={styles.overlay} />
            </div>
            <div className={styles.content}>
              <div className={styles.iconWrapper}>
                <Gem size={28} />
              </div>
              <h3>Tu Consumo, Tu Poder</h3>
              <p>
                Deja de ser solo un comprador. Aquí, tu consumo diario se
                se convierte en beneficios reales. Accede a
                precios de importador en las marcas que amas y servicios de
                confianza con sello ecuatoriano. Porque ahorrar con inteligencia
                es la forma más sabia de ganar.
              </p>

              <div className={styles.quote}>
                &quot;Antes el dinero se me escapaba de las manos en compras sin
                sentido. Ahora, cada centavo que gasto en SaidonClub vuelve a mí
                en forma de ahorro y beneficios. Es comprar con la mente, no
                solo con el impulso.&quot;
                <span>— Elena M., Clienta Smart en Quito</span>
              </div>

              <Link href="/productos" className={styles.actionLink}>
                Descubrir privilegios ➔
              </Link>
            </div>
          </div>

          {/* Card 2: Profesionales */}
          <div className={styles.card}>
            <div className={styles.imageWrapper}>
              <Image
                src="/images/saidon-pro-office.png"
                alt="Profesional Elite SaidonClub"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className={styles.image}
              />
              <div className={styles.overlay} />
            </div>
            <div className={styles.content}>
              <div className={styles.iconWrapper}>
                <Trophy size={28} />
              </div>
              <h3>Tu Talento, Tu Marca</h3>
              <p>
                Eres un experto en lo que haces y Ecuador merece conocerte.
                SaidonClub es la vitrina premium que conecta tu profesionalismo
                con una comunidad que valora la calidad sobre el precio.
                Olvídate de buscar clientes; nosotros los traemos a tu puerta
                digital.
              </p>

              <div className={styles.quote}>
                &quot;Encontré un ecosistema donde mi talento no es un
                &quot;commodity&quot;. Aquí conecto con clientes que valoran la
                excelencia y la seguridad institucional. Mi negocio finalmente
                escaló al nivel que siempre soñé.&quot;
                <span>— Ing. Marcos V., Proveedor Estratégico</span>
              </div>

              <Link href="/proveedores" className={styles.actionLink}>
                Certificar mi talento ➔
              </Link>
            </div>
          </div>

          {/* Card 3: Socios Emprendedores */}
          <div className={styles.card}>
            <div className={styles.imageWrapper}>
              <Image
                src="/images/saidon-partner-success.png"
                alt="Socio Emprendedor SaidonClub"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className={styles.image}
              />
              <div className={styles.overlay} />
            </div>
            <div className={styles.content}>
              <div className={styles.iconWrapper}>
                <Zap size={28} />
              </div>
              <h3>Tu Red, Tu Comunidad</h3>
              <p>
                No camines solo. Construye un equipo de visionarios y genera
                recompensas compartidas. Con nuestro sistema de recompensas,
                cada recomendación genera beneficios para ti y tu
                comunidad. Es hora de construir un futuro sólido para tu
                familia.
              </p>

              <div className={styles.quote}>
                &quot;La verdadera tranquilidad no es solo cuánto ganas, sino
                cómo optimizas tus gastos. Con el programa de recompensas de
                SaidonClub, construimos un fondo de beneficios que nos da el
                respaldo que nuestra familia merece.&quot;
                <span>— Ricardo y Sofia, Socios Fundadores</span>
              </div>

              <Link href="/membresias#beneficios" className={styles.actionLink}>
                Ver programa de recompensas ➔
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
