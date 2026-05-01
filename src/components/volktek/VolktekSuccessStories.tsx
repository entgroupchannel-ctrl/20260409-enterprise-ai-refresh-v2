import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Quote, MapPin, CheckCircle2, Factory, Camera, Plane, Train, Building2, Cpu, Package, ArrowRight } from "lucide-react";
import QuoteRequestButton from "@/components/QuoteRequestButton";
import {
  volktekLayer3,
  volktekIndustrialPoe,
  volktekIndustrialEthernet,
  volktekMetroEthernet,
  type VolktekProduct,
  type VolktekCategory,
} from "@/data/volktek-products";

type Story = {
  id: string;
  industry: string;
  icon: typeof Factory;
  region: string;
  title: string;
  customer: string;
  challenge: string;
  solution: string;
  models: string[];
  /** รุ่นในแคตตาล็อก ENT (รุ่นจริงที่อ้างใน case + รุ่นใกล้เคียง) */
  relatedModels: string[];
  benefits: string[];
  outcome: string;
  sourceUrl: string;
};

const stories: Story[] = [
  {
    id: "welding-robot",
    industry: "Smart Manufacturing",
    icon: Cpu,
    region: "Steel Manufacturing",
    title: "Digital Twin Gantry Welding Robot — Real-Time Motion Control",
    customer: "ผู้ผลิตหุ่นยนต์เชื่อมโลหะ Gantry แบบ Digital Twin",
    challenge:
      "ระบบหุ่นยนต์ต้องประสานงานหลายแกนแบบเรียลไทม์ พร้อมรับสตรีมวิดีโอความละเอียดสูงสำหรับ AI Vision ในสภาพแวดล้อมโรงเหล็กที่มีความร้อน แรงสั่นสะเทือน และคลื่นรบกวน EMI สวิตช์ทั่วไปหลุดการเชื่อมต่อบ่อย",
    solution:
      "เลือก INS-8408E Industrial Ethernet Switch ที่ออกแบบมาเพื่อ Automation โดยเฉพาะ พร้อมเทคโนโลยี iQoS จัดลำดับ Traffic ควบคุมหุ่นยนต์ให้ Deterministic",
    models: ["INS-8408E"],
    relatedModels: ["INS-8408E", "INS-8408A", "INS-8108E", "9561-8GT4XS-TSN", "9561-8GP4XS-TSN"],
    benefits: [
      "Multi-axis Synchronization แม่นยำระดับมิลลิวินาที",
      "8× Gigabit รองรับ Vision + Sensor พร้อมกัน",
      "ทนงาน -40°C ถึง 75°C + EMI Resistant",
      "Dual Redundant Power กันไฟตก",
    ],
    outcome:
      "ระบบเชื่อมหุ่นยนต์ทำงานต่อเนื่อง ลดเวลา Downtime และคงความแม่นยำของรอยเชื่อมแม้ในสภาพโรงงานหนัก",
    sourceUrl: "https://www.volktek.com/storydetail_en.php?id=63945",
  },
  {
    id: "smart-city",
    industry: "Smart City",
    icon: Building2,
    region: "Global Deployments",
    title: "Smart Pole — โครงข่ายเสาอัจฉริยะสำหรับเมืองอัจฉริยะ",
    customer: "เทศบาลและผู้พัฒนาโครงสร้างพื้นฐานเมือง",
    challenge:
      "เสาอัจฉริยะรวมกล้อง CCTV, ไฟ LED, Wi-Fi Hotspot, เซ็นเซอร์สิ่งแวดล้อม และระบบฉุกเฉินเข้าด้วยกัน ต้องการอุปกรณ์ที่จ่ายไฟ + ส่งข้อมูล + ทนสภาพภายนอก ตลอด 24/7",
    solution:
      "ใช้ SEN-8428PL-24V Managed PoE Switch สำหรับเสาอัจฉริยะ พร้อม Fiber Uplink เชื่อมศูนย์กลาง และ Ring Topology สำหรับ Redundancy",
    models: ["SEN-8428PL-24V"],
    relatedModels: ["SEN-8428PL-24V", "SEN-8428PL", "SEN-8425PL-24V", "SEN-8424PL", "IEN-8648PA-24V"],
    benefits: [
      "8× PoE+ (30W/พอร์ต, รวม 240W) จ่ายไฟกล้อง/AP/IoT",
      "2× Fiber Uplink เชื่อมระยะไกลถึงศูนย์ควบคุม",
      "VLAN + QoS แยกทราฟฟิควิดีโอ/ควบคุม",
      "Ring Topology + Power Redundancy 24/7",
    ],
    outcome:
      "เสาอัจฉริยะหลายต้นเชื่อมต่อไร้รอยต่อ เปิดทางให้บริการเมืองครอบคลุม จากความปลอดภัยสาธารณะถึงข้อมูลสิ่งแวดล้อม",
    sourceUrl: "https://www.volktek.com/storydetail_en.php?id=63131",
  },
  {
    id: "wafer-prober",
    industry: "Semiconductor",
    icon: Cpu,
    region: "Tokyo Electron · Japan",
    title: "Wafer Prober Prexa™ MS — ทดสอบ DRAM ความเร็วสูง",
    customer: "Tokyo Electron — ผู้นำอุปกรณ์ผลิตเซมิคอนดักเตอร์",
    challenge:
      "เครื่องทดสอบ Wafer Prober 300mm สำหรับ DRAM ขั้นสูง ต้องการการสื่อสาร LAN ที่เสถียรระหว่างหน่วยควบคุม จัดการข้อมูลทดสอบปริมาณมหาศาล โดยห้ามผิดพลาด",
    solution:
      "Tokyo Electron เลือก Volktek INS-8408A เป็น Backbone ของ Prexa™ MS เพราะความน่าเชื่อถือและประสิทธิภาพคงที่ในงาน High-Load",
    models: ["INS-8408A"],
    benefits: [
      "Throughput สูง รับข้อมูลทดสอบ DRAM ปริมาณมาก",
      "เสถียรในงาน High-Load ตลอดสายการผลิต",
      "เชื่อมหน่วยควบคุม Upstream/Downstream แม่นยำ",
      "เพิ่มประสิทธิภาพการผลิตเชิงปริมาณ (High-Volume)",
    ],
    outcome:
      "Prexa™ MS ทำงานเต็มประสิทธิภาพในไลน์ผลิตหน่วยความจำ ช่วย Tokyo Electron รักษาความได้เปรียบในตลาดทดสอบ DRAM",
    sourceUrl: "https://www.volktek.com/storydetail_en.php?id=39846",
  },
  {
    id: "wind-farm-adls",
    industry: "Aviation Safety",
    icon: Plane,
    region: "Wind Farm · Airport",
    title: "Aircraft Detection Lighting (ADLS) — ลดความเสี่ยงเครื่องบินชนกังหันลม",
    customer: "ผู้ดูแลสนามบินและฟาร์มกังหันลม",
    challenge:
      "ระบบ ADLS ต้องเชื่อมเรดาร์ ไฟเตือน SCADA และศูนย์ควบคุมระยะไกล ทำงานในสภาพอากาศสุดขั้ว สอดคล้องกับ FAA Regulations",
    solution:
      "ใช้ Volktek Woodpecker 9015-8GT2GS-I Full-Managed Industrial Switch เป็น Backbone เชื่อมต่อ PLC, HMI, Radar, Wind Turbine และ SCADA",
    models: ["Woodpecker 9015-8GT2GS-I"],
    benefits: [
      "ทำงานในอุณหภูมิ -40°C ถึง 75°C",
      "8× Gigabit RJ45 + 2× SFP Uplink ระยะไกล",
      "เชื่อมกับ SCADA/Radar/Turbine แบบ Real-time",
      "Fiber Network เพิ่มความน่าเชื่อถือ ลด Downtime",
    ],
    outcome:
      "ระบบเตือนเครื่องบินทำงานต่อเนื่องและสอดคล้องกฎ FAA ยกระดับความปลอดภัยน่านฟ้ารอบฟาร์มกังหันลม",
    sourceUrl: "https://www.volktek.com/storydetail_en.php?id=39792",
  },
  {
    id: "singapore-surveillance",
    industry: "City Surveillance",
    icon: Camera,
    region: "Singapore",
    title: "City Surveillance Singapore — Smart City Transformation",
    customer: "Singapore Smart Nation Initiative",
    challenge:
      "สิงคโปร์ต้องการเพิ่มความเร็วอินเทอร์เน็ต และจัดระเบียบสายเคเบิลที่ซับซ้อนระหว่างกล้องวงจรปิดกับเสาไฟ เพื่อก้าวสู่ Smart City อย่างเต็มรูปแบบ",
    solution:
      "ติดตั้ง IEN-8648PA Industrial PoE+ Switch ในตู้ควบคุมเสาไฟ และ Attis 5100-24GT2GS เป็น Aggregation ในศูนย์ควบคุม",
    models: ["IEN-8648PA", "Attis 5100-24GT2GS"],
    benefits: [
      "PoE+ จ่ายไฟกล้องผ่านสาย LAN ลดสายไฟแยก",
      "8× GbE Downlink + 4× SFP Uplink เพื่อ Backhaul",
      "ออกแบบ Industrial-Grade เสถียรกลางแจ้ง",
      "Aggregation Switch จัดการระยะไกลผ่าน Fiber",
    ],
    outcome:
      "ลดความซับซ้อนของสายเคเบิล ส่งข้อมูลภาพจากกล้องเรียลไทม์ ยกระดับความปลอดภัยและการเป็น Smart City อย่างยั่งยืน",
    sourceUrl: "https://www.volktek.com/storydetail_en.php?id=39787",
  },
  {
    id: "metro-system",
    industry: "Metro / Rail Transit",
    icon: Train,
    region: "Metro System Upgrade 2023",
    title: "Metro System Upgrade — Ring Network 10G Backbone",
    customer: "ผู้ให้บริการ Metro / Rail Transit",
    challenge:
      "ยกระดับระบบเครือข่ายระหว่างสถานี รองรับแบนด์วิดท์สูงขึ้น และสร้างเครือข่าย Ring ในสถานีย่อยให้ทำงานต่อเนื่องแม้สายขาด",
    solution:
      "Deploy 6500-24GS4XS-C เป็น 10G Backbone ระหว่างสถานี + IEN-8648PA และ Hawkeye 9060-4GP2GS PoE++ ในสถานีย่อย สร้าง Ring Network",
    models: ["6500-24GS4XS-C", "IEN-8648PA", "Hawkeye 9060-4GP2GS"],
    benefits: [
      "10G Backbone ลด Latency ระหว่างสถานี",
      "Ring Topology + LACP เพิ่มความน่าเชื่อถือ",
      "PoE++ 60/90W จ่ายไฟกล้อง PTZ + AP",
      "Perpetual & Fast PoE — อุปกรณ์ไม่สะดุดเมื่อสวิตช์รีบูต",
    ],
    outcome:
      "ผู้โดยสารได้ Wi-Fi และบริการดิจิทัลที่ลื่นไหล ขณะที่ระบบกล้อง/เซ็นเซอร์ทำงานต่อเนื่องแบบ Mission-Critical",
    sourceUrl: "https://www.volktek.com/storydetail_en.php?id=39787",
  },
];

