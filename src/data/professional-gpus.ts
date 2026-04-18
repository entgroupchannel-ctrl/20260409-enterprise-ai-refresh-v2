import imgRtx6000Ada from "@/assets/jetson/rtx6000-ada.jpg";
import imgRtxA6000 from "@/assets/jetson/rtx-a6000.jpg";
import imgRtxA from "@/assets/jetson/rtx-a-series.jpg";
import imgQuadroRtx from "@/assets/jetson/quadro-rtx.jpg";
import imgQuadroPascal from "@/assets/jetson/quadro-pascal.jpg";
import imgTSeries from "@/assets/jetson/nvidia-t-series.jpg";
import imgTitanRtx from "@/assets/jetson/titan-rtx.jpg";
import imgQuadroSync from "@/assets/jetson/quadro-sync.jpg";

export type ProGpuFamily = "all" | "ada" | "a-series" | "quadro-rtx" | "legacy";

export type ProGpu = {
  id: string;
  name: string;
  family: Exclude<ProGpuFamily, "all">;
  arch: string;
  badges?: { label: string; tone?: "flagship" | "new" | "info" }[];
  image: string;
  specs: { label: string; value: string }[];
  formFactor?: "single" | "dual";
  memoryGb?: number;
  workloads?: ("ai-dl" | "cad" | "3d-vfx" | "video" | "vr")[];
};

export const proGpuFamilyLabel: Record<Exclude<ProGpuFamily, "all">, string> = {
  ada: "RTX Ada",
  "a-series": "RTX A-Series",
  "quadro-rtx": "Quadro RTX",
  legacy: "Legacy / Quadro P / T",
};

