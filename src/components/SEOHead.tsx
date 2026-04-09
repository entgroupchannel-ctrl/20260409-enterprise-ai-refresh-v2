import { Helmet } from "react-helmet-async";

interface SEOHeadProps {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: string;
  jsonLd?: Record<string, unknown>;
}

const BASE_URL = "https://ent-vision.lovable.app";
const DEFAULT_IMAGE = "https://storage.googleapis.com/gpt-engineer-file-uploads/C6ygsjAjviQwtLV1gZ8UGnTQk5t1/social-images/social-1775197762428-222733714_2039815199510849_6412877395285753714_n.webp";

const SEOHead = ({ title, description, path = "/", image, type = "website", jsonLd }: SEOHeadProps) => {
  const fullTitle = title.includes("ENT Group") ? title : `${title} | ENT Group`;
  const url = `${BASE_URL}${path}`;
  const ogImage = image || DEFAULT_IMAGE;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={ogImage} />

      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
          >
        </script>
      )}
      >
    </Helmet>
  );
};

export default SEOHead;