const VolktekSuccessStories = () => {
  const [activeId, setActiveId] = useState<string>(stories[0].id);
  const active = stories.find((s) => s.id === activeId)!;
  const ActiveIcon = active.icon;

  return (
    <section id="success-stories" className="card-surface p-6 md:p-8">
      <div className="text-center mb-8">
        <span className="text-xs font-semibold tracking-widest uppercase text-primary mb-2 block">
          Customer Success Stories
        </span>
        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-3">
          ผลงานจริงที่ <span className="text-gradient">ลูกค้าทั่วโลกไว้วางใจ</span>
        </h2>
        <p className="text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          จาก Tokyo Electron ในญี่ปุ่น สู่ Smart City สิงคโปร์ — Volktek เป็นโครงข่ายเบื้องหลังระบบ Mission-Critical
          ในอุตสาหกรรมเซมิคอนดักเตอร์ รถไฟฟ้า เมืองอัจฉริยะ และระบบอัตโนมัติทั่วโลก
        </p>
      </div>

      {/* Story Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-6">
        {stories.map((s) => {
          const Icon = s.icon;
          const isActive = s.id === activeId;
          return (
            <button
              key={s.id}
              onClick={() => setActiveId(s.id)}
              className={`group rounded-xl border-2 p-3 text-left transition-all hover:-translate-y-0.5 ${
                isActive
                  ? "border-primary bg-primary/5 shadow-md"
                  : "border-border hover:border-primary/40 bg-slate-200"
              }`}
            >
              <Icon
                className={`w-5 h-5 mb-1.5 ${isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary"}`}
              />
              <div className="text-[11px] font-semibold text-foreground leading-tight">{s.industry}</div>
              <div className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">{s.region}</div>
            </button>
          );
        })}
      </div>

      {/* Active Story Detail */}
      <div className="rounded-xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-background to-accent/5 p-6 md:p-8">
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <Badge className="bg-primary/15 text-primary border-primary/30">
            <ActiveIcon className="w-3 h-3 mr-1" /> {active.industry}
          </Badge>
          <Badge variant="outline" className="border-border">
            <MapPin className="w-3 h-3 mr-1" /> {active.region}
          </Badge>
          {active.models.map((m) => (
            <Badge key={m} variant="secondary" className="text-[10px]">
              {m}
            </Badge>
          ))}
        </div>

        <h3 className="text-xl md:text-2xl font-display font-bold text-foreground mb-2 leading-tight">
          {active.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-6 italic">
          <Quote className="w-3.5 h-3.5 inline mr-1 text-primary" />
          ลูกค้า: {active.customer}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          <div className="rounded-lg bg-background/60 border border-border p-4">
            <div className="text-[11px] font-semibold tracking-wider uppercase text-destructive/80 mb-1.5">
              Challenge
            </div>
            <p className="text-sm text-foreground/90 leading-relaxed">{active.challenge}</p>
          </div>
          <div className="rounded-lg bg-background/60 border border-border p-4">
            <div className="text-[11px] font-semibold tracking-wider uppercase text-primary mb-1.5">
              Volktek Solution
            </div>
            <p className="text-sm text-foreground/90 leading-relaxed">{active.solution}</p>
          </div>
        </div>

        <div className="rounded-lg bg-background/60 border border-border p-4 mb-5">
          <div className="text-[11px] font-semibold tracking-wider uppercase text-primary mb-2">
            Key Benefits
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {active.benefits.map((b, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-foreground/85">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg bg-primary/5 border border-primary/20 p-4 mb-5">
          <div className="text-[11px] font-semibold tracking-wider uppercase text-primary mb-1.5">
            Outcome
          </div>
          <p className="text-sm text-foreground font-medium leading-relaxed">{active.outcome}</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <QuoteRequestButton
            productModel={active.models[0]}
            productName={`Volktek ${active.models[0]}`}
            size="sm"
          />
          <Button variant="outline" size="sm" asChild>
            <a href={active.sourceUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-3.5 h-3.5 mr-1.5" /> อ่าน Case Study เต็มที่ Volktek.com
            </a>
          </Button>
        </div>
      </div>

      {/* Trust footer */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-border">
        <div className="text-center">
          <div className="text-2xl md:text-3xl font-display font-bold text-primary">30+</div>
          <div className="text-[11px] text-muted-foreground uppercase tracking-wider">Years Experience</div>
        </div>
        <div className="text-center">
          <div className="text-2xl md:text-3xl font-display font-bold text-primary">60+</div>
          <div className="text-[11px] text-muted-foreground uppercase tracking-wider">Countries Served</div>
        </div>
        <div className="text-center">
          <div className="text-2xl md:text-3xl font-display font-bold text-primary">Mission</div>
          <div className="text-[11px] text-muted-foreground uppercase tracking-wider">Critical Network</div>
        </div>
        <div className="text-center">
          <div className="text-2xl md:text-3xl font-display font-bold text-primary">DNV/GL</div>
          <div className="text-[11px] text-muted-foreground uppercase tracking-wider">ISO · CE · FCC</div>
        </div>
      </div>
    </section>
  );
};

export default VolktekSuccessStories;
