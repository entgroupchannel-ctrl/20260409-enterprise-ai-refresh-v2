import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, FileText, Phone, Cpu, Award, Sparkles } from "lucide-react";
import SiteNavbar from "@/components/SiteNavbar";
import Footer from "@/components/Footer";
import LineQRButton from "@/components/LineQRButton";
import imgRtx6000Ada from "@/assets/jetson/rtx6000-ada.jpg";
import imgRtxA6000 from "@/assets/jetson/rtx-a6000.jpg";
import imgRtxA from "@/assets/jetson/rtx-a-series.jpg";
import imgQuadroRtx from "@/assets/jetson/quadro-rtx.jpg";
import imgQuadroPascal from "@/assets/jetson/quadro-pascal.jpg";
import imgTSeries from "@/assets/jetson/nvidia-t-series.jpg";
import imgTitanRtx from "@/assets/jetson/titan-rtx.jpg";
import imgQuadroSync from "@/assets/jetson/quadro-sync.jpg";

const NV = "#76B900";

type Family = "all" | "ada" | "a-series" | "quadro-rtx" | "legacy";

type GPU = {
  id: string;
  name: string;
  family: Exclude<Family, "all">;
  arch: string;
  badges?: { label: string; tone?: "flagship" | "new" | "info" }[];
  image: string;
  specs: { label: string; value: string }[];
};

