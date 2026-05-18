"use client";

import React, { useState, useMemo } from 'react';
import styles from './Ayuda.module.css';
import { 
  ShieldCheck, 
  ShoppingBag, 
  Zap, 
  Lock, 
  Search, 
  ChevronDown, 
  ChevronRight,
  MessageCircle,
  HelpCircle
} from 'lucide-react';

const HELP_CATEGORIES = [
  {
    id: "membresias",
    title: "Membresías y Niveles de Socio",
    icon: <ShieldCheck size={24} />,
    description: "Explora los beneficios exclusivos de los niveles Pionero, Elite y Fundador.",
    articles: [
      {
        q: "¿Cuál es la diferencia real entre los niveles de socio?",
        a: "En SaidonClub, el nivel define tu capacidad de capitalización. **Pionero** es ideal para consumidores que buscan ahorros inmediatos del 30%. **Elite** duplica el multiplicador de puntos Saidon y otorga prioridad logística. **Fundador** es el nivel máximo, permitiendo participación en el bono de expansión global e ingresos por el crecimiento total de la red."
      },
      {
        q: "¿Cómo funciona el sistema de Upgrades?",
        a: "Puedes escalar de nivel en cualquier momento acumulando puntos por tus compras o mediante el crecimiento de tu red colaborativa. El sistema detecta automáticamente tu volumen de actividad y te ofrece la transición al siguiente nivel con beneficios instantáneos."
      },
      {
        q: "¿Qué beneficios exclusivos tengo como socio?",
        a: "Acceso a precios de fábrica directos desde Asia y USA, acumulación de puntos por cada compra de tu red, soporte VIP 24/7 y acceso a la Academia de Liderazgo Saidon."
      }
    ]
  },
  {
    id: "marketplace",
    title: "Marketplace y Logística Inteligente",
    icon: <ShoppingBag size={24} />,
    description: "Ahorro garantizado del 30%, envíos nacionales e internacionales.",
    articles: [
      {
        q: "¿Cómo garantizan un ahorro del 30% real?",
        a: "Nuestra infraestructura elimina el 100% de los intermediarios tradicionales. Al importar directamente desde fabricantes y utilizar centros logísticos propios en USA y Asia, transferimos ese ahorro operativo directamente a tu bolsillo y a tu red de puntos."
      },
      {
        q: "¿Cuáles son los tiempos de entrega en Ecuador?",
        a: "Para productos en stock local, el tiempo es de **24 a 48 horas**. Para pedidos internacionales directos (Bajo Pedido), el tiempo estimado es de **7 a 12 días laborables**, incluyendo trámites aduaneros y entrega puerta a puerta."
      },
      {
        q: "¿Cómo rastrear mi pedido internacional?",
        a: "Desde tu panel 'Mi Cuenta', sección 'Pedidos', podrás ver el estado en tiempo real con integración directa a nuestros partners logísticos internacionales."
      }
    ]
  },
  {
    id: "recompensas",
    title: "Sistema de Economía Colaborativa",
    icon: <Zap size={24} />,
    description: "Aprende a convertir tu consumo diario en ingresos sostenibles.",
    articles: [
      {
        q: "¿Cómo convierto mi consumo en ingresos?",
        a: "Cada vez que tú o alguien de tu red realiza una compra en el marketplace, el sistema genera **Puntos Saidon**. Estos puntos representan valor real dentro del ecosistema y se distribuyen de forma equitativa según tu nivel de socio."
      },
      {
        q: "¿Puedo retirar mis ganancias a mi cuenta bancaria?",
        a: "Sí. Los puntos acumulados pueden ser canjeados por productos en el marketplace o convertidos a saldo líquido. Una vez alcanzado el umbral mínimo, puedes solicitar el retiro directo a tu cuenta bancaria local o billetera digital autorizada."
      },
      {
        q: "¿Qué es el Bono de Expansión Global?",
        a: "Es un incentivo exclusivo para socios nivel Fundador, donde se distribuye un porcentaje de las ventas globales de la compañía entre los líderes que impulsan el ecosistema en nuevos mercados."
      }
    ]
  },
  {
    id: "seguridad",
    title: "Seguridad y Respaldo Institucional",
    icon: <Lock size={24} />,
    description: "Protección de datos, legalidad y garantías de red.",
    articles: [
      {
        q: "¿Cómo protegen mis datos financieros?",
        a: "Utilizamos protocolos de cifrado de grado militar **AES-256**. SaidonClub no almacena directamente datos sensibles de tarjetas; todas las transacciones son procesadas por pasarelas certificadas bajo normativas internacionales PCI-DSS."
      },
      {
        q: "¿Cuál es el respaldo legal de SaidonClub?",
        a: "Operamos bajo una estructura corporativa transparente y legalmente constituida en múltiples jurisdicciones. Tu red y tus activos digitales están protegidos por contratos institucionales que garantizan la propiedad de tu negocio a largo plazo."
      }
    ]
  }
];

