import adidas from "@/assets/partners/ADIDAS.svg";
import amazon from "@/assets/partners/AMAZON.svg";
import apple from "@/assets/partners/APPLE.svg";
import bmw from "@/assets/partners/bmw.svg";
import cocacola from "@/assets/partners/COCACOLA.svg";
import dhl from "@/assets/partners/DHL.svg";
import google from "@/assets/partners/GOOGLE.svg";
import hisense from "@/assets/partners/HISENSE.svg";
import huawei from "@/assets/partners/huawei.svg";
import intel from "@/assets/partners/INTEL.svg";
import lenovo from "@/assets/partners/lenovo.svg";
import mcdonalds from "@/assets/partners/mcdonalds.svg";
import mi from "@/assets/partners/MI.svg";
import tesla from "@/assets/partners/TESLA.svg";
import nike from "@/assets/partners/NIKE.svg";
import pepsi from "@/assets/partners/PEPSI.svg";
import sony from "@/assets/partners/SONY.svg";
import starbucks from "@/assets/partners/STARBUCKS.svg";
import samsung from "@/assets/partners/SUMSUNG.svg";
import more from "@/assets/partners/more.svg";

const PARTNERS: { name: string; src: string }[] = [
  { name: "Adidas", src: adidas },
  { name: "Amazon", src: amazon },
  { name: "Apple", src: apple },
  { name: "BMW", src: bmw },
  { name: "Coca-Cola", src: cocacola },
  { name: "DHL", src: dhl },
  { name: "Google", src: google },
  { name: "Hisense", src: hisense },
  { name: "Huawei", src: huawei },
  { name: "Intel", src: intel },
  { name: "Lenovo", src: lenovo },
  { name: "McDonald's", src: mcdonalds },
  { name: "Xiaomi", src: mi },
  { name: "Tesla", src: tesla },
  { name: "Nike", src: nike },
  { name: "Pepsi", src: pepsi },
  { name: "Sony", src: sony },
  { name: "Starbucks", src: starbucks },
  { name: "Samsung", src: samsung },
  { name: "More", src: more },
];

interface PartnerLogosProps {
  title?: string;
  subtitle?: string;
}

const PartnerLogos = ({
  title = "Trusted by Global Brands",
  subtitle = "ENT Group — Exclusive Distributor of CESIPC Industrial PC in Thailand · ลูกค้าและพาร์ทเนอร์ระดับโลกที่ไว้วางใจ",
}: PartnerLogosProps) => {
  return (
    <section className="py-10 md:py-12 bg-background border-y border-border">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="text-center mb-6">
          <h2 className="text-xl md:text-2xl font-display font-bold mb-1.5">
            {title}
          </h2>
          <p className="text-xs md:text-sm text-muted-foreground max-w-3xl mx-auto">{subtitle}</p>
        </div>

        <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-10 gap-2 md:gap-3">
          {PARTNERS.map((p) => (
            <div
              key={p.name}
              className="group aspect-[3/2] flex items-center justify-center rounded-md border border-border/60 bg-card hover:bg-muted/40 hover:border-primary/40 transition-all p-1.5"
              title={p.name}
            >
              <img
                src={p.src}
                alt={`${p.name} logo`}
                loading="lazy"
                className="max-h-12 md:max-h-14 w-auto object-contain dark:invert dark:brightness-0 dark:contrast-200"
               decoding="async"/>
            </div>
          ))}
        </div>

        <p className="text-center text-[10px] text-muted-foreground mt-4">
          * เครื่องหมายการค้าทั้งหมดเป็นทรัพย์สินของเจ้าของแบรนด์ — แสดงเพื่ออ้างอิงอุตสาหกรรม
        </p>
      </div>
    </section>
  );
};

export default PartnerLogos;