const gpus: GPU[] = [
  {
    id: "rtx6000-ada", name: "NVIDIA RTX 6000 Ada Generation", family: "ada", arch: "Ada Lovelace",
    badges: [{ label: "Flagship", tone: "flagship" }, { label: "Ada Lovelace", tone: "new" }],
    image: imgRtx6000Ada,
    specs: [
      { label: "Architecture", value: "Ada Lovelace" },
      { label: "CUDA Cores", value: "18,176" },
      { label: "Tensor Cores", value: "568" },
      { label: "RT Cores", value: "142" },
    ],
  },
  {
    id: "rtx-a6000", name: "NVIDIA RTX A6000", family: "a-series", arch: "Ampere",
    badges: [{ label: "Ampere", tone: "info" }],
    image: imgRtxA6000,
    specs: [
      { label: "Architecture", value: "Ampere" },
      { label: "CUDA Cores", value: "10,752" },
      { label: "Tensor Cores", value: "336" },
      { label: "RT Cores", value: "84" },
    ],
  },
  {
    id: "rtx-a5000", name: "NVIDIA RTX A5000", family: "a-series", arch: "Ampere",
    badges: [{ label: "Ampere", tone: "info" }],
    image: imgRtxA,
    specs: [
      { label: "Architecture", value: "Ampere" },
      { label: "CUDA Cores", value: "8,192" },
      { label: "Tensor Cores", value: "256" },
      { label: "RT Cores", value: "64" },
    ],
  },
  {
    id: "rtx-a4000", name: "NVIDIA RTX A4000", family: "a-series", arch: "Ampere",
    badges: [{ label: "Ampere", tone: "info" }],
    image: imgRtxA,
    specs: [
      { label: "Architecture", value: "Ampere" },
      { label: "CUDA Cores", value: "6,144" },
      { label: "Tensor Cores", value: "192" },
      { label: "RT Cores", value: "48" },
    ],
  },
  {
    id: "quadro-rtx8000", name: "QUADRO RTX 8000", family: "quadro-rtx", arch: "Turing",
    badges: [{ label: "Turing", tone: "info" }],
    image: imgQuadroRtx,
    specs: [
      { label: "Architecture", value: "Turing" },
      { label: "CUDA Cores", value: "4,608" },
      { label: "Tensor Cores", value: "576" },
      { label: "RT Cores", value: "72" },
    ],
  },
  {
    id: "quadro-rtx6000", name: "QUADRO RTX 6000", family: "quadro-rtx", arch: "Turing",
    badges: [{ label: "Turing", tone: "info" }],
    image: imgQuadroRtx,
    specs: [
      { label: "Architecture", value: "Turing" },
      { label: "CUDA Cores", value: "4,608" },
      { label: "Tensor Cores", value: "576" },
      { label: "RT Cores", value: "72" },
    ],
  },
  {
    id: "quadro-rtx5000", name: "QUADRO RTX 5000", family: "quadro-rtx", arch: "Turing",
    badges: [{ label: "Turing", tone: "info" }],
    image: imgQuadroRtx,
    specs: [
      { label: "Architecture", value: "Turing" },
      { label: "CUDA Cores", value: "3,072" },
      { label: "Tensor Cores", value: "384" },
      { label: "RT Cores", value: "48" },
    ],
  },
  {
    id: "quadro-rtx4000", name: "QUADRO RTX 4000", family: "quadro-rtx", arch: "Turing",
    badges: [{ label: "Turing", tone: "info" }],
    image: imgQuadroRtx,
    specs: [
      { label: "Architecture", value: "Turing" },
      { label: "CUDA Cores", value: "2,304" },
      { label: "Tensor Cores", value: "288" },
      { label: "RT Cores", value: "36" },
    ],
  },
  {
    id: "quadro-gp100", name: "Quadro GP100", family: "legacy", arch: "Pascal",
    badges: [{ label: "Pascal", tone: "info" }, { label: "HBM2", tone: "info" }],
    image: imgQuadroPascal,
    specs: [
      { label: "Architecture", value: "Pascal" },
      { label: "CUDA Cores", value: "3,584" },
      { label: "Memory", value: "16 GB HBM2 ECC" },
      { label: "Interface", value: "4096-bit" },
    ],
  },
  {
    id: "quadro-p6000", name: "Quadro P6000", family: "legacy", arch: "Pascal",
    badges: [{ label: "Pascal", tone: "info" }],
    image: imgQuadroPascal,
    specs: [
      { label: "Architecture", value: "Pascal" },
      { label: "CUDA Cores", value: "3,840" },
      { label: "Memory", value: "24 GB GDDR5X" },
      { label: "Interface", value: "384-bit" },
    ],
  },
  {
    id: "quadro-p4000", name: "Quadro P4000", family: "legacy", arch: "Pascal",
    badges: [{ label: "Pascal", tone: "info" }],
    image: imgQuadroPascal,
    specs: [
      { label: "Architecture", value: "Pascal" },
      { label: "CUDA Cores", value: "1,792" },
      { label: "Memory", value: "8 GB GDDR5" },
      { label: "Interface", value: "256-bit" },
    ],
  },
  {
    id: "quadro-p2200", name: "Quadro P2200", family: "legacy", arch: "Pascal",
    badges: [{ label: "Pascal", tone: "info" }],
    image: imgQuadroPascal,
    specs: [
      { label: "Architecture", value: "Pascal" },
      { label: "CUDA Cores", value: "1,280" },
      { label: "Memory", value: "5 GB GDDR5X" },
      { label: "Interface", value: "160-bit" },
    ],
  },
  {
    id: "quadro-p2000", name: "Quadro P2000", family: "legacy", arch: "Pascal",
    badges: [{ label: "Pascal", tone: "info" }],
    image: imgQuadroPascal,
    specs: [
      { label: "Architecture", value: "Pascal" },
      { label: "CUDA Cores", value: "1,024" },
      { label: "Memory", value: "5 GB GDDR5" },
      { label: "Interface", value: "160-bit" },
    ],
  },
  {
    id: "quadro-p1000", name: "Quadro P1000", family: "legacy", arch: "Pascal",
    badges: [{ label: "Pascal", tone: "info" }, { label: "Low Profile", tone: "info" }],
    image: imgTSeries,
    specs: [
      { label: "Architecture", value: "Pascal" },
      { label: "CUDA Cores", value: "640" },
      { label: "Memory", value: "4 GB GDDR5" },
      { label: "Interface", value: "128-bit" },
    ],
  },
  {
    id: "quadro-p400", name: "Quadro P400", family: "legacy", arch: "Pascal",
    badges: [{ label: "Pascal", tone: "info" }, { label: "Low Profile", tone: "info" }],
    image: imgTSeries,
    specs: [
      { label: "Architecture", value: "Pascal" },
      { label: "CUDA Cores", value: "256" },
      { label: "Memory", value: "2 GB GDDR5" },
      { label: "Interface", value: "64-bit" },
    ],
  },
  {
    id: "t1000", name: "NVIDIA T1000", family: "legacy", arch: "Turing",
    badges: [{ label: "Turing", tone: "info" }, { label: "Low Profile", tone: "info" }],
    image: imgTSeries,
    specs: [
      { label: "Architecture", value: "Turing" },
      { label: "CUDA Cores", value: "896" },
      { label: "FP32", value: "2.5 TFLOPS" },
      { label: "Memory", value: "4 / 8 GB GDDR6" },
    ],
  },
  {
    id: "t600", name: "NVIDIA T600", family: "legacy", arch: "Turing",
    badges: [{ label: "Turing", tone: "info" }, { label: "Low Profile", tone: "info" }],
    image: imgTSeries,
    specs: [
      { label: "Architecture", value: "Turing" },
      { label: "CUDA Cores", value: "640" },
      { label: "FP32", value: "1.709 TFLOPS" },
      { label: "Memory", value: "4 GB GDDR6" },
    ],
  },
  {
    id: "t400", name: "NVIDIA T400", family: "legacy", arch: "Turing",
    badges: [{ label: "Turing", tone: "info" }, { label: "Low Profile", tone: "info" }],
    image: imgTSeries,
    specs: [
      { label: "Architecture", value: "Turing" },
      { label: "CUDA Cores", value: "384" },
      { label: "FP32", value: "1.094 TFLOPS" },
      { label: "Memory", value: "2 / 4 GB GDDR6" },
    ],
  },
  {
    id: "titan-rtx", name: "TITAN RTX", family: "legacy", arch: "Turing",
    badges: [{ label: "Turing", tone: "info" }, { label: "Flagship Consumer", tone: "flagship" }],
    image: imgTitanRtx,
    specs: [
      { label: "Architecture", value: "Turing" },
      { label: "CUDA Cores", value: "4,608" },
      { label: "Tensor Cores", value: "576" },
      { label: "RT Cores", value: "72" },
    ],
  },
  {
    id: "quadro-sync-ii", name: "NVIDIA Quadro SYNC II", family: "legacy", arch: "Accessory",
    badges: [{ label: "Accessory", tone: "info" }],
    image: imgQuadroSync,
    specs: [
      { label: "Type", value: "Sync Board" },
      { label: "GPUs per Card", value: "4" },
      { label: "Max Sync Cards/System", value: "3" },
      { label: "Max GPUs/System", value: "8" },
    ],
  },
];