export default function AyudaPage() {
  const [activeCategory, setActiveCategory] = useState(HELP_CATEGORIES[0].id);
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const filteredCategories = useMemo(() => {
    if (!searchQuery) return HELP_CATEGORIES;
    return HELP_CATEGORIES.map(cat => ({
      ...cat,
      articles: cat.articles.filter(art => 
        art.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
        art.a.toLowerCase().includes(searchQuery.toLowerCase())
      )
    })).filter(cat => cat.articles.length > 0);
  }, [searchQuery]);

  const currentCategory = useMemo(() => {
    return filteredCategories.find(cat => cat.id === activeCategory) || filteredCategories[0] || HELP_CATEGORIES[0];
  }, [activeCategory, filteredCategories]);

  return (
    <div className={styles.container}>
      {/* Elementos Decorativos de Fondo */}
      <div className={styles.bgGlow} />
      <div className={styles.bgGrid} />

      <div className={styles.content}>
        <header className={styles.header}>
          <div className={styles.badge}>Centro de Soporte Institucional</div>
          <h1>¿Cómo podemos <br /><span>ayudarte hoy?</span></h1>
          <p>Accede a la base de conocimientos oficial de SaidonClub y domina las herramientas de la nueva economía colaborativa.</p>
          
          <div className={styles.searchWrapper}>
            <Search className={styles.searchIcon} size={22} />
            <input 
              type="text" 
              placeholder="Busca temas de membresías, logística o puntos..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.statusBanner}>
            <div className={styles.statusItem}>
              <div className={styles.statusDot} />
              <span>Red Global Saidon: <strong>Activa</strong></span>
            </div>
            <div className={styles.statusItem}>
              <div className={styles.statusDot} />
              <span>Cifrado AES-256: <strong>Operacional</strong></span>
            </div>
            <div className={styles.statusItem}>
              <div className={styles.statusDot} />
              <span>Logística Asia/USA: <strong>En Tiempo Real</strong></span>
            </div>
          </div>
        </header>

        <div className={styles.mainLayout}>
          <aside className={styles.sidebar}>
            <div className={styles.categoryList}>
              {filteredCategories.map((category) => (
                <button 
                  key={category.id}
                  className={`${styles.categoryTab} ${activeCategory === category.id ? styles.activeTab : ''}`}
                  onClick={() => {
                    setActiveCategory(category.id);
                    setOpenFaq(null);
                  }}
                >
                  <div className={styles.tabIcon}>{category.icon}</div>
                  <div className={styles.tabInfo}>
                    <span className={styles.tabTitle}>{category.title}</span>
                    <span className={styles.tabDesc}>{category.description}</span>
                  </div>
                </button>
              ))}
            </div>
          </aside>

          <main className={styles.faqContent}>
            <div className={styles.categoryHeader}>
              <div className={styles.iconCircle}>{currentCategory.icon}</div>
              <div className={styles.headerText}>
                <h2>{currentCategory.title}</h2>
                <p>{currentCategory.articles.length} artículos encontrados</p>
              </div>
            </div>
            
            <div className={styles.faqList}>
              {currentCategory.articles.map((article, index) => (
                <div 
                  key={index} 
                  className={`${styles.faqItem} ${openFaq === index ? styles.faqOpen : ''}`}
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <div className={styles.faqQuestion}>
                    <span>{article.q}</span>
                    <div className={styles.chevronWrapper}>
                      {openFaq === index ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    </div>
                  </div>
                  <div className={styles.faqAnswerWrapper} style={{ maxHeight: openFaq === index ? '500px' : '0' }}>
                    <div className={styles.faqAnswer}>
                      <p dangerouslySetInnerHTML={{ __html: article.a.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>

        <footer className={styles.contactFooter}>
          <div className={styles.footerContent}>
            <div className={styles.supportInfo}>
              <div className={styles.footerBadge}>Soporte VIP 24/7</div>
              <h3>Asistencia Institucional</h3>
              <p>Nuestro equipo de soporte técnico liderado por el Admin está disponible para acompañarte en tu crecimiento y resolver cualquier duda sobre tu red Saidon.</p>
            </div>
            <div className={styles.footerActions}>
              <a href="https://wa.me/593983788477" target="_blank" rel="noopener noreferrer" className={styles.whatsappBtn}>
                <MessageCircle size={22} />
                WhatsApp Directo (Soporte Oficial)
              </a>
              <a href="https://wa.me/593983788477?text=Hola%2C%20necesito%20ayuda%20con%20un%20ticket%20de%20soporte" target="_blank" rel="noopener noreferrer" className={styles.ticketBtn}>
                <HelpCircle size={22} />
                Sistema de Tickets Saidon
              </a>
            </div>
          </div>
          <div className={styles.footerGlow} />
          <div className={styles.footerTexture} />
        </footer>
      </div>
    </div>
  );
}


