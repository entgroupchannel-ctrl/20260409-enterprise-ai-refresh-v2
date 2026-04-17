import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, FileText, Phone, Server, Cpu, Zap, Award } from "lucide-react";
import SiteNavbar from "@/components/SiteNavbar";
import Footer from "@/components/Footer";
import LineQRButton from "@/components/LineQRButton";

const NV = "#76B900";

type Product = {
  id: string;
  name: string;
  badges?: { label: string; tone?: "new" | "flagship" | "cert" }[];
  tagline: string;
  desc: string;
  image: string;
  specs: [string, string][];
  quoteSlug: string;
};

const products: Product[] = [
  {
    id: "dgx-a100",
    name: "NVIDIA DGX A100 640GB",
    badges: [{ label: "Flagship", tone: "flagship" }],
    tagline: "เซิร์ฟเวอร์ AI ระดับ Data Center (Rackmount 6U)",
    desc: "เซิร์ฟเวอร์ AI ระดับ Data Center — 8 GPU A100 80GB รวม 640GB, 5 PFLOPS สำหรับ AI Training ขนาดใหญ่",
    image: "https://www.nvidia.com/content/dam/en-zz/Solutions/Data-Center/dgx-a100/nvidia-dgx-a100-system-2c50-d.jpg",
    quoteSlug: "dgx-a100",
    specs: [
      ["GPU", "8x NVIDIA A100 80GB Tensor Core GPUs"],
      ["GPU Memory", "640 GB total"],
      ["Performance", "5 petaFLOPS AI, 10 petaOPS INT8"],
      ["NVSwitches", "6"],
      ["CPU", "Dual AMD Rome 7742, 128 cores, 2.25 GHz base / 3.4 GHz boost"],
      ["System Memory", "2 TB"],
      ["Networking", "8x ConnectX-7 200Gb/s InfiniBand + 2x ConnectX-7 VPI 10/25/50/100/200 Gb/s Ethernet"],
      ["Storage", "OS: 2x 1.92TB M.2 NVMe, Internal: 30TB (8x 3.84TB) U.2 NVMe"],
      ["Power", "6.5 kW max"],
      ["OS", "Ubuntu Linux, Red Hat Enterprise Linux, CentOS"],
      ["Dimensions", "264mm H × 482mm W × 897mm L"],
      ["Weight", "123.16 kg max"],
      ["Operating Temp", "5°C to 30°C"],
    ],
  },
  {
    id: "ws2030",
    name: "Leadtek Station WS2030",
    tagline: "เวิร์กสเตชัน GPU ระดับสูงสุด 4U Rack/Tower — รองรับ 4 GPU, 4TB RAM, 10GbE, 2200W Titanium",
    desc: "เวิร์กสเตชัน GPU ระดับสูงสุด 4U Rack/Tower — รองรับ 4 GPU, 4TB RAM, 10GbE, 2200W Titanium สำหรับ AI Training และ 3D Rendering",
    image: "/product-placeholder.svg",
    quoteSlug: "ws2030",
    specs: [
      ["CPU", "Dual Socket P (LGA 3647), 2nd Gen Intel Xeon Scalable, up to 28 cores, TDP 70-205W"],
      ["Chipset", "Intel C621"],
      ["Memory", "16 DIMM, up to 4TB DDR4-2933MHz ECC RDIMM/LRDIMM"],
      ["Network", "Intel X550 Dual Port 10GBase-T + IPMI 2.0"],
      ["SATA", "10x SATA3 6Gbps, RAID 0/1/5/10"],
      ["NVMe", "1x M.2 (M-Key, 2260/2280/22110)"],
      ["Storage Bays", "8 Hot-swap 3.5\" + Optional 4x 2.5\" NVMe + 1x M.2"],
      ["PCIe Slots", "4x PCIe 3.0 x16 (double-width) + 2x PCIe 3.0 x16 + 1x PCIe 3.0 x4"],
      ["GPU Support", "Up to 4 GPUs (double-width)"],
      ["Cooling", "4 Heavy duty fans + 2 Rear exhaust + 2 Optional rear"],
      ["Power", "2200W Redundant, Titanium Certified"],
      ["Form Factor", "4U Rackmountable / Tower"],
      ["Dimensions", "462mm H × 178mm W × 673mm D"],
      ["Weight", "Net: 20.9 kg / Gross: 28.1 kg"],
      ["OS", "Windows Server 2016/2019, RHEL 7.3+, Ubuntu 18.04 LTS"],
    ],
  },
  {
    id: "ws1020",
    name: "Leadtek Station WS1020",
    tagline: "เวิร์กสเตชัน GPU ระดับกลาง-สูง — Dual Xeon E5, 2TB RAM, รองรับ 3 GPU",
    desc: "เวิร์กสเตชัน GPU Dual Xeon E5-2600 v4/v3 — รองรับ RAM สูงสุด 2TB DDR4 ECC, 3 GPU, 6 ช่องฮาร์ดดิสก์ (4 Hot-swap), พาวเวอร์ 900W Gold",
    image: "/product-placeholder.svg",
    quoteSlug: "ws1020",
    specs: [
      ["CPU", "Dual Intel Xeon E5-2600 v4/v3"],
      ["System Memory", "Up to 2TB DDR4 ECC"],
      ["Storage Bays", "Up to 6 drives (including 4 hot-swap bays)"],
      ["GPU Support", "Up to 3x NVIDIA Quadro / Tesla GPUs"],
      ["Expansion", "Thunderbolt II adapter (optional, up to 20Gbps)"],
      ["Power", "900W Gold Certified"],
      ["Form Factor", "Tower"],
    ],
  },
  {
    id: "w830",
    name: "Leadtek Station W830",
    badges: [{ label: "Data Science Certified", tone: "cert" }],
    tagline: "เวิร์กสเตชัน GPU ระดับกลาง Mid-Tower — รองรับ 3 GPU, 512GB RAM, NVIDIA Data Science Certified",
    desc: "เวิร์กสเตชัน GPU ระดับกลาง Mid-Tower — รองรับ 3 GPU, 512GB RAM, 5G LAN, NVIDIA Data Science Certified สำหรับ AI/Deep Learning/3D Rendering",
    image: "/product-placeholder.svg",
    quoteSlug: "w830",
    specs: [
      ["CPU", "Single Socket R4 (LGA 2066), Intel Xeon W-2200/W-2100"],
      ["Chipset", "Intel C422"],
      ["Memory", "8 DIMM, up to 512GB DDR4-2666MHz ECC LRDIMM"],
      ["Network", "Intel I219LM LAN + Aquantia 5G LAN AQC108"],
      ["SATA", "6x SATA3 6Gbps, RAID 0/1/5/10"],
      ["Storage Bays", "4x Fixed 3.5\" + 4x Fixed 2.5\" + 2x M.2 + 1x U.2"],
      ["PCIe Slots", "3x PCIe 3.0 x16 + 1x PCIe 3.0 x4"],
      ["GPU Support", "Up to 3 GPUs"],
      ["Power", "900W Gold Certified, 100-240V"],
      ["Form Factor", "Mid-Tower"],
      ["Dimensions", "424mm H × 193mm W × 525mm D"],
      ["OS", "Windows 10, RHEL 7.4, Ubuntu 18.04"],
    ],
  },
  {
    id: "dgx-spark",
    name: "NVIDIA DGX Spark",
    badges: [{ label: "NEW", tone: "new" }, { label: "Blackwell", tone: "flagship" }],
    tagline: "ซูเปอร์คอมพิวเตอร์ AI บนโต๊ะทำงาน",
    desc: "ซูเปอร์คอมพิวเตอร์ AI บนโต๊ะทำงาน — Grace Blackwell, 1 PFLOP, 128GB Unified Memory, 4TB NVMe สำหรับพัฒนา LLM/Generative AI ภายในองค์กร ไม่ต้องส่งข้อมูลขึ้น Cloud",
    image: "https://www.nvidia.com/content/dam/en-zz/Solutions/gtcs25/project-digits/nvidia-project-digits-og.jpg",
    quoteSlug: "dgx-spark",
    specs: [
      ["Architecture", "NVIDIA Grace Blackwell"],
      ["GPU", "Blackwell Architecture"],
      ["CPU", "20-core Arm (10x Cortex-X925 + 10x Cortex-A725)"],
      ["AI Performance", "1 PFLOP (FP4 sparse)"],
      ["Memory", "128 GB LPDDR5x Coherent Unified, 256-bit, 273 GB/s"],
      ["Storage", "4 TB NVMe M.2 with Self-encryption"],
      ["Ethernet", "1x RJ-45 10GbE + ConnectX-7 @ 200 Gbps"],
      ["Wi-Fi / BT", "Wi-Fi 7 / BT 5.4"],
      ["Display", "1x HDMI 2.1a"],
      ["Power Supply", "240W"],
      ["OS", "NVIDIA DGX OS"],
      ["Dimensions", "150mm L × 150mm W × 50.5mm H"],
      ["Weight", "1.2 kg"],
    ],
  },
  {
    id: "agx-thor",
    name: "NVIDIA Jetson AGX Thor Dev Kit",
    badges: [{ label: "NEW", tone: "new" }, { label: "Blackwell", tone: "flagship" }, { label: "Physical AI", tone: "cert" }],
    tagline: "แพลตฟอร์ม AI ระดับ Blackwell สำหรับ Robotics และ Edge",
    desc: "แพลตฟอร์ม AI ระดับ Blackwell สำหรับ Robotics และ Edge — 2,070 TFLOPS, 128GB, MIG 7 partitions, ทำงานที่ 40-130W ทรงพลังที่สุดในตระกูล Jetson",
    image: "/images/rugged/em-p21j",
    quoteSlug: "agx-thor",
    specs: [
      ["Module", "Jetson T5000"],
      ["Architecture", "NVIDIA Blackwell"],
      ["CPU", "72-core Arm Grace (Neoverse V2)"],
      ["GPU", "Blackwell, 128 SM, 4th Gen RT, 5th Gen Tensor"],
      ["AI Performance", "2,070 TFLOPS (FP4 sparse), 1,035 TOPS (FP8)"],
      ["Memory", "128 GB Unified LPDDR5x, 256-bit, 276 GB/s"],
      ["Storage", "1 TB NVMe SSD"],
      ["MIG Support", "Up to 7 GPU partitions"],
      ["Interfaces", "USB 3.2, GbE, 10GbE, HDMI 2.1, DP 1.4, CSI, PCIe Gen5"],
      ["OS", "JetPack 7.0 (Ubuntu-based)"],
      ["Power", "40-130W configurable"],
      ["Use Case", "Humanoid Robot, Autonomous Vehicle, Edge LLM, Physical AI"],
    ],
  },
];