const familyTabs: { id: Family; label: string }[] = [
  { id: "all", label: "ทั้งหมด" },
  { id: "ada", label: "RTX Ada (ใหม่สุด)" },
  { id: "a-series", label: "RTX A-Series" },
  { id: "quadro-rtx", label: "Quadro RTX" },
  { id: "legacy", label: "Quadro P / T / อื่นๆ" },
];

const compareRows = [
  ["RTX 6000 Ada", "Ada", "18,176", "568", "142", "48GB GDDR6", "960 GB/s", "300W", "Dual"],
  ["RTX A6000", "Ampere", "10,752", "336", "84", "48GB GDDR6", "768 GB/s", "300W", "Dual"],
  ["RTX A5000", "Ampere", "8,192", "256", "64", "24GB GDDR6", "768 GB/s", "230W", "Dual"],
  ["RTX A4000", "Ampere", "6,144", "192", "48", "16GB GDDR6", "448 GB/s", "140W", "Single"],
  ["Q RTX 8000", "Turing", "4,608", "576", "72", "48GB GDDR6", "672 GB/s", "295W", "Dual"],
  ["Q RTX 6000", "Turing", "4,608", "576", "72", "24GB GDDR6", "672 GB/s", "295W", "Dual"],
  ["Q RTX 5000", "Turing", "3,072", "384", "48", "16GB GDDR6", "448 GB/s", "265W", "Dual"],
  ["Q RTX 4000", "Turing", "2,304", "288", "36", "8GB GDDR6", "416 GB/s", "160W", "Single"],
  ["T1000", "Turing", "896", "—", "—", "4/8GB GDDR6", "160 GB/s", "50W", "LP"],
  ["T600", "Turing", "640", "—", "—", "4GB GDDR6", "160 GB/s", "40W", "LP"],
  ["T400", "Turing", "384", "—", "—", "2/4GB GDDR6", "80 GB/s", "30W", "LP"],
  ["TITAN RTX", "Turing", "4,608", "576", "72", "24GB GDDR6", "672 GB/s", "280W", "Dual"],
];
const compareHeader = ["Model", "Arch", "CUDA", "Tensor", "RT", "Memory", "BW", "Power", "Slot"];

