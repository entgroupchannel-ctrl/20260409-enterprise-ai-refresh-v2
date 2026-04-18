import { useEffect, useMemo, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  Copy, Download, Link2, MessageCircle, Facebook, Mail, QrCode, History, Trash2,
} from "lucide-react";

interface SavedLink {
  id: string;
  label: string;
  path: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  url: string;
  createdAt: number;
}

const PRESET_PATHS = [
  { value: "/", label: "หน้าแรก" },
  { value: "/shop", label: "ร้านค้า" },
  { value: "/mini-pc", label: "Mini PC" },
  { value: "/rugged-notebook", label: "Rugged Notebook" },
  { value: "/rugged-tablet", label: "Rugged Tablet" },
  { value: "/handheld", label: "Handheld" },
  { value: "/all-in-one-pc", label: "All-in-One PC" },
  { value: "/jetson-products", label: "Jetson AI" },
  { value: "/contact-us", label: "ติดต่อเรา" },
];

const PRESET_SOURCES = ["facebook", "line", "instagram", "tiktok", "youtube", "email", "blog", "linkedin"];
const PRESET_MEDIUMS = ["social", "messenger", "email", "ads", "post", "story", "video", "referral"];

export default function LinkBuilderTab({ affiliateCode }: { affiliateCode: string }) {
  const { toast } = useToast();
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

  const [path, setPath] = useState("/");
  const [customPath, setCustomPath] = useState("");
  const [utmSource, setUtmSource] = useState("");
  const [utmMedium, setUtmMedium] = useState("");
  const [utmCampaign, setUtmCampaign] = useState("");
  const [label, setLabel] = useState("");
  const [saved, setSaved] = useState<SavedLink[]>([]);
  const qrRef = useRef<HTMLDivElement>(null);

  const storageKey = `affiliate_links_${affiliateCode}`;

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setSaved(JSON.parse(raw));
    } catch { /* ignore */ }
  }, [storageKey]);

  const persist = (next: SavedLink[]) => {
    setSaved(next);
    localStorage.setItem(storageKey, JSON.stringify(next));
  };

  const finalPath = customPath.trim() || path;
  const url = useMemo(() => {
    const params = new URLSearchParams();
    if (finalPath !== "/") params.set("to", finalPath);
    if (utmSource.trim()) params.set("utm_source", utmSource.trim());
    if (utmMedium.trim()) params.set("utm_medium", utmMedium.trim());
    if (utmCampaign.trim()) params.set("utm_campaign", utmCampaign.trim());
    const qs = params.toString();
    return `${baseUrl}/r/${affiliateCode}${qs ? `?${qs}` : ""}`;
  }, [baseUrl, affiliateCode, finalPath, utmSource, utmMedium, utmCampaign]);

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "คัดลอกแล้ว", description: text.slice(0, 60) + (text.length > 60 ? "…" : "") });
  };

  const saveLink = () => {
    const item: SavedLink = {
      id: crypto.randomUUID(),
      label: label.trim() || `${utmSource || "link"} • ${new Date().toLocaleDateString("th-TH")}`,
      path: finalPath,
      utm_source: utmSource,
      utm_medium: utmMedium,
      utm_campaign: utmCampaign,
      url,
      createdAt: Date.now(),
    };
    const next = [item, ...saved].slice(0, 30);
    persist(next);
    setLabel("");
    toast({ title: "บันทึกลิงก์แล้ว", description: item.label });
  };

  const removeLink = (id: string) => persist(saved.filter(s => s.id !== id));

  const downloadQR = () => {
    const svg = qrRef.current?.querySelector("svg");
    if (!svg) return;
    const xml = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([xml], { type: "image/svg+xml" });
    const u = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = u;
    a.download = `affiliate-${affiliateCode}-qr.svg`;
    a.click();
    URL.revokeObjectURL(u);
  };

  const shareLine = () => window.open(`https://line.me/R/msg/text/?${encodeURIComponent(`มาดูสินค้าจาก ENT Group กันครับ ${url}`)}`, "_blank");
  const shareFB = () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank");
  const shareMail = () => window.open(`mailto:?subject=${encodeURIComponent("ENT Group — Industrial B2B Platform")}&body=${encodeURIComponent(`สวัสดีครับ ลองดูสินค้าจาก ENT Group ได้ที่ลิงก์นี้: ${url}`)}`);

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Builder */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Link2 className="w-5 h-5 text-primary" /> สร้างลิงก์อ้างอิง
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">หน้าปลายทาง</Label>
              <Select value={path} onValueChange={(v) => { setPath(v); setCustomPath(""); }}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PRESET_PATHS.map(p => (
                    <SelectItem key={p.value} value={p.value}>{p.label} <span className="text-muted-foreground text-xs ml-1">{p.value}</span></SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">หรือ path กำหนดเอง</Label>
              <Input
                value={customPath}
                onChange={(e) => setCustomPath(e.target.value)}
                placeholder="/path/ที่ต้องการ"
                className="mt-1"
              />
            </div>
          </div>

          <Separator />

          <div>
            <Label className="text-xs font-medium">UTM Parameters (เพื่อแยกแหล่งที่มา)</Label>
            <div className="grid sm:grid-cols-3 gap-3 mt-2">
              <div>
                <Label className="text-xs text-muted-foreground">Source</Label>
                <Input
                  list="utm-source-list"
                  value={utmSource}
                  onChange={(e) => setUtmSource(e.target.value)}
                  placeholder="facebook"
                />
                <datalist id="utm-source-list">
                  {PRESET_SOURCES.map(s => <option key={s} value={s} />)}
                </datalist>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Medium</Label>
                <Input
                  list="utm-medium-list"
                  value={utmMedium}
                  onChange={(e) => setUtmMedium(e.target.value)}
                  placeholder="social"
                />
                <datalist id="utm-medium-list">
                  {PRESET_MEDIUMS.map(s => <option key={s} value={s} />)}
                </datalist>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Campaign</Label>
                <Input
                  value={utmCampaign}
                  onChange={(e) => setUtmCampaign(e.target.value)}
                  placeholder="summer-promo"
                />
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <Label className="text-xs">ลิงก์ที่สร้างได้</Label>
            <div className="flex gap-2 mt-1">
              <Input value={url} readOnly className="font-mono text-xs" />
              <Button variant="outline" size="icon" onClick={() => copy(url)}>
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button onClick={shareLine} variant="outline" size="sm" className="gap-2">
              <MessageCircle className="w-4 h-4 text-green-600" /> LINE
            </Button>
            <Button onClick={shareFB} variant="outline" size="sm" className="gap-2">
              <Facebook className="w-4 h-4 text-blue-600" /> Facebook
            </Button>
            <Button onClick={shareMail} variant="outline" size="sm" className="gap-2">
              <Mail className="w-4 h-4" /> Email
            </Button>
            <div className="ml-auto flex gap-2">
              <Input
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="ตั้งชื่อแคมเปญ (ไม่บังคับ)"
                className="w-48"
              />
              <Button onClick={saveLink} size="sm">บันทึก</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* QR */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <QrCode className="w-5 h-5 text-primary" /> QR Code
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div ref={qrRef} className="bg-white p-4 rounded-lg flex items-center justify-center border">
            <QRCodeSVG value={url} size={200} level="M" includeMargin />
          </div>
          <Button onClick={downloadQR} variant="outline" size="sm" className="w-full gap-2">
            <Download className="w-4 h-4" /> ดาวน์โหลด SVG
          </Button>
          <p className="text-xs text-muted-foreground">
            เหมาะสำหรับใส่บนนามบัตร, โบรชัวร์ หรือป้ายในงานอีเวนต์
          </p>
        </CardContent>
      </Card>

      {/* Saved links */}
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <History className="w-5 h-5 text-primary" /> ลิงก์ที่บันทึกไว้ ({saved.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {saved.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              ยังไม่มีลิงก์ที่บันทึก — สร้างและกด "บันทึก" เพื่อเก็บไว้ใช้ภายหลัง
            </p>
          ) : (
            <div className="space-y-2">
              {saved.map(s => (
                <div key={s.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/40">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-sm">{s.label}</span>
                      {s.utm_source && <Badge variant="outline" className="text-xs">{s.utm_source}</Badge>}
                      {s.utm_campaign && <Badge variant="secondary" className="text-xs">{s.utm_campaign}</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground font-mono truncate mt-0.5">{s.url}</p>
                  </div>
                  <Button size="icon" variant="ghost" onClick={() => copy(s.url)}>
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => removeLink(s.id)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
