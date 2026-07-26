import { Helmet } from 'react-helmet-async';
import { SITE_CONFIG } from '../../config/seo';

interface SEOProps {
  /** Page-specific title — shown as "Page Title | HomeHive" */
  title?: string;
  /** Page-specific description — overrides the site default */
  description?: string;
  /** Absolute URL for OG/Twitter image — overrides the site default */
  ogImage?: string;
  /** Canonical URL for this page — defaults to current href */
  canonical?: string;
  /** OG type — 'website' for pages, 'product' for product details */
  ogType?: 'website' | 'product' | 'article';
  /** Set true for pages you don't want indexed (cart, checkout, admin) */
  noIndex?: boolean;
}

export function SEO({
  title,
  description = SITE_CONFIG.description,
  ogImage = SITE_CONFIG.ogImage,
  canonical,
  ogType = 'website',
  noIndex = false,
}: SEOProps) {
  const pageTitle = title
    ? `${title} | ${SITE_CONFIG.name}`
    : `${SITE_CONFIG.name} – ${SITE_CONFIG.tagline}`;

  const canonicalUrl = canonical ?? (typeof window !== 'undefined' ? window.location.href : SITE_CONFIG.url);

  return (
    <Helmet>
      {/* ── Primary ──────────────────────────────────────────── */}
      <title>{pageTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* ── Open Graph ───────────────────────────────────────── */}
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={SITE_CONFIG.name} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={canonicalUrl} />

      {/* ── Twitter Card ─────────────────────────────────────── */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={SITE_CONFIG.twitterHandle} />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* ── Theme Color ──────────────────────────────────────── */}
      <meta name="theme-color" content={SITE_CONFIG.themeColor} />
    </Helmet>
  );
}