const useCases = [
  { title: "AI / Deep Learning Training", desc: "ฝึกโมเดล AI ด้วย VRAM ขนาดใหญ่ และ Tensor Cores — เหมาะสำหรับ NLP, Computer Vision และ Generative AI", models: ["RTX 6000 Ada", "RTX A6000", "Quadro RTX 8000"] },
  { title: "3D Rendering / VFX / Animation", desc: "เร่งการ Render แบบ Real-time และ Ray Tracing สำหรับงานภาพยนตร์ สถาปัตย์ และ Product Visualization", models: ["RTX 6000 Ada", "RTX A5000", "Quadro RTX 6000"] },
  { title: "CAD / CAM / BIM", desc: "GPU ที่ผ่านการรับรองสำหรับ SolidWorks, AutoCAD, Revit และ Siemens NX", models: ["RTX A4000", "Quadro RTX 4000", "Quadro P2200"] },
  { title: "Display Wall หลายจอ", desc: "ขับเคลื่อน Display หลายจอสำหรับ Control Room, Digital Signage และ Command Center", models: ["Quadro P1000", "Quadro P400", "T600"] },
  { title: "Video Editing / Color Grading", desc: "Encoding แบบ Hardware-accelerated, เล่น Timeline แบบ Real-time สำหรับงาน Video Production", models: ["RTX A5000", "RTX A4000", "TITAN RTX"] },
  { title: "Medical Imaging / AI Diagnostics", desc: "วิเคราะห์ภาพทางการแพทย์ที่เร่งด้วย GPU, ประมวลผล DICOM สำหรับโรงพยาบาลและสถาบันวิจัย", models: ["RTX A6000", "Quadro RTX 6000"] },
  { title: "งบจำกัด / Entry-level Professional", desc: "GPU ระดับมืออาชีพราคาประหยัดสำหรับงาน CAD ทั่วไป — ของแท้ NVIDIA พร้อมประกันเต็ม", models: ["T400", "T600", "Quadro P400"] },
];