export const professionalGpus: ProGpu[] = [
  { id: "rtx6000-ada", name: "NVIDIA RTX 6000 Ada Generation", family: "ada", arch: "Ada Lovelace",
    badges: [{ label: "Flagship", tone: "flagship" }, { label: "Ada Lovelace", tone: "new" }],
    image: imgRtx6000Ada, memoryGb: 48, formFactor: "dual", workloads: ["ai-dl", "3d-vfx", "vr"],
    specs: [{ label: "Architecture", value: "Ada Lovelace" }, { label: "CUDA Cores", value: "18,176" }, { label: "Tensor Cores", value: "568" }, { label: "RT Cores", value: "142" }, { label: "Memory", value: "48 GB GDDR6" }, { label: "Form Factor", value: "Dual Slot" }] },
  { id: "rtx-a6000", name: "NVIDIA RTX A6000", family: "a-series", arch: "Ampere",
    badges: [{ label: "Ampere", tone: "info" }], image: imgRtxA6000, memoryGb: 48, formFactor: "dual", workloads: ["ai-dl", "3d-vfx", "vr", "cad"],
    specs: [{ label: "Architecture", value: "Ampere" }, { label: "CUDA Cores", value: "10,752" }, { label: "Tensor Cores", value: "336" }, { label: "RT Cores", value: "84" }, { label: "Memory", value: "48 GB GDDR6" }, { label: "Form Factor", value: "Dual Slot" }] },
  { id: "rtx-a5000", name: "NVIDIA RTX A5000", family: "a-series", arch: "Ampere",
    badges: [{ label: "Ampere", tone: "info" }], image: imgRtxA, memoryGb: 24, formFactor: "dual", workloads: ["ai-dl", "3d-vfx", "cad"],
    specs: [{ label: "Architecture", value: "Ampere" }, { label: "CUDA Cores", value: "8,192" }, { label: "Tensor Cores", value: "256" }, { label: "RT Cores", value: "64" }, { label: "Memory", value: "24 GB GDDR6" }, { label: "Form Factor", value: "Dual Slot" }] },
  { id: "rtx-a4000", name: "NVIDIA RTX A4000", family: "a-series", arch: "Ampere",
    badges: [{ label: "Ampere", tone: "info" }], image: imgRtxA, memoryGb: 16, formFactor: "single", workloads: ["cad", "video", "3d-vfx"],
    specs: [{ label: "Architecture", value: "Ampere" }, { label: "CUDA Cores", value: "6,144" }, { label: "Tensor Cores", value: "192" }, { label: "RT Cores", value: "48" }, { label: "Memory", value: "16 GB GDDR6" }, { label: "Form Factor", value: "Single Slot" }] },
  { id: "quadro-rtx8000", name: "QUADRO RTX 8000", family: "quadro-rtx", arch: "Turing",
    badges: [{ label: "Turing", tone: "info" }], image: imgQuadroRtx, memoryGb: 48, formFactor: "dual", workloads: ["3d-vfx", "ai-dl"],
    specs: [{ label: "Architecture", value: "Turing" }, { label: "CUDA Cores", value: "4,608" }, { label: "Tensor Cores", value: "576" }, { label: "RT Cores", value: "72" }, { label: "Memory", value: "48 GB GDDR6" }, { label: "Form Factor", value: "Dual Slot" }] },
  { id: "quadro-rtx6000", name: "QUADRO RTX 6000", family: "quadro-rtx", arch: "Turing",
    badges: [{ label: "Turing", tone: "info" }], image: imgQuadroRtx, memoryGb: 24, formFactor: "dual", workloads: ["3d-vfx", "cad"],
    specs: [{ label: "Architecture", value: "Turing" }, { label: "CUDA Cores", value: "4,608" }, { label: "Tensor Cores", value: "576" }, { label: "RT Cores", value: "72" }, { label: "Memory", value: "24 GB GDDR6" }, { label: "Form Factor", value: "Dual Slot" }] },
  { id: "quadro-rtx5000", name: "QUADRO RTX 5000", family: "quadro-rtx", arch: "Turing",
    badges: [{ label: "Turing", tone: "info" }], image: imgQuadroRtx, memoryGb: 16, formFactor: "dual", workloads: ["cad", "video"],
    specs: [{ label: "Architecture", value: "Turing" }, { label: "CUDA Cores", value: "3,072" }, { label: "Tensor Cores", value: "384" }, { label: "RT Cores", value: "48" }, { label: "Memory", value: "16 GB GDDR6" }, { label: "Form Factor", value: "Dual Slot" }] },
  { id: "quadro-rtx4000", name: "QUADRO RTX 4000", family: "quadro-rtx", arch: "Turing",
    badges: [{ label: "Turing", tone: "info" }], image: imgQuadroRtx, memoryGb: 8, formFactor: "single", workloads: ["cad", "video"],
    specs: [{ label: "Architecture", value: "Turing" }, { label: "CUDA Cores", value: "2,304" }, { label: "Tensor Cores", value: "288" }, { label: "RT Cores", value: "36" }, { label: "Memory", value: "8 GB GDDR6" }, { label: "Form Factor", value: "Single Slot" }] },
  { id: "quadro-gp100", name: "Quadro GP100", family: "legacy", arch: "Pascal",
    badges: [{ label: "Pascal", tone: "info" }, { label: "HBM2", tone: "info" }], image: imgQuadroPascal, memoryGb: 16, formFactor: "dual",
    specs: [{ label: "Architecture", value: "Pascal" }, { label: "CUDA Cores", value: "3,584" }, { label: "Memory", value: "16 GB HBM2 ECC" }, { label: "Interface", value: "4096-bit" }, { label: "Form Factor", value: "Dual Slot" }] },
  { id: "quadro-p6000", name: "Quadro P6000", family: "legacy", arch: "Pascal",
    badges: [{ label: "Pascal", tone: "info" }], image: imgQuadroPascal, memoryGb: 24, formFactor: "dual",
    specs: [{ label: "Architecture", value: "Pascal" }, { label: "CUDA Cores", value: "3,840" }, { label: "Memory", value: "24 GB GDDR5X" }, { label: "Interface", value: "384-bit" }, { label: "Form Factor", value: "Dual Slot" }] },
  { id: "quadro-p4000", name: "Quadro P4000", family: "legacy", arch: "Pascal",
    badges: [{ label: "Pascal", tone: "info" }], image: imgQuadroPascal, memoryGb: 8, formFactor: "single",
    specs: [{ label: "Architecture", value: "Pascal" }, { label: "CUDA Cores", value: "1,792" }, { label: "Memory", value: "8 GB GDDR5" }, { label: "Interface", value: "256-bit" }, { label: "Form Factor", value: "Single Slot" }] },
  { id: "quadro-p2200", name: "Quadro P2200", family: "legacy", arch: "Pascal",
    badges: [{ label: "Pascal", tone: "info" }], image: imgQuadroPascal, memoryGb: 5, formFactor: "single",
    specs: [{ label: "Architecture", value: "Pascal" }, { label: "CUDA Cores", value: "1,280" }, { label: "Memory", value: "5 GB GDDR5X" }, { label: "Interface", value: "160-bit" }, { label: "Form Factor", value: "Single Slot" }] },
  { id: "quadro-p2000", name: "Quadro P2000", family: "legacy", arch: "Pascal",
    badges: [{ label: "Pascal", tone: "info" }], image: imgQuadroPascal, memoryGb: 5, formFactor: "single",
    specs: [{ label: "Architecture", value: "Pascal" }, { label: "CUDA Cores", value: "1,024" }, { label: "Memory", value: "5 GB GDDR5" }, { label: "Interface", value: "160-bit" }, { label: "Form Factor", value: "Single Slot" }] },
  { id: "quadro-p1000", name: "Quadro P1000", family: "legacy", arch: "Pascal",
    badges: [{ label: "Pascal", tone: "info" }, { label: "Low Profile", tone: "info" }], image: imgTSeries, memoryGb: 4, formFactor: "single",
    specs: [{ label: "Architecture", value: "Pascal" }, { label: "CUDA Cores", value: "640" }, { label: "Memory", value: "4 GB GDDR5" }, { label: "Interface", value: "128-bit" }, { label: "Form Factor", value: "Single Slot Low Profile" }] },
  { id: "quadro-p400", name: "Quadro P400", family: "legacy", arch: "Pascal",
    badges: [{ label: "Pascal", tone: "info" }, { label: "Low Profile", tone: "info" }], image: imgTSeries, memoryGb: 2, formFactor: "single",
    specs: [{ label: "Architecture", value: "Pascal" }, { label: "CUDA Cores", value: "256" }, { label: "Memory", value: "2 GB GDDR5" }, { label: "Interface", value: "64-bit" }, { label: "Form Factor", value: "Single Slot Low Profile" }] },
  { id: "t1000", name: "NVIDIA T1000", family: "legacy", arch: "Turing",
    badges: [{ label: "Turing", tone: "info" }, { label: "Low Profile", tone: "info" }], image: imgTSeries, memoryGb: 8, formFactor: "single", workloads: ["cad", "video"],
    specs: [{ label: "Architecture", value: "Turing" }, { label: "CUDA Cores", value: "896" }, { label: "FP32", value: "2.5 TFLOPS" }, { label: "Memory", value: "4 / 8 GB GDDR6" }, { label: "Form Factor", value: "Single Slot Low Profile" }] },
  { id: "t600", name: "NVIDIA T600", family: "legacy", arch: "Turing",
    badges: [{ label: "Turing", tone: "info" }, { label: "Low Profile", tone: "info" }], image: imgTSeries, memoryGb: 4, formFactor: "single",
    specs: [{ label: "Architecture", value: "Turing" }, { label: "CUDA Cores", value: "640" }, { label: "FP32", value: "1.709 TFLOPS" }, { label: "Memory", value: "4 GB GDDR6" }, { label: "Form Factor", value: "Single Slot Low Profile" }] },
  { id: "t400", name: "NVIDIA T400", family: "legacy", arch: "Turing",
    badges: [{ label: "Turing", tone: "info" }, { label: "Low Profile", tone: "info" }], image: imgTSeries, memoryGb: 4, formFactor: "single",
    specs: [{ label: "Architecture", value: "Turing" }, { label: "CUDA Cores", value: "384" }, { label: "FP32", value: "1.094 TFLOPS" }, { label: "Memory", value: "2 / 4 GB GDDR6" }, { label: "Form Factor", value: "Single Slot Low Profile" }] },
  { id: "titan-rtx", name: "TITAN RTX", family: "legacy", arch: "Turing",
    badges: [{ label: "Turing", tone: "info" }, { label: "Flagship Consumer", tone: "flagship" }], image: imgTitanRtx, memoryGb: 24, formFactor: "dual", workloads: ["ai-dl", "3d-vfx"],
    specs: [{ label: "Architecture", value: "Turing" }, { label: "CUDA Cores", value: "4,608" }, { label: "Tensor Cores", value: "576" }, { label: "RT Cores", value: "72" }, { label: "Memory", value: "24 GB GDDR6" }, { label: "Form Factor", value: "Dual Slot" }] },
  { id: "quadro-sync-ii", name: "NVIDIA Quadro SYNC II", family: "legacy", arch: "Accessory",
    badges: [{ label: "Accessory", tone: "info" }], image: imgQuadroSync, memoryGb: 0, formFactor: "single",
    specs: [{ label: "Type", value: "Sync Board" }, { label: "GPUs per Card", value: "4" }, { label: "Max Sync Cards/System", value: "3" }, { label: "Max GPUs/System", value: "8" }, { label: "Form Factor", value: "Single Slot" }] },
];
