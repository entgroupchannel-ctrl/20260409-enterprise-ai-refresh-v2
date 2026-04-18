import imgDgxA100 from "@/assets/jetson/dgx-a100.jpg";
import imgDgxSpark from "@/assets/jetson/dgx-spark.jpg";
import imgAgxThor from "@/assets/jetson/agx-thor.jpg";
import imgWs2030 from "@/assets/jetson/ws2030.jpg";
import imgWs1020 from "@/assets/jetson/ws1020.jpg";
import imgW830 from "@/assets/jetson/w830.jpg";

export type GpuServerBadgeTone = "new" | "flagship" | "cert";

export type GpuServer = {
  id: string;
  name: string;
  type: string; // Desktop / Workstation / Data Center / Edge AI Server
  badges?: { label: string; tone?: GpuServerBadgeTone }[];
  tagline: string;
  desc: string;
  image: string;
  specs: [string, string][];
  quoteSlug: string;
};

export const gpuServers: GpuServer[] = [
  {
    id: "dgx-a100",
    name: "NVIDIA DGX A100 640GB",
    type: "Data Center / Rackmount",
    badges: [{ label: "Flagship", tone: "flagship" }],
    tagline: "เซิร์ฟเวอร์ AI ระดับ Data Center (Rackmount 6U)",
    desc: "เซิร์ฟเวอร์ AI ระดับ Data Center — 8 GPU A100 80GB รวม 640GB, 5 PFLOPS สำหรับ AI Training ขนาดใหญ่",
    image: imgDgxA100,
    quoteSlug: "dgx-a100",
    specs: [
      ["GPU", "8x NVIDIA A100 80GB Tensor Core GPUs"],
      ["GPU Memory", "640 GB total"],
      ["Performance", "5 petaFLOPS AI, 10 petaOPS INT8"],
      ["NVSwitches", "6"],
      ["CPU", "Dual AMD Rome 7742, 128 cores, 2.25 GHz base / 3.4 GHz boost"],
      ["System Memory", "2 TB"],
      ["Networking", "8x ConnectX-7 200Gb/s InfiniBand + 2x ConnectX-7 VPI"],
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
    type: "Workstation / 4U Rack/Tower",
    tagline: "เวิร์กสเตชัน GPU ระดับสูงสุด 4U Rack/Tower — รองรับ 4 GPU, 4TB RAM, 10GbE, 2200W Titanium",
    desc: "เวิร์กสเตชัน GPU ระดับสูงสุด 4U Rack/Tower — รองรับ 4 GPU, 4TB RAM, 10GbE, 2200W Titanium สำหรับ AI Training และ 3D Rendering",
    image: imgWs2030,
    quoteSlug: "ws2030",
    specs: [
      ["CPU", "Dual Socket P (LGA 3647), 2nd Gen Intel Xeon Scalable, up to 28 cores"],
      ["Chipset", "Intel C621"],
      ["Memory", "16 DIMM, up to 4TB DDR4-2933MHz ECC"],
      ["Network", "Intel X550 Dual Port 10GBase-T + IPMI 2.0"],
      ["Storage Bays", "8 Hot-swap 3.5\" + Optional 4x 2.5\" NVMe + 1x M.2"],
      ["PCIe Slots", "4x PCIe 3.0 x16 (double-width) + 2x PCIe 3.0 x16 + 1x PCIe 3.0 x4"],
      ["GPU Support", "Up to 4 GPUs (double-width)"],
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
    type: "Workstation / Tower",
    tagline: "เวิร์กสเตชัน GPU ระดับกลาง-สูง — Dual Xeon E5, 2TB RAM, รองรับ 3 GPU",
    desc: "เวิร์กสเตชัน GPU Dual Xeon E5-2600 v4/v3 — รองรับ RAM สูงสุด 2TB DDR4 ECC, 3 GPU, 6 ช่องฮาร์ดดิสก์ (4 Hot-swap), พาวเวอร์ 900W Gold",
    image: imgWs1020,
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
    type: "Workstation / Mid-Tower",
    badges: [{ label: "Data Science Certified", tone: "cert" }],
    tagline: "เวิร์กสเตชัน GPU ระดับกลาง Mid-Tower — รองรับ 3 GPU, 512GB RAM, NVIDIA Data Science Certified",
    desc: "เวิร์กสเตชัน GPU ระดับกลาง Mid-Tower — รองรับ 3 GPU, 512GB RAM, 5G LAN, NVIDIA Data Science Certified สำหรับ AI/Deep Learning/3D Rendering",
    image: imgW830,
    quoteSlug: "w830",
    specs: [
      ["CPU", "Single Socket R4 (LGA 2066), Intel Xeon W-2200/W-2100"],
      ["Chipset", "Intel C422"],
      ["Memory", "8 DIMM, up to 512GB DDR4-2666MHz ECC LRDIMM"],
      ["Network", "Intel I219LM LAN + Aquantia 5G LAN AQC108"],
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
    type: "Desktop AI",
    badges: [{ label: "NEW", tone: "new" }, { label: "Blackwell", tone: "flagship" }],
    tagline: "ซูเปอร์คอมพิวเตอร์ AI บนโต๊ะทำงาน",
    desc: "ซูเปอร์คอมพิวเตอร์ AI บนโต๊ะทำงาน — Grace Blackwell, 1 PFLOP, 128GB Unified Memory, 4TB NVMe สำหรับพัฒนา LLM/Generative AI ภายในองค์กร",
    image: imgDgxSpark,
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
    type: "Edge AI Server / Desktop",
    badges: [{ label: "NEW", tone: "new" }, { label: "Blackwell", tone: "flagship" }, { label: "Physical AI", tone: "cert" }],
    tagline: "แพลตฟอร์ม AI ระดับ Blackwell สำหรับ Robotics และ Edge",
    desc: "แพลตฟอร์ม AI ระดับ Blackwell สำหรับ Robotics และ Edge — 2,070 TFLOPS, 128GB, MIG 7 partitions, ทำงานที่ 40-130W ทรงพลังที่สุดในตระกูล Jetson",
    image: imgAgxThor,
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
