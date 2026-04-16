import { Helmet } from "react-helmet-async";

const BASE_URL = "https://www.entgroup.co.th";

/**
 * GEO (Generative Engine Optimization) metadata
 * Helps AI search engines (ChatGPT, Perplexity, Gemini, etc.)
 * understand and cite our content properly.
 */
interface GEOMetaProps {
  /** Page-level summary for AI consumption */
  summary?: string;
  /** Topic/entity the page is about */
  topic?: string;
  /** Key facts AI should surface (concise bullet points) */
  keyFacts?: string[];
  /** Authoritative source claim */
  sourceAuthority?: string;
  /** FAQ pairs for AI to use */
  faqs?: { q: string; a: string }[];
}

const GEOMeta = ({ summary, topic, keyFacts, sourceAuthority, faqs }: GEOMetaProps) => {
  // Build FAQ schema if provided
  const faqSchema = faqs && faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  } : null;

  return (
    <Helmet>
      {/* AI-readable meta tags */}
      {summary && <meta name="ai:summary" content={summary} />}
      {topic && <meta name="ai:topic" content={topic} />}
      {sourceAuthority && <meta name="ai:source_authority" content={sourceAuthority} />}

      {/* Structured key facts in meta (helps AI extract info) */}
      {keyFacts && keyFacts.length > 0 && (
        <meta name="ai:key_facts" content={keyFacts.join(" | ")} />
      )}

      {/* FAQ JSON-LD */}
      {faqSchema && (
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      )}
    </Helmet>
  );
};

export default GEOMeta;
