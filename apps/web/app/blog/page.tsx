import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { BLOG_POSTS, BLOG_CATEGORIES } from "@/lib/data/blog";
import styles from "./Blog.module.css";

export const metadata: Metadata = {
  title: "Blog & Recursos | SaidonClub",
  description:
    "Aprende sobre el sistema MLM de SaidonClub, finanzas personales, estrategias de red y casos de éxito de nuestra comunidad.",
  keywords: ["blog", "MLM", "finanzas", "SaidonClub", "emprendimiento"],
};

import { BookOpen } from "lucide-react";

async function BlogContent({ searchParams }: { searchParams: Promise<{ categoria?: string }> }) {
  const params = await searchParams;
  const activeCategory = params.categoria;
  const filtered = activeCategory
    ? BLOG_POSTS.filter((p) => p.category === activeCategory)
    : BLOG_POSTS;

  const featured = BLOG_POSTS.filter((p) => p.featured).slice(0, 3);

  return (
    <main className={styles.main}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroShimmer} />
        <div className={styles.heroInner}>
          <span className={styles.eyebrow}>
            <BookOpen size={16} />
            Centro de Conocimiento
          </span>
          <h1 className={styles.heroTitle}>
            Blog & <span className={styles.accent}>Recursos</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Aprende, crece y maximiza tus resultados con SaidonClub.
            Guías, tutoriales y casos de éxito de nuestra comunidad.
          </p>
        </div>
      </section>

      <div className={styles.container}>
        {/* Featured Posts */}
        {!activeCategory && (
          <section className={styles.featuredSection}>
            <h2 className={styles.sectionTitle}>Artículos Destacados</h2>
            <div className={styles.featuredGrid}>
              {featured.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className={styles.featuredCard}
                >
                  <div className={styles.featuredCover}>
                    <div className={styles.coverPlaceholder}>
                      {post.category === "mlm" && "🔗"}
                      {post.category === "finanzas" && "💰"}
                      {post.category === "tutoriales" && "📚"}
                      {post.category === "estilo-de-vida" && "✨"}
                      {post.category === "noticias" && "📢"}
                    </div>
                  </div>
                  <div className={styles.featuredBody}>
                    <span className={styles.categoryBadge}>
                      {BLOG_CATEGORIES.find((c) => c.id === post.category)?.label}
                    </span>
                    <h3 className={styles.featuredTitle}>{post.title}</h3>
                    <p className={styles.featuredExcerpt}>{post.excerpt}</p>
                    <div className={styles.postMeta}>
                      <span>{post.author}</span>
                      <span>·</span>
                      <span>{post.readTime} min de lectura</span>
                      <span>·</span>
                      <span>
                        {new Date(post.publishedAt).toLocaleDateString("es-EC", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Category Filter */}
        <section className={styles.filterSection}>
          <div className={styles.filterBar}>
            <Link
              href="/blog"
              className={`${styles.filterBtn} ${!activeCategory ? styles.filterActive : ""}`}
            >
              Todos
            </Link>
            {BLOG_CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/blog?categoria=${cat.id}`}
                className={`${styles.filterBtn} ${activeCategory === cat.id ? styles.filterActive : ""}`}
              >
                {cat.emoji} {cat.label}
              </Link>
            ))}
          </div>
        </section>

        {/* All Posts Grid */}
        <section className={styles.postsSection}>
          <h2 className={styles.sectionTitle}>
            {activeCategory
              ? BLOG_CATEGORIES.find((c) => c.id === activeCategory)?.label
              : "Todos los Artículos"}
            <span className={styles.postCount}> ({filtered.length})</span>
          </h2>
          <div className={styles.postsGrid}>
            {filtered.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className={styles.postCard}
              >
                <div className={styles.postCover}>
                  <div className={styles.coverPlaceholderSm}>
                    {post.category === "mlm" && "🔗"}
                    {post.category === "finanzas" && "💰"}
                    {post.category === "tutoriales" && "📚"}
                    {post.category === "estilo-de-vida" && "✨"}
                    {post.category === "noticias" && "📢"}
                  </div>
                </div>
                <div className={styles.postBody}>
                  <span className={styles.categoryBadgeSm}>
                    {BLOG_CATEGORIES.find((c) => c.id === post.category)?.label}
                  </span>
                  <h3 className={styles.postTitle}>{post.title}</h3>
                  <p className={styles.postExcerpt}>{post.excerpt}</p>
                  <div className={styles.postFooter}>
                    <div className={styles.postMeta}>
                      <span className={styles.authorAvatar}>
                        {post.author.charAt(0)}
                      </span>
                      <span>{post.author}</span>
                    </div>
                    <span className={styles.readTime}>
                      {post.readTime} min
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA Newsletter */}
        <section className={styles.ctaSection}>
          <div className={styles.ctaCard}>
            <div className={styles.ctaGlow} />
            <h2 className={styles.ctaTitle}>
              ¿Quieres recibir contenido exclusivo?
            </h2>
            <p className={styles.ctaText}>
              Únete a más de 5,000 socios que reciben estrategias, tips y
              ofertas exclusivas directamente en su correo.
            </p>
            <Link href="/auth/register" className={styles.ctaBtn}>
              Registrarme Gratis
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

function LoadingSkeleton() {
  return (
    <main className={styles.main}>
      <div className={styles.loading}>Cargando...</div>
    </main>
  );
}

export default function BlogPage(props: { searchParams: Promise<{ categoria?: string }> }) {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <BlogContent {...props} />
    </Suspense>
  );
}
