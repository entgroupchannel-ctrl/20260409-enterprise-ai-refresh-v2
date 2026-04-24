// useDownloadTouchWorkDatasheet
// - Render TouchWorkDatasheetPDF off-screen
// - Generate QR codes (product page + quote request)
// - Fetch company info from Supabase
// - Convert to PDF via html2pdf.js with header/footer

import { useCallback, useState } from "react";
import { createRoot } from "react-dom/client";
import QRCode from "qrcode";
import { supabase } from "@/integrations/supabase/client";
import { generatePDFWithHeaderFooter } from "@/lib/pdf-helper";
import TouchWorkDatasheetPDF from "@/components/touchwork/TouchWorkDatasheetPDF";
import type { TouchWorkProduct } from "@/data/touchwork-products";

const FALLBACK_COMPANY = {
  name_th: "บริษัท อีเอ็นที กรุ๊ป จำกัด",
  name_en: "ENT Group Co., Ltd.",
  address_th: "70/5 ถนนรามอินทรา แขวงท่าแร้ง เขตบางเขน กรุงเทพฯ 10220",
  phone: "02-552-5895",
  email: "info@entgroup.co.th",
  website: "www.entgroup.co.th",
  tax_id: null,
  logo_url: null,
};

export function useDownloadTouchWorkDatasheet() {
  const [isDownloading, setIsDownloading] = useState(false);

  const download = useCallback(async (product: TouchWorkProduct) => {
    setIsDownloading(true);
    const origin = typeof window !== "undefined" ? window.location.origin : "https://www.entgroup.co.th";
    const productUrl = `${origin}/touchwork/${product.model.toLowerCase()}`;
    const quoteUrl = `${origin}/quote-request?product=${encodeURIComponent(product.model)}&series=TouchWork`;

    // Off-screen mount node
    const host = document.createElement("div");
    host.style.position = "fixed";
    host.style.left = "-10000px";
    host.style.top = "0";
    host.style.width = "210mm"; // A4
    host.style.background = "#fff";
    document.body.appendChild(host);
    const root = createRoot(host);

    try {
      // Fetch company info (best-effort)
      let company = { ...FALLBACK_COMPANY };
      try {
        const { data } = await supabase
          .from("company_settings")
          .select("name_th, name_en, address_th, phone, email, website, tax_id, logo_url")
          .eq("is_active", true)
          .limit(1)
          .maybeSingle();
        if (data) company = { ...company, ...data };
      } catch (e) {
        console.warn("[datasheet] company fetch failed, using fallback", e);
      }

      // Generate QR codes
      const qrOpts = { width: 256, margin: 1, color: { dark: "#1d4ed8", light: "#ffffff" } } as const;
      const [qrProductDataUrl, qrQuoteDataUrl] = await Promise.all([
        QRCode.toDataURL(productUrl, qrOpts),
        QRCode.toDataURL(quoteUrl, qrOpts),
      ]);

      // Render template
      await new Promise<void>((resolve) => {
        root.render(
          <TouchWorkDatasheetPDF
            product={product}
            company={company}
            qrProductDataUrl={qrProductDataUrl}
            qrQuoteDataUrl={qrQuoteDataUrl}
            productUrl={productUrl}
          />
        );
        // Wait for paint + image load
        setTimeout(resolve, 500);
      });

      const element = host.querySelector("#touchwork-datasheet-pdf") as HTMLElement | null;
      if (!element) throw new Error("PDF template element not found");

      // Wait for all images inside template to load (including logo + product image)
      const imgs = Array.from(element.querySelectorAll("img"));
      await Promise.all(
        imgs.map(
          (img) =>
            new Promise<void>((res) => {
              if (img.complete && img.naturalWidth > 0) return res();
              img.onload = () => res();
              img.onerror = () => res();
              // safety timeout
              setTimeout(() => res(), 3000);
            })
        )
      );

      await generatePDFWithHeaderFooter(element, {
        filename: `${product.model}-Datasheet-ENTGroup.pdf`,
        headerLeft: company.name_en || "ENT Group",
        headerRight: `${product.model} Datasheet`,
        footerCenter: "ENT Group | B2B Industrial Platform",
        margin: 12,
        topMargin: 18,
        bottomMargin: 16,
      });
    } finally {
      // cleanup
      try {
        root.unmount();
      } catch {
        /* noop */
      }
      host.remove();
      setIsDownloading(false);
    }
  }, []);

  return { download, isDownloading };
}
