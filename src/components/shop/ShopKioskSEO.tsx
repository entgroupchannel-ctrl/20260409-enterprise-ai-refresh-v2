import SEOHead from "@/components/SEOHead";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import ProductJsonLd from "@/components/ProductJsonLd";
import { Helmet } from "react-helmet-async";

/**
 * SEO + GEO + LLM optimization สำหรับหน้า /shop/displays-* (KIOSK)
 * รวม: meta tags, OpenGraph, Twitter, Geo TH, Product JSON-LD,
 *       Breadcrumb JSON-LD, FAQPage JSON-LD (ดีกับ ChatGPT/Perplexity/Google AI)
 */

interface VariantOffer {
  key: string;
  label: string;
  price: number;
  description?: string;
}

interface ShopKioskSEOProps {
  /** เช่น "displays-15.6" */
  slug: string;
  /** เช่น "KD156B" */
  modelCode: string;
  /** เช่น "Floor-Stand Touch Kiosk 15.6\"" */
  shortName: string;
  /** เช่น 15.6 / 21.5 / 32 / 43 */
  sizeInch: number;
  /** ภาพ hero สำหรับ OG */
  image: string;
  /** Variants พร้อมราคา */
  variants: VariantOffer[];
  /** สเปกย่อสำหรับ description */
  resolution: string;
  brightness: string;
  touch: string;
  /** Use cases สำหรับ keywords + FAQ */
  useCases: string[];
}

const BASE_URL = "https://www.entgroup.co.th";

export default function ShopKioskSEO({
  slug,
  modelCode,
  shortName,
  sizeInch,
  image,
  variants,
  resolution,
  brightness,
  touch,
  useCases,
}: ShopKioskSEOProps) {
  const path = `/shop/${slug}`;
  const url = `${BASE_URL}${path}`;

  const minPrice = Math.min(...variants.map((v) => v.price));
  const maxPrice = Math.max(...variants.map((v) => v.price));

  const title = `${modelCode} ตู้คีออสก์ ${sizeInch}" — เริ่มต้น ฿${minPrice.toLocaleString()} | ENT Group`;
  const description = `ซื้อตู้คีออสก์ตั้งพื้น ${shortName} (${modelCode}) ขนาด ${sizeInch} นิ้ว — เลือก Configuration ได้ ${variants.length} แบบ: ${variants
    .map((v) => v.label)
    .join(" / ")} ราคา ฿${minPrice.toLocaleString()}–฿${maxPrice.toLocaleString()} พร้อมขอใบเสนอราคาออนไลน์ ส่งทั่วไทย`;

  const keywords = [
    modelCode,
    `ตู้คีออสก์ ${sizeInch} นิ้ว`,
    `Touch Kiosk ${sizeInch}"`,
    `Floor-Stand Kiosk`,
    `Self-service Kiosk`,
    `จอสัมผัส ${sizeInch} นิ้ว`,
    "PCAP Touch",
    "Interactive Display",
    ...useCases,
    "ENT Group",
  ].join(", ");

  // Breadcrumb
  const breadcrumbItems = [
    { name: "หน้าแรก", url: "/" },
    { name: "Shop", url: "/shop" },
    { name: `Display ${sizeInch}"`, url: `/products/${slug}` },
    { name: modelCode, url: path },
  ];

  // Product JSON-LD inputs
  const productList = variants.map((v) => ({
    name: `${modelCode} — ${v.label}`,
    price: v.price,
    priceCurrency: "THB",
    image,
    description: v.description || `${shortName} (${modelCode}) — ${v.label}`,
    sku: `${modelCode}-${v.key.toUpperCase()}`,
    brand: "ENT Group",
    category: "Industrial Kiosk",
  }));

  // FAQPage JSON-LD — ดีมากสำหรับ Google AI Overviews / ChatGPT / Perplexity
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `${modelCode} ราคาเท่าไหร่?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${modelCode} ตู้คีออสก์ตั้งพื้นขนาด ${sizeInch} นิ้ว ราคาเริ่มต้น ฿${minPrice.toLocaleString()} (Touch Monitor) ไปจนถึง ฿${maxPrice.toLocaleString()} (Windows x86 PC ในตัว) — สามารถปรับสเปก CPU/RAM/SSD/อุปกรณ์เสริมและขอใบเสนอราคาออนไลน์ได้ทันที`,
        },
      },
      {
        "@type": "Question",
        name: `${modelCode} ใช้งานอะไรได้บ้าง?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${modelCode} เหมาะกับงาน ${useCases.join(", ")} — รองรับการติดตั้งทั้งแบบตั้งพื้นและยึดน็อต พร้อม PCAP Touch ${touch} ความละเอียด ${resolution} ความสว่าง ${brightness}`,
        },
      },
      {
        "@type": "Question",
        name: `สั่งซื้อ ${modelCode} แล้วต้องชำระเงินทันทีไหม?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `ไม่ต้องครับ — ENT Group เป็น B2B Platform เมื่อกด "หยิบใส่ตะกร้า" ระบบจะสร้างใบเสนอราคา (Quote) ให้ทีมแอดมินช่วยปรับสเปกและเงื่อนไขร่วมกับลูกค้าก่อน เมื่อตกลงแล้วค่อยยืนยันสั่งซื้อ ไม่มีผลผูกพันใดๆ จนกว่าจะลงนาม`,
        },
      },
      {
        "@type": "Question",
        name: `${modelCode} เลือก Configuration ได้กี่แบบ?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `เลือกได้ ${variants.length} แบบหลัก: ${variants
            .map((v) => `(${v.label}) ฿${v.price.toLocaleString()}`)
            .join(", ")} และยังปรับ CPU, RAM, SSD, Wi-Fi/4G LTE และอุปกรณ์เสริม (Printer / Scanner / Card Reader / Camera) เพิ่มเติมได้`,
        },
      },
      {
        "@type": "Question",
        name: `ENT Group จัดส่ง ${modelCode} ทั่วประเทศไทยไหม?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `จัดส่งทั่วประเทศไทย — มีบริการติดตั้งและฝึกอบรมที่หน้างาน รับประกันสินค้า 1 ปีเต็ม พร้อมบริการหลังการขายโดยทีมวิศวกรไทย`,
        },
      },
    ],
  };

  return (
    <>
      <SEOHead
        title={title}
        description={description}
        path={path}
        image={image}
        type="product"
        keywords={keywords}
      />
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <ProductJsonLd
        products={productList}
        collectionName={`${modelCode} ${shortName}`}
        collectionDescription={description}
        collectionUrl={path}
        collectionImage={image}
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
        {/* Product-specific OG tags */}
        <meta property="product:price:amount" content={String(minPrice)} />
        <meta property="product:price:currency" content="THB" />
        <meta property="product:availability" content="in stock" />
        <meta property="product:condition" content="new" />
        <meta property="product:brand" content="ENT Group" />
        <meta property="product:retailer_item_id" content={modelCode} />
        {/* LLM-friendly hints */}
        <meta name="article:section" content="Industrial Kiosk" />
        <link rel="alternate" type="application/json" href={url} />
      </Helmet>
    </>
  );
}