const compareCols = ["DGX A100", "WS2030", "WS1020", "W830", "DGX Spark", "AGX Thor"];
const compareRows: [string, string[]][] = [
  ["ประเภท", ["Data Center", "Ultra High-end", "Workstation", "Mid-range", "Desktop AI", "Edge AI"]],
  ["CPU", ["Dual AMD Rome 7742 128C", "Dual Xeon Scalable 28C", "Dual Xeon E5-2600 v4/v3", "Xeon W-2200/W-2100", "20-core Arm Grace", "72-core Arm Grace"]],
  ["GPU", ["8x A100 80GB", "Up to 4x GPU", "Up to 3x Quadro/Tesla", "Up to 3x GPU", "GB10 Blackwell", "Blackwell 128 SM"]],
  ["AI Performance", ["5 PFLOPS", "Depends on GPU", "Depends on GPU", "Depends on GPU", "1 PFLOP", "2,070 TFLOPS"]],
  ["Memory", ["2 TB + 640GB GPU", "Up to 4 TB", "Up to 2 TB", "Up to 512 GB", "128 GB Unified", "128 GB Unified"]],
  ["Storage", ["30 TB NVMe", "8 bays + M.2", "6 bays (4 hot-swap)", "8 bays + M.2 + U.2", "4 TB NVMe", "1 TB NVMe"]],
  ["Power", ["6.5 kW", "2,200W Titanium", "900W Gold", "900W Gold", "240W", "40-130W"]],
  ["Form Factor", ["6U Rack", "4U Rack/Tower", "Tower", "Mid-Tower", "Desktop (1.2 kg)", "Desktop"]],
  ["เหมาะกับ", ["AI Training ขนาดใหญ่", "Multi-GPU Training", "Training/Rendering", "Inference/Dev", "LLM Dev/Fine-tune", "Edge AI/Robotics"]],
];

