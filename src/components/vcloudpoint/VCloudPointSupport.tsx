import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  LifeBuoy, Wrench, Download, FileText, ExternalLink, AlertTriangle,
  CheckCircle2, Server, Cpu, Package, ShieldAlert, ArrowRight,
} from "lucide-react";

/**
 * VCloudPointSupport — Section ฝ่าย Support
 * ประกอบด้วย Tabs: Installation Guide / Software Downloads / Documentations
 * เนื้อหาแปลจาก vcloudpoint.com/support/installation-guide-and-downloads/
 * ลิงก์ดาวน์โหลด/อ้างอิงทั้งหมดชี้ไปที่เว็บโรงงาน vcloudpoint.com
 */
const SOURCE_URL = "https://www.vcloudpoint.com/support/installation-guide-and-downloads/";

const downloads = [
  {
    name: "vMatrix Server Manager",
    desc: "RDS Connection Broker — ตัวจัดการการเชื่อมต่อบน Host PC สำหรับโซลูชัน Shared Computing (RDS)",
    href: "https://www.vcloudpoint.com/support/vcloudpoint-installation/vmatrix-download/",
    by: "vCloudPoint",
    badge: "RDS",
  },
  {
    name: "Virspire Desktop Agent",
    desc: "VDI Connection Broker — ติดตั้งบน Virtual Machine สำหรับโซลูชัน VDI",
    href: "https://www.vcloudpoint.com/support/vcloudpoint-installation/virspire-download/",
    by: "vCloudPoint",
    badge: "VDI",
  },
  {
    name: "JoinVDI Virtualization Manager (JVVM)",
    desc: "ตัวจัดการ Virtualization (KVM hypervisor) สำหรับสร้าง/บริหาร VM ผ่านเว็บคอนโซล",
    href: "https://www.vcloudpoint.com/support/vcloudpoint-installation/joinvdi-virtualization-manager-download/",
    by: "vCloudPoint",
    badge: "VDI",
  },
  {
    name: "Quick Installation Tool (QITS)",
    desc: "เครื่องมือ UI ช่วยให้ติดตั้ง JVVM ง่ายขึ้น — รันบนเครื่อง Windows",
    href: "https://www.vcloudpoint.com/wp-content/uploads/software/Quick_Installation_Tool_Setup.exe",
    by: "vCloudPoint",
    badge: "Tool",
  },
  {
    name: "JoinVDI Guest Tool (JVGT)",
    desc: "Guest Tool ติดตั้งบน VM (Windows 7+/Server 2019) เพื่อให้ JoinVDI ควบคุม VM ได้สมบูรณ์",
    href: "https://www.vcloudpoint.com/wp-content/uploads/software/joinvdi_guest_tools_setup.exe",
    by: "vCloudPoint",
    badge: "VDI",
  },
  {
    name: "virt-viewer",
    desc: "เครื่องมือเปิดหน้าจอกราฟิกของ VM ผ่าน VNC/SPICE — รันบน Windows",
    href: "https://www.vcloudpoint.com/wp-content/uploads/software/virt-viewer.zip",
    by: "Virt Manager Project",
    badge: "Tool",
  },
  {
    name: "Rufus",
    desc: "สร้าง USB Boot สำหรับติดตั้ง JVVM (Bootable USB Flash Drive)",
    href: "https://www.vcloudpoint.com/wp-content/uploads/software/rufus-3.8.exe",
    by: "Pete Batard",
    badge: "Tool",
  },
  {
    name: "Hash (MD5 Verification)",
    desc: "ตรวจสอบความสมบูรณ์ของไฟล์ติดตั้ง JVVM ด้วยค่า MD5/SHA1/CRC32",
    href: "https://www.vcloudpoint.com/wp-content/uploads/software/Hash_1.0.4.exe",
    by: "Robin Keir",
    badge: "Tool",
  },
  {
    name: "RDP Wrapper Library",
    desc: "Patch ให้ Windows Client (เช่น Win10) รองรับ Multi-user RDP ได้ — ใช้คู่กับ vMatrix สำหรับงานบ้าน/ทดลอง (production แนะนำใช้ RDS CALs)",
    href: "https://github.com/DrDrrae/rdpwrap/releases/tag/v1.6.2.1",
    by: "Stas'M",
    badge: "RDS",
  },
  {
    name: "VLC Media Player",
    desc: "Media Player ที่รองรับ vDirect Client Rendering — ลดภาระ CPU ของ Host เวลาเปิดวิดีโอบน Zero Client (ตั้งเป็น Default Player)",
    href: "http://get.videolan.org/vlc/2.2.1/win32/vlc-2.2.1-win32.exe",
    by: "VideoLAN",
    badge: "Optional",
  },
];

