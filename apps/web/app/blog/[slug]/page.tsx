import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogPost, BLOG_POSTS, BLOG_CATEGORIES } from "@/lib/data/blog";
import styles from "./Article.module.css";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: "Artículo no encontrado" };
  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.tags,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author],
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const related = BLOG_POSTS.filter(
    (p) => p.slug !== post.slug && p.category === post.category
  ).slice(0, 3);

  const categoryLabel = BLOG_CATEGORIES.find((c) => c.id === post.category);

  // Convert markdown-like content to paragraphs
  const contentBlocks = post.content
    .trim()
    .split("\n")
    .filter((line) => line.trim() !== "");

  return (
    <main className={styles.main}>
      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <div className={styles.breadcrumbInner}>
          <Link href="/" className={styles.breadLink}>Inicio</Link>
          <span className={styles.breadSep}>›</span>
          <Link href="/blog" className={styles.breadLink}>Blog</Link>
          <span className={styles.breadSep}>›</span>
          <span className={styles.breadCurrent}>{post.title}</span>
        </div>
      </div>

      <div className={styles.layout}>
        {/* Article */}
        <article className={styles.article}>
          {/* Header */}
          <header className={styles.articleHeader}>
            <span className={styles.categoryBadge}>
              {categoryLabel?.emoji} {categoryLabel?.label}
            </span>
            <h1 className={styles.articleTitle}>{post.title}</h1>
            <p className={styles.articleExcerpt}>{post.excerpt}</p>
            <div className={styles.articleMeta}>
              <div className={styles.authorInfo}>
                <div className={styles.authorAvatar}>
                  {post.author.charAt(0)}
                </div>
                <div>
                  <div className={styles.authorName}>{post.author}</div>
                  <div className={styles.authorRole}>{post.authorRole}</div>
                </div>
              </div>
              <div className={styles.metaRight}>
                <span>
                  {new Date(post.publishedAt).toLocaleDateString("es-EC", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                <span className={styles.dot}>·</span>
                <span>{post.readTime} min de lectura</span>
              </div>
            </div>
          </header>

          {/* Cover */}
          <div className={styles.coverImage}>
            <div className={styles.coverEmoji}>
              {post.category === "mlm" && "🔗"}
              {post.category === "finanzas" && "💰"}
              {post.category === "tutoriales" && "📚"}
              {post.category === "estilo-de-vida" && "✨"}
              {post.category === "noticias" && "📢"}
            </div>
          </div>

          {/* Content */}
          <div className={styles.articleContent}>
            {contentBlocks.map((block, i) => {
              if (block.startsWith("## ")) {
                return <h2 key={i} className={styles.h2}>{block.replace("## ", "")}</h2>;
              }
              if (block.startsWith("### ")) {
                return <h3 key={i} className={styles.h3}>{block.replace("### ", "")}</h3>;
              }
              if (block.startsWith("**") && block.endsWith("**")) {
                return <p key={i} className={styles.bold}>{block.replace(/\*\*/g, "")}</p>;
              }
              if (block.startsWith("- ")) {
                return <li key={i} className={styles.listItem}>{block.replace("- ", "")}</li>;
              }
              if (block.match(/^\d+\./)) {
                return <li key={i} className={styles.listItem}>{block.replace(/^\d+\.\s/, "")}</li>;
              }
              if (block.startsWith("|")) {
                return null; // Skip markdown tables for now
              }
              if (block.startsWith("*") && block.endsWith("*")) {
                return <p key={i} className={styles.italic}>{block.replace(/\*/g, "")}</p>;
              }
              return <p key={i} className={styles.paragraph}>{block}</p>;
            })}
          </div>

          {/* Tags */}
          <div className={styles.tagsSection}>
            <span className={styles.tagsLabel}>Etiquetas:</span>
            <div className={styles.tags}>
              {post.tags.map((tag) => (
                <span key={tag} className={styles.tag}>
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className={styles.articleCta}>
            <div className={styles.ctaGlow} />
            <h3 className={styles.ctaTitle}>¿Listo para empezar?</h3>
            <p className={styles.ctaText}>
              Únete a SaidonClub hoy y comienza a construir tu libertad financiera.
            </p>
            <div className={styles.ctaBtns}>
              <Link href="/auth/register" className={styles.btnPrimary}>
                Registrarme Gratis
              </Link>
              <Link href="/membresias" className={styles.btnSecondary}>
                Ver Membresías
              </Link>
            </div>
          </div>
        </article>

        {/* Sidebar */}
        <aside className={styles.sidebar}>
          {/* Related Posts */}
          {related.length > 0 && (
            <div className={styles.sidebarCard}>
              <h3 className={styles.sidebarTitle}>Artículos Relacionados</h3>
              <div className={styles.relatedList}>
                {related.map((rel) => (
                  <Link key={rel.slug} href={`/blog/${rel.slug}`} className={styles.relatedItem}>
                    <div className={styles.relatedEmoji}>
                      {rel.category === "mlm" && "🔗"}
                      {rel.category === "finanzas" && "💰"}
                      {rel.category === "tutoriales" && "📚"}
                      {rel.category === "estilo-de-vida" && "✨"}
                    </div>
                    <div>
                      <div className={styles.relatedTitle}>{rel.title}</div>
                      <div className={styles.relatedMeta}>{rel.readTime} min</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Categories */}
          <div className={styles.sidebarCard}>
            <h3 className={styles.sidebarTitle}>Categorías</h3>
            <div className={styles.categoryList}>
              {BLOG_CATEGORIES.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/blog?categoria=${cat.id}`}
                  className={styles.categoryItem}
                >
                  <span>{cat.emoji}</span>
                  <span>{cat.label}</span>
                  <span className={styles.catCount}>
                    {BLOG_POSTS.filter((p) => p.category === cat.id).length}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Join CTA */}
          <div className={`${styles.sidebarCard} ${styles.joinCard}`}>
            <div className={styles.joinGlow} />
            <h3 className={styles.joinTitle}>¿Aún no eres socio?</h3>
            <p className={styles.joinText}>
              Regístrate gratis y empieza a ahorrar y ganar hoy mismo.
            </p>
            <Link href="/auth/register" className={styles.joinBtn}>
              Unirme Ahora
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}