export default function JetsonProfessionalGPU() {
  const [family, setFamily] = useState<Family>("all");

  const filtered = useMemo(
    () => (family === "all" ? gpus : gpus.filter((g) => g.family === family)),
    [family]
  );

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Professional Graphics Card — NVIDIA RTX, Quadro | ENT Group</title>
        <meta name="description" content="การ์ดจอ NVIDIA Professional สำหรับ AI, Deep Learning, 3D Rendering, CAD/CAM และ Video Editing — RTX 6000 Ada, RTX A6000, Quadro RTX, T-Series สินค้าแท้ ประกัน รองรับจัดซื้อหน่วยงาน" />
        <link rel="canonical" href="https://www.entgroup.co.th/nvidia-jetson/professional-gpu" />
      </Helmet>

      <SiteNavbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0a0e27] text-white">
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage: "url(https://images.unsplash.com/photo-1591488320449-011701bb6704?w=1920&q=80)",
            backgroundSize: "cover", backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e27]/80 via-[#0a0e27]/70 to-[#0a0e27]" />
        <div className="relative container max-w-7xl mx-auto px-6 py-20 md:py-24">
          <Link to="/nvidia-jetson" className="inline-flex items-center gap-1 text-sm text-white/70 hover:text-white mb-6">
            <ArrowLeft className="w-4 h-4" /> กลับ NVIDIA Jetson
          </Link>
          <span className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-1.5 rounded-full mb-4"
                style={{ background: `${NV}20`, color: NV, border: `1px solid ${NV}50` }}>
            <Sparkles className="w-4 h-4" /> Professional Graphics Card
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">Professional Graphics Card</h1>
          <p className="text-lg md:text-xl text-white/80 max-w-3xl leading-relaxed">
            การ์ดจอ NVIDIA Professional สำหรับ AI, Deep Learning, 3D Rendering, CAD/CAM และ Video Editing — สินค้าแท้ ประกัน รองรับจัดซื้อหน่วยงาน
          </p>
        </div>
      </section>

      {/* Family Tabs */}
      <section className="sticky top-16 z-30 bg-background/95 backdrop-blur-md border-b">
        <div className="container max-w-7xl mx-auto px-6 py-3">
          <div className="flex flex-wrap gap-2 justify-center">
            {familyTabs.map((t) => {
              const count = t.id === "all" ? gpus.length : gpus.filter((g) => g.family === t.id).length;
              const active = family === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setFamily(t.id)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                    active ? "border-transparent text-white shadow-md" : "border-border bg-background hover:border-primary/50 text-foreground"
                  }`}
                  style={active ? { background: NV, color: "#0a0e27" } : {}}
                >
                  {t.label}
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${active ? "bg-black/20" : "bg-muted"}`}>{count}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Cards Grid */}
      <section className="container max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((g) => <GPUCard key={g.id} g={g} />)}
        </div>
        <p className="text-center text-xs text-muted-foreground mt-6">แสดง {filtered.length} จาก {gpus.length} รุ่น</p>
      </section>

      {/* Compare */}
      <section className="bg-muted/30 border-y">
        <div className="container max-w-7xl mx-auto px-6 py-12 md:py-14">
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">เปรียบเทียบรุ่นหลัก</h2>
            <p className="text-muted-foreground text-sm">สรุปสเปกหลักของ GPU ทุกรุ่นในที่เดียว</p>
          </div>
          <div className="overflow-x-auto rounded-xl border bg-card">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  {compareHeader.map((h, i) => (
                    <th key={h} className={`text-left p-3 font-semibold whitespace-nowrap ${i === 0 ? "sticky left-0 bg-muted/50" : ""}`} style={i > 0 ? { color: NV } : {}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {compareRows.map((r) => (
                  <tr key={r[0]} className="border-t hover:bg-muted/20">
                    {r.map((c, i) => (
                      <td key={i} className={`p-3 whitespace-nowrap ${i === 0 ? "font-semibold sticky left-0 bg-card" : "text-muted-foreground"}`}>{c}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="container max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="text-center mb-3">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">เลือกการ์ดที่เหมาะกับงานของคุณ</h2>
          <p className="text-muted-foreground text-sm max-w-2xl mx-auto">คลิกแต่ละหมวดหมู่เพื่อดูข้อมูลเชิงบริหาร รายละเอียดทางเทคนิค และบริการจาก ENT Group</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          {useCases.map((uc) => (
            <div key={uc.title} className="rounded-xl border bg-card p-5 hover:shadow-lg transition-all hover:border-primary/30 flex flex-col">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${NV}20`, color: NV }}>
                  <Cpu className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-base">{uc.title}</h3>
              </div>
              <p className="text-xs text-muted-foreground mb-3 flex-1">{uc.desc}</p>
              <div className="flex flex-wrap gap-1.5">
                {uc.models.map((m) => (
                  <span key={m} className="text-xs font-medium px-2.5 py-1 rounded-full border" style={{ borderColor: `${NV}50`, color: NV, background: `${NV}10` }}>{m}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-[#0a0e27] to-[#1a1e47] text-white">
        <div className="container max-w-7xl mx-auto px-6 py-14 text-center">
          <Award className="w-12 h-12 mx-auto mb-4" style={{ color: NV }} />
          <h2 className="text-2xl md:text-3xl font-bold mb-3">ไม่แน่ใจว่ารุ่นไหนเหมาะกับงานของคุณ?</h2>
          <p className="text-white/70 mb-6 max-w-2xl mx-auto">ทีมวิศวกร ENT Group ให้คำปรึกษาฟรี ออกใบเสนอราคา รองรับจัดซื้อหน่วยงานรัฐ</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/quote" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all hover:opacity-90" style={{ background: NV, color: "#0a0e27" }}>
              <FileText className="w-4 h-4" /> ขอใบเสนอราคา
            </Link>
            <a href="tel:020456104" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-white/20 hover:border-white/40 hover:bg-white/5 font-semibold transition-all">
              <Phone className="w-4 h-4" /> 02-045-6104
            </a>
            <LineQRButton className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-white/20 hover:border-white/40 hover:bg-white/5 font-semibold transition-all">LINE @entgroup</LineQRButton>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function GPUCard({ g }: { g: GPU }) {
  return (
    <article className="group rounded-xl border bg-card overflow-hidden hover:shadow-xl hover:border-primary/30 transition-all flex flex-col">
      <div className="relative bg-muted/30 aspect-[4/3] overflow-hidden">
        <div className="absolute top-3 right-3 z-10 flex flex-wrap gap-1 max-w-[70%] justify-end">
          {g.badges?.map((b) => (
            <span
              key={b.label}
              className="text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide shadow"
              style={
                b.tone === "flagship" ? { background: NV, color: "#0a0e27" }
                : b.tone === "new" ? { background: "#ef4444", color: "#fff" }
                : { background: "rgba(255,255,255,0.95)", color: "#0a0e27", border: `1px solid ${NV}50` }
              }
            >
              {b.label}
            </span>
          ))}
        </div>
        <img
          src={g.image}
          alt={g.name}
          loading="lazy"
          className="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { (e.target as HTMLImageElement).src = "/product-placeholder.svg"; }}
        />
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-bold text-base leading-tight mb-2 line-clamp-2 group-hover:text-primary transition-colors">{g.name}</h3>
        <dl className="space-y-1 text-xs mb-4">
          {g.specs.map((s) => (
            <div key={s.label} className="flex justify-between gap-2">
              <dt className="text-muted-foreground">{s.label}</dt>
              <dd className="font-semibold text-right">{s.value}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-auto flex gap-2">
          <Link
            to={`/quote?product=${g.id}`}
            className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all hover:opacity-90"
            style={{ background: NV, color: "#0a0e27" }}
          >
            <FileText className="w-3.5 h-3.5" /> สอบถามราคา
          </Link>
        </div>
      </div>
    </article>
  );
}