const documentations = [
  {
    name: "Zero Client Device Datasheet",
    desc: "สเปคเครื่อง Zero Client (รุ่น A1-S100 ฯลฯ) — ใช้อ้างอิงตอนเสนอราคา/ออกแบบระบบ",
    updated: "May 15, 2023",
    href: "https://www.vcloudpoint.com/wp-content/uploads/documentations/A1-S100-V1-Datasheet-EN.pdf",
    icon: Cpu,
  },
  {
    name: "RDS Host Configuration Guide",
    desc: "ตารางสเปค Host PC ที่แนะนำตามจำนวนผู้ใช้ — สำหรับโซลูชัน Shared Computing (RDS)",
    updated: "Mar 15, 2021",
    href: "https://www.vcloudpoint.com/wp-content/uploads/documentations/vCloudPoint-RDS-Solution-Host-Configuration-EN.xlsx",
    icon: Server,
  },
  {
    name: "VDI Host Configuration Guide",
    desc: "ตารางสเปค Server ที่แนะนำตามจำนวน VM — สำหรับโซลูชัน VDI",
    updated: "Nov 22, 2022",
    href: "https://www.vcloudpoint.com/wp-content/uploads/documentations/vCloudPoint-VDI-Solution-Host-Configuration-EN.xls",
    icon: Server,
  },
  {
    name: "RDS Solution + vMatrix User Manual",
    desc: "คู่มือใช้งาน vMatrix Server Manager แบบละเอียด (สร้าง User, จัดการ Client, Monitor)",
    updated: "Dec 29, 2021",
    href: "https://www.vcloudpoint.com/wp-content/uploads/documentations/vCloudPoint-RDS-Solution-User-Manul-EN.pdf",
    icon: FileText,
  },
  {
    name: "VDI Solution + JoinVDI Installation Guide",
    desc: "ขั้นตอนติดตั้งระบบ VDI ตั้งแต่ JVVM ถึงการต่อ Zero Client",
    updated: "Aug 30, 2021",
    href: "https://www.vcloudpoint.com/wp-content/uploads/documentations/vCloudPoint-VDI-Solution-JoinVDI-Installation-Guide-EN.pdf",
    icon: FileText,
  },
  {
    name: "vCloudPoint Solutions Brochure",
    desc: "ภาพรวมโซลูชัน Zero Client Computing ของ vCloudPoint — เหมาะสำหรับนำเสนอลูกค้า",
    updated: "Mar 15, 2022",
    href: "https://www.vcloudpoint.com/wp-content/uploads/documentations/vCloudPoint-Zero-Client-Computing-Brochure-EN.pdf",
    icon: Package,
  },
];