const useCases = [
  { title: "หน่วยงานราชการ On-Premise (PDPA)", models: ["DGX Spark", "AGX Thor", "DGX A100"] },
  { title: "ห้องเรียน / Lab มหาวิทยาลัย", models: ["W830", "WS1020"] },
  { title: "โรงงาน AI Inference + Vision", models: ["AGX Thor", "DGX Spark"] },
  { title: "Robotics / Autonomous", models: ["AGX Thor"] },
  { title: "AI Startup / R&D Lab พัฒนา LLM", models: ["DGX Spark", "WS2030"] },
  { title: "การแพทย์ Medical AI Training", models: ["WS2030", "DGX A100"] },
];

export default function JetsonGPUServer() {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>GPU Server & AI Workstation — NVIDIA DGX, Leadtek | ENT Group</title>
        <meta name="description" content="เซิร์ฟเวอร์ AI และเวิร์กสเตชัน GPU สำหรับ Deep Learning, AI Training, Inference และ 3D Rendering — NVIDIA DGX A100, DGX Spark, AGX Thor, Leadtek WS2030/WS1020/W830 รองรับหน่วยงานภาครัฐ ออกใบกำกับภาษี" />
        <link rel="canonical" href="https://www.entgroup.co.th/nvidia-jetson/gpu-server" />
      </Helmet>

      <SiteNavbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0a0e27] text-white">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: "url(https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1920&q=80)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e27]/80 via-[#0a0e27]/70 to-[#0a0e27]" />
        <div className="relative container mx-auto px-4 py-20 md:py-28">
          <Link to="/nvidia-jetson" className="inline-flex items-center gap-1 text-sm text-white/70 hover:text-white mb-6">
            <ArrowLeft className="w-4 h-4" /> กลับ NVIDIA Jetson
          </Link>
          <span
            className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-1.5 rounded-full mb-4"
            style={{ background: `${NV}20`, color: NV, border: `1px solid ${NV}50` }}
          >
            <Server className="w-4 h-4" /> GPU Server & AI Workstation
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
            GPU Server & AI Workstation
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-3xl leading-relaxed">
            เซิร์ฟเวอร์ AI และเวิร์กสเตชัน GPU สำหรับ Deep Learning, AI Training, Inference และ 3D Rendering — รองรับหน่วยงานภาครัฐ ออกใบกำกับภาษี
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            <Link to="/quote" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all hover:opacity-90" style={{ background: NV, color: "#0a0e27" }}>
              <FileText className="w-4 h-4" /> ขอใบเสนอราคา
            </Link>
            <a href="tel:020456104" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-white/20 hover:border-white/40 hover:bg-white/5 font-semibold transition-all">
              <Phone className="w-4 h-4" /> 02-045-6104
            </a>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="container mx-auto px-4 py-12 md:py-16 space-y-10">
        {products.map((p) => <ProductRow key={p.id} p={p} />)}
      </section>

      {/* Compare */}
      <section className="bg-muted/30 border-y">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">เปรียบเทียบทุกรุ่น</h2>
            <p className="text-muted-foreground text-sm">เลือกรุ่นที่เหมาะกับ Workload และงบประมาณของคุณ</p>
          </div>
          <div className="overflow-x-auto rounded-xl border bg-card">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-3 font-semibold sticky left-0 bg-muted/50 z-10">รายการ</th>
                  {compareCols.map((c) => (
                    <th key={c} className="text-left p-3 font-semibold whitespace-nowrap" style={{ color: NV }}>{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {compareRows.map(([label, vals]) => (
                  <tr key={label} className="border-t hover:bg-muted/20">
                    <td className="p-3 font-medium sticky left-0 bg-card">{label}</td>
                    {vals.map((v, i) => <td key={i} className="p-3 text-muted-foreground whitespace-nowrap">{v}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">เลือกรุ่นที่เหมาะกับงานของคุณ</h2>
          <p className="text-muted-foreground text-sm">แนะนำตามประเภทอุตสาหกรรมและการใช้งาน</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {useCases.map((uc) => (
            <div key={uc.title} className="rounded-xl border bg-card p-5 hover:shadow-lg transition-all hover:border-primary/30">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${NV}20`, color: NV }}>
                  <Zap className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-base">{uc.title}</h3>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {uc.models.map((m) => (
                  <span key={m} className="text-xs font-medium px-2.5 py-1 rounded-full border" style={{ borderColor: `${NV}50`, color: NV, background: `${NV}10` }}>
                    {m}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-[#0a0e27] to-[#1a1e47] text-white">
        <div className="container mx-auto px-4 py-14 text-center">
          <Award className="w-12 h-12 mx-auto mb-4" style={{ color: NV }} />
          <h2 className="text-2xl md:text-3xl font-bold mb-3">ไม่แน่ใจว่ารุ่นไหนเหมาะกับองค์กรของคุณ?</h2>
          <p className="text-white/70 mb-6 max-w-2xl mx-auto">
            ทีมวิศวกร ENT Group ให้คำปรึกษาฟรี ออกใบเสนอราคา รองรับจัดซื้อหน่วยงานรัฐ
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/quote" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all hover:opacity-90" style={{ background: NV, color: "#0a0e27" }}>
              <FileText className="w-4 h-4" /> ขอใบเสนอราคา
            </Link>
            <a href="tel:020456104" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-white/20 hover:border-white/40 hover:bg-white/5 font-semibold transition-all">
              <Phone className="w-4 h-4" /> 02-045-6104
            </a>
            <LineQRButton className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-white/20 hover:border-white/40 hover:bg-white/5 font-semibold transition-all" />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function ProductRow({ p }: { p: Product }) {
  return (
    <article className="rounded-2xl border bg-card overflow-hidden hover:shadow-xl transition-all">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
        {/* Image */}
        <div className="lg:col-span-2 relative bg-muted/30 aspect-[4/3] lg:aspect-auto lg:min-h-[420px] flex items-center justify-center p-8">
          <img
            src={p.image}
            alt={p.name}
            loading="lazy"
            className="max-w-full max-h-full object-contain"
            onError={(e) => { (e.target as HTMLImageElement).src = "/product-placeholder.svg"; }}
          />
        </div>
        {/* Body */}
        <div className="lg:col-span-3 p-6 md:p-8 flex flex-col">
          <div className="flex items-start gap-2 flex-wrap mb-2">
            <h3 className="text-xl md:text-2xl font-bold">{p.name}</h3>
            {p.badges?.map((b) => (
              <span
                key={b.label}
                className="text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide"
                style={
                  b.tone === "new"
                    ? { background: "#ef4444", color: "#fff" }
                    : b.tone === "flagship"
                    ? { background: NV, color: "#0a0e27" }
                    : { background: `${NV}20`, color: NV, border: `1px solid ${NV}50` }
                }
              >
                {b.label}
              </span>
            ))}
          </div>
          <p className="text-sm font-medium mb-2" style={{ color: NV }}>{p.tagline}</p>
          <p className="text-sm text-muted-foreground mb-5 leading-relaxed">{p.desc}</p>

          {/* Spec table */}
          <div className="rounded-lg border overflow-hidden mb-5 flex-1">
            <table className="w-full text-xs md:text-sm">
              <tbody>
                {p.specs.map(([k, v], i) => (
                  <tr key={k} className={i % 2 ? "bg-muted/20" : ""}>
                    <td className="py-2 px-3 font-medium text-muted-foreground border-r w-1/3 align-top">{k}</td>
                    <td className="py-2 px-3 align-top">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              to={`/quote?product=${p.quoteSlug}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all hover:opacity-90"
              style={{ background: NV, color: "#0a0e27" }}
            >
              <FileText className="w-4 h-4" /> ขอใบเสนอราคา
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border font-semibold text-sm hover:border-primary/50 transition-all"
            >
              <Cpu className="w-4 h-4" /> ปรึกษาวิศวกร
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
