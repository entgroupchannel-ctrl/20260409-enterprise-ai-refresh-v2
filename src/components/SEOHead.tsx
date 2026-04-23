import { Helmet } from "react-helmet-async";

interface SEOHeadProps {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: string;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  keywords?: string;
  noindex?: boolean;
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    section?: string;
    tags?: string[];
  };
}

const BASE_URL = "https://www.entgroup.co.th";
const DEFAULT_IMAGE = "https://ugzdwmyylqmirrljtuej.supabase.co/storage/v1/object/public/company-assets/logo-1775926128377.jpg";

const SEOHead = ({
  title,
  description,
  path = "/",
  image,
  type = "website",
  jsonLd,
  keywords,
  noindex,
  article,
}: SEOHeadProps) => {
  const fullTitle = title.includes("ENT Group") ? title : `${title} | ENT Group`;
  const url = `${BASE_URL}${path}`;
  const ogImage = image || DEFAULT_IMAGE;
  const descTrimmed = description.slice(0, 160);

  const jsonLdArray = jsonLd
    ? Array.isArray(jsonLd)
      ? jsonLd
      : [jsonLd]
    : [];

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={descTrimmed} />
      <link rel="canonical" href={url} />
      {keywords && <meta name="keywords" content={keywords} />}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      )}

      {/* Language alternates */}
      <link rel="alternate" hrefLang="th" href={url} />
      <link rel="alternate" hrefLang="x-default" href={url} />

      {/* Geo targeting (Thailand) — helps Google/Bing local SERP & LLM context */}
      <meta name="geo.region" content="TH-10" />
      <meta name="geo.placename" content="Bangkok, Thailand" />
      <meta name="geo.position" content="13.7563;100.5018" />
      <meta name="ICBM" content="13.7563, 100.5018" />

      {/* GEO / LLM optimization — explicit signals for AI search engines (ChatGPT, Perplexity, Gemini, Google AI Overviews, Bing Copilot) */}
      <meta name="ai-content-declaration" content="human-authored, expert-reviewed" />
      <meta name="article:publisher" content="ENT Group Co., Ltd." />
      <meta name="author" content="ENT Group" />
      {/* Allow AI training/citation for our public marketing pages */}
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="google" content="notranslate" />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={descTrimmed} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={article ? "article" : type} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="ENT Group" />
      <meta property="og:locale" content="th_TH" />

      {/* Article-specific OG */}
      {article?.publishedTime && <meta property="article:published_time" content={article.publishedTime} />}
      {article?.modifiedTime && <meta property="article:modified_time" content={article.modifiedTime} />}
      {article?.author && <meta property="article:author" content={article.author} />}
      {article?.section && <meta property="article:section" content={article.section} />}
      {article?.tags?.map((tag) => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@entgroup" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={descTrimmed} />
      <meta name="twitter:image" content={ogImage} />

      {/* JSON-LD */}
      {jsonLdArray.map((ld, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(ld)}
        </script>
      ))}
    </Helmet>
  );
};

export default SEOHead;
