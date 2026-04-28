import { ShoppingCart, FileText, MessageCircle, ShieldCheck, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";

/**
 * B2B Platform Banner - แสดงใต้หน้าสินค้า KIOSK
 * แจ้งลูกค้าว่าระบบรองรับการปรับแต่งใบเสนอราคา ไม่ต้องกลัวกดผิด
 */
export default function B2BPlatformBanner() {
  return (
    <section className="container mx-auto px-4 py-8">
      <Card className="relative overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-background to-accent/5 p-6 md:p-8">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl" aria-hidden />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-40 w-40 rounded-full bg-accent/10 blur-3xl" aria-hidden />

        <div className="relative grid gap-6 md:grid-cols-[auto,1fr,auto] md:items-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary shrink-0">
            <ShoppingCart className="h-7 w-7" />
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-semibold text-primary">
                <Sparkles className="h-3 w-3" />
                B2B Platform
              </span>
              <span className="text-xs text-muted-foreground">สั่งซื้อแบบมืออาชีพ</span>
            </div>

            <h3 className="text-lg md:text-xl font-bold text-foreground">
              หยิบใส่ตะกร้าได้เลย — แอดมินจะช่วยปรับสเปก & ใบเสนอราคาให้จนลงตัว
            </h3>

            <p className="text-sm text-muted-foreground leading-relaxed">
              ระบบของเรารองรับการ <span className="font-semibold text-foreground">ปรับแต่งใบเสนอราคาได้หลายรอบ</span> ก่อนยืนยันสั่งซื้อจริง
              ลูกค้าสามารถกดสั่งเข้ามาได้สบายใจ ทีมแอดมินจะเข้ามาเสริมรายละเอียด สเปก และเงื่อนไขเพิ่มเติมให้
              <span className="font-semibold text-foreground"> ไม่มีผลผูกพันจนกว่าจะตกลงร่วมกัน</span> — ไม่ต้องกังวลเรื่องระบบหรือรบกวนทีมงาน เราพร้อมบริการเต็มที่ 🙌
            </p>

            <div className="flex flex-wrap gap-x-4 gap-y-2 pt-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <FileText className="h-3.5 w-3.5 text-primary" />
                <span>ปรับใบเสนอราคาได้หลายรอบ</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <MessageCircle className="h-3.5 w-3.5 text-primary" />
                <span>แอดมินช่วยเสริมสเปกให้</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                <span>ไม่มีผลผูกพันจนกว่าจะยืนยัน</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
}