const VCloudPointSupport = () => {
  return (
    <section id="support" className="relative py-16 md:py-20 bg-secondary/30 border-y-2 border-primary/20 overflow-hidden">
      <div className="absolute -top-20 -right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container max-w-6xl mx-auto px-6 relative">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-bold tracking-widest uppercase shadow-lg shadow-primary/30">
            <LifeBuoy className="w-3.5 h-3.5" />
            Support · ศูนย์ช่วยเหลือช่างติดตั้ง
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-black text-foreground mt-4">
            <span className="text-primary">คู่มือ · ดาวน์โหลด · เอกสาร</span> สำหรับช่างไทย
          </h2>
          <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
            แปลและเรียบเรียงจากเว็บโรงงาน vcloudpoint.com — ลิงก์ดาวน์โหลดและเอกสารชี้ไปที่ต้นทางของผู้ผลิตโดยตรง
            เพื่อให้ได้ไฟล์เวอร์ชันล่าสุดเสมอ
          </p>
        </div>

        <Tabs defaultValue="install" className="w-full">
          <TabsList className="h-auto flex-wrap gap-2 bg-card/80 backdrop-blur p-2 mb-8 justify-center w-full border-2 border-primary/30 shadow-xl shadow-primary/10 rounded-2xl">
            <TabsTrigger
              value="install"
              className="text-xs md:text-sm gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg rounded-xl px-4 py-2.5 font-semibold"
            >
              <Wrench className="w-4 h-4" /> Installation Guide
            </TabsTrigger>
            <TabsTrigger
              value="downloads"
              className="text-xs md:text-sm gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg rounded-xl px-4 py-2.5 font-semibold"
            >
              <Download className="w-4 h-4" /> Software Downloads
            </TabsTrigger>
            <TabsTrigger
              value="docs"
              className="text-xs md:text-sm gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg rounded-xl px-4 py-2.5 font-semibold"
            >
              <FileText className="w-4 h-4" /> Documentations
            </TabsTrigger>
          </TabsList>

          {/* ── Installation Guide ── */}
          <TabsContent value="install" className="mt-0 space-y-6">
            {/* Pre-requisites */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="card-surface p-6 rounded-2xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
                    <Server className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-display font-bold text-foreground text-lg">โซลูชัน RDS (Shared Computing)</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  หลายผู้ใช้แชร์ Host PC เครื่องเดียว — ต้นทุนต่ำที่สุด เหมาะกับห้องคอม/ออฟฟิศ
                </p>
                <div className="text-xs text-foreground space-y-1.5">
                  <div className="font-bold text-primary mb-1">สิ่งที่ต้องเตรียมก่อนติดตั้ง</div>
                  <div>• Host PC ตามสเปคใน <em>RDS Host Configuration Guide</em></div>
                  <div>• เครือข่าย <strong>Gigabit LAN</strong> ระหว่าง Zero Client กับ Host</div>
                  <div>• Windows ที่รองรับ: Win 7/8/8.1/10/11 (ไม่รวม Home Basic/Starter), Server 2008R2–2022, Multipoint Server 2011/2012</div>
                  <div>• Multi-user: ติดตั้ง <strong>RDP Wrapper</strong> หรือซื้อ <strong>Microsoft RDS CALs</strong> (แนะนำ CALs สำหรับ Production)</div>
                </div>
              </div>

              <div className="card-surface p-6 rounded-2xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
                    <Cpu className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-display font-bold text-foreground text-lg">โซลูชัน VDI (Virtual Desktop)</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  แต่ละผู้ใช้มี VM ของตัวเอง — แยก OS/แอป ปลอดภัยสูง เหมาะกับองค์กร
                </p>
                <div className="text-xs text-foreground space-y-1.5">
                  <div className="font-bold text-primary mb-1">สิ่งที่ต้องเตรียมก่อนติดตั้ง</div>
                  <div>• Server ตามสเปคใน <em>VDI Host Configuration Guide</em></div>
                  <div>• เครือข่าย Gigabit LAN และ <strong>Internet</strong> (Virspire ต้องออนไลน์)</div>
                  <div>• Windows VM: Win 8/10/11, Server 2012/2016/2019/2022 (ทุก Edition)</div>
                  <div>• License: ซื้อ <strong>Windows VDA</strong> จาก Microsoft Partner</div>
                </div>
              </div>
            </div>

            {/* Steps RDS */}
            <div className="card-surface p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent">
              <h3 className="font-display font-bold text-foreground text-lg mb-4 flex items-center gap-2">
                <Wrench className="w-5 h-5 text-primary" /> ขั้นตอนติดตั้ง — RDS (4 ขั้น)
              </h3>
              <ol className="space-y-3">
                {[
                  "ปิด Antivirus / Security Software ก่อนเริ่ม (เพื่อไม่ให้บล็อก Driver ของ vMatrix)",
                  "รัน Installer ของ vMatrix Server Manager บน Host PC",
                  "แตกไฟล์ RDP Wrapper ลง Local Disk แล้วรัน install.bat (ห้ามรันจากใน ZIP) — หรือเปิดใช้งาน Microsoft RDS CALs ถ้าซื้อแล้ว",
                  "Reboot → สร้าง User Accounts ใน vMatrix Server Manager → ต่อ Zero Client เข้าระบบ พร้อมใช้งาน",
                ].map((s, i) => (
                  <li key={i} className="flex gap-3 text-sm text-foreground">
                    <span className="shrink-0 w-7 h-7 rounded-lg bg-primary text-primary-foreground font-bold text-xs flex items-center justify-center">{i + 1}</span>
                    <span className="leading-relaxed">{s}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Steps VDI */}
            <div className="card-surface p-6 md:p-8 rounded-2xl bg-gradient-to-br from-accent/10 to-transparent">
              <h3 className="font-display font-bold text-foreground text-lg mb-4 flex items-center gap-2">
                <Wrench className="w-5 h-5 text-primary" /> ขั้นตอนติดตั้ง — VDI (4 ขั้น)
              </h3>
              <ol className="space-y-3">
                {[
                  "Virtualize Server และสร้าง Virtual Machine ก่อน (ใช้ JoinVDI VM Manager หรือ Platform 3rd-party เช่น VMware/Hyper-V)",
                  "ปิด Antivirus / Security Software ก่อนติดตั้ง Virspire Desktop Agent",
                  "ติดตั้ง Virspire Desktop Agent บน VM ทุกตัว",
                  "ต่อ Zero Client เข้าระบบ → ผู้ใช้พร้อมล็อกอินใช้งาน",
                ].map((s, i) => (
                  <li key={i} className="flex gap-3 text-sm text-foreground">
                    <span className="shrink-0 w-7 h-7 rounded-lg bg-primary text-primary-foreground font-bold text-xs flex items-center justify-center">{i + 1}</span>
                    <span className="leading-relaxed">{s}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Tips */}
            <div className="card-surface p-6 md:p-8 rounded-2xl border-primary/30 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10">
              <h3 className="font-display font-bold text-foreground text-lg mb-4 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-primary" /> เคล็ดลับสำคัญที่ช่างไทยมักลืม
              </h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                {[
                  { icon: AlertTriangle, t: "ปิด Antivirus ก่อนติดตั้ง", d: "ไม่งั้น Driver ของ vMatrix/Virspire จะถูกบล็อก เกิดปัญหาตอนใช้งาน" },
                  { icon: AlertTriangle, t: "ปิด Windows Auto Update", d: "โดยเฉพาะ Win 10 — Update เถื่อนทำให้ Zero Client หลุดได้" },
                  { icon: CheckCircle2, t: "ใช้ VLC เป็น Default Player", d: "เพื่อใช้ vDirect Client Rendering — ลด CPU Host มาก เปิดวิดีโอพร้อมกันได้หลายคน" },
                ].map((tip) => (
                  <div key={tip.t} className="flex gap-3">
                    <tip.icon className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-foreground mb-1">{tip.t}</div>
                      <p className="text-muted-foreground leading-relaxed">{tip.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center">
              <a
                href={SOURCE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
              >
                อ่านคู่มือต้นฉบับฉบับเต็มที่ vcloudpoint.com <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </TabsContent>

          {/* ── Software Downloads ── */}
          <TabsContent value="downloads" className="mt-0">
            <div className="grid md:grid-cols-2 gap-4">
              {downloads.map((d) => (
                <a
                  key={d.name}
                  href={d.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group card-surface p-5 rounded-2xl hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all flex flex-col"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h4 className="font-display font-bold text-foreground group-hover:text-primary transition-colors">
                      {d.name}
                    </h4>
                    <span className="shrink-0 inline-flex items-center px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold border border-primary/20">
                      {d.badge}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1">{d.desc}</p>
                  <div className="mt-3 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">By {d.by}</span>
                    <span className="inline-flex items-center gap-1 font-bold text-primary group-hover:gap-2 transition-all">
                      <Download className="w-3.5 h-3.5" /> ดาวน์โหลด
                    </span>
                  </div>
                </a>
              ))}
            </div>
            <p className="text-center text-xs text-muted-foreground mt-6">
              ลิงก์ทั้งหมดชี้ไปยังเว็บผู้ผลิตโดยตรง — เพื่อให้ได้ไฟล์เวอร์ชันล่าสุดและปลอดภัย
            </p>
          </TabsContent>

          {/* ── Documentations ── */}
          <TabsContent value="docs" className="mt-0 space-y-4">
            <div className="card-surface p-5 rounded-xl bg-gradient-to-r from-primary/10 to-transparent border-primary/30">
              <p className="text-sm text-foreground leading-relaxed">
                <strong className="text-primary">คำแนะนำ:</strong> ก่อนติดตั้งระบบ vCloudPoint ครั้งแรก
                แนะนำให้อ่านเอกสารด้านล่างให้ครบ แม้ว่าจะมีประสบการณ์ติดตั้ง Thin Client/VDI มาก่อน
                เพราะ vCloudPoint มีรายละเอียดเฉพาะตัวที่ต่างจากผู้ผลิตอื่น
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {documentations.map((doc) => (
                <a
                  key={doc.name}
                  href={doc.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group card-surface p-5 rounded-2xl hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all flex gap-4"
                >
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center">
                    <doc.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-display font-bold text-foreground group-hover:text-primary transition-colors mb-1">
                      {doc.name}
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-2">{doc.desc}</p>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-muted-foreground">อัปเดตล่าสุด: {doc.updated}</span>
                      <span className="inline-flex items-center gap-1 font-bold text-primary group-hover:gap-2 transition-all">
                        <Download className="w-3 h-3" /> PDF/XLS
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>

            <div className="text-center pt-2">
              <a
                href={SOURCE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-colors"
              >
                ดูเอกสารทั้งหมดที่ vcloudpoint.com <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default VCloudPointSupport;
