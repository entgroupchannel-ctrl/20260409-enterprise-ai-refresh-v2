import { Helmet } from "react-helmet-async";

interface Review {
  author: string;
  rating: number; // 1-5
  reviewBody: string;
  datePublished?: string; // ISO date
}

interface ReviewJsonLdProps {
  /** Product or service name being reviewed */
  itemName: string;
  /** Optional product image URL */
  image?: string;
  /** Aggregate rating value 1-5 */
  ratingValue: number;
  /** Total number of reviews */
  reviewCount: number;
  /** Optional individual reviews to surface */
  reviews?: Review[];
}

/**
 * Inject Review + AggregateRating schema for products/services.
 * Helps Google/Bing show star ratings in SERPs (Rich Results).
 */
const ReviewJsonLd = ({
  itemName,
  image,
  ratingValue,
  reviewCount,
  reviews = [],
}: ReviewJsonLdProps) => {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: itemName,
    ...(image ? { image } : {}),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: ratingValue.toFixed(1),
      reviewCount: String(reviewCount),
      bestRating: "5",
      worstRating: "1",
    },
    ...(reviews.length > 0
      ? {
          review: reviews.map((r) => ({
            "@type": "Review",
            author: { "@type": "Person", name: r.author },
            reviewRating: {
              "@type": "Rating",
              ratingValue: String(r.rating),
              bestRating: "5",
              worstRating: "1",
            },
            reviewBody: r.reviewBody,
            ...(r.datePublished ? { datePublished: r.datePublished } : {}),
          })),
        }
      : {}),
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

export default ReviewJsonLd;
