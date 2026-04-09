import { Link } from "react-router-dom";
import { CheckCircle, Phone, Mail, FileText, Store, Users, Star, ArrowRight, Shield, Trophy, Award } from "lucide-react";
import PageBanner from "@/components/PageBanner";
import Footer from "@/components/Footer";
import bannerImg from "@/assets/banner-welcome-member.jpg";

const benefits = [
  "เงื่อนไขการเป็นตัวแทนไม่ยุ่งยาก ไม่บังคับให้ตัวแทนรักษายอด",
  "สินค้าหลากหลาย เน้นกลุ่ม Mini PC มีหลายรุ่นให้เลือกสรร นำไปจำหน่าย",
  "มีสินค้าที่เหมาะกับหลายๆ อุตสาหกรรม",
  "ลูกค้าสามารถสต๊อกได้ ราคาไม่สูงมาก สินค้าไม่บูดไม่เน่า ขายได้ มีกำไร",
  "มีรับประกัน บริการหลังการขาย",
];

const steps = [
  {
    step: 1,
    title: "ติดต่อเรา",
    desc: "สแกน QR Code หรือเพิ่มเพื่อนในไลน์แอด @entgroup หรือ โทร 02-045-6104",
    icon: Phone,
  },
  {
    step: 2,
    title: "ส่งเอกสาร",
    desc: "ส่งเอกสารเพื่อพิสูจน์ว่าคุณเป็นองค์กรที่ทำธุรกิจและจำหน่ายสินค้าที่เกี่ยวข้องกับระบบไอที",
    icon: FileText,
  },
  {
    step: 3,
    title: "รอการพิจารณา",
    desc: "รอการพิจารณาผล 1–2 วัน เพื่อรับ Login เข้าระบบตัวแทนจำหน่าย",
    icon: CheckCircle,
  },
];

const qualifications = [
  "ดำเนินธุรกิจจัดจำหน่ายสินค้าไอที อุปกรณ์ชิ้นส่วนคอมพิวเตอร์เป็นหลัก",
  "จดทะเบียนการค้ากับกรมทะเบียนการค้า (ลูกค้าที่ไม่ได้จดทะเบียนจะพิจารณาเป็นรายๆ ไป)",
  "มีความสามารถบริหารงานและพัฒนาการจัดจำหน่ายสินค้าได้อย่างต่อเนื่อง",
  "สามารถปฏิบัติตามข้อตกลงในการซื้อสินค้าและข้อกำหนดการชำระเงินได้อย่างเคร่งครัด",
];

const conditions = [
  "เปิดบิลการซื้อสินค้าครั้งแรก วงเงินไม่ต่ำกว่า 5,000 บาท",
  "การสมัครสมาชิกจะต้องแนบเอกสารประกอบการสมัครให้ครบถ้วน",
  "สมาชิกจะต้องได้รับการอนุมัติก่อน จึงจะสามารถสั่งซื้อสินค้าได้",
  "สั่งซื้อสินค้าต่อเนื่องทุกเดือน หากไม่มียอดสั่ง จะจัดระดับตัวแทนซึ่งมีผลกับราคาส่งสินค้า",
  "อายุการเป็นสมาชิก ใช้ได้จนกว่าจะบอกยกเลิก",
];

const documents = [
  "หนังสือรับรองบริษัท หจก. ทะเบียนพาณิชย์ อย่างใดอย่างหนึ่ง (อายุไม่เกิน 3 เดือน)",
  "สำเนาเอกสาร ภพ.20 (ถ้ามี)",
  "สำเนาบัตรประจำตัวประชาชนของกรรมการผู้มีอำนาจ หรือเจ้าของกิจการ",
  "สำเนาทะเบียนบ้านของกรรมการผู้มีอำนาจ หรือเจ้าของกิจการ",
  "รูปถ่ายหน้าร้าน รูปถ่ายภายในร้าน",
  "แผนที่ตั้งของที่ทำการบริษัท/ร้านค้า และสถานที่ส่งสินค้า",
];

const WelcomeMember = () => {
  return (
    <div className="min-h-screen bg-background">
      <PageBanner image={bannerImg} title="สมัครตัวแทนจำหน่าย" subtitle="ร่วมเป็นพาร์ทเนอร์กับ ENT Group" />

      {/* Hero Banner */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-primary/5 py-16 md:py-24">
        <div className="container max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
            <Users size={16} /> รับสมัครตัวแทนจำหน่าย
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            มาเป็น<span className="text-primary">ตัวแทนจำหน่าย</span>กับเรา
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            สมัครฟรี! สินค้าขายง่าย ราคาไม่สูง — Mini PC เกรดอุตสาหกรรมจากโรงงานโดยตรง
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://page.line.me/njm2688e?openQrModal=true"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[hsl(145,60%,45%)] text-white font-semibold hover:opacity-90 transition-opacity"
            >
              สมัครผ่าน LINE
            </a>
            <a
              href="tel:020456104"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-secondary text-secondary-foreground font-semibold hover:bg-secondary/80 transition-colors"
            >
              <Phone size={16} /> โทร 02-045-6104
            </a>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-background">
        <div className="container max-w-5xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-10">
            เหตุผลดีๆ ที่อยากให้คุณมาเป็นตัวแทน
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {benefits.map((b, i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border">
                <Star size={18} className="text-primary flex-shrink-0 mt-0.5" />
                <p className="text-sm text-foreground">{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16 bg-muted/30">
        <div className="container max-w-5xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-10">
            ขั้นตอนง่ายๆ สำหรับการสมัคร
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((s) => (
              <div key={s.step} className="relative p-6 rounded-xl bg-card border border-border text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <s.icon size={22} className="text-primary" />
                </div>
                <div className="absolute top-4 left-4 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                  {s.step}
                </div>
                <h3 className="text-base font-bold text-foreground mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Qualifications & Conditions */}
      <section className="py-16 bg-background">
        <div className="container max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Qualifications */}
            <div>
              <div className="flex items-center gap-2 mb-5">
                <Trophy size={20} className="text-primary" />
                <h2 className="text-xl font-bold text-foreground">คุณสมบัติผู้สมัคร</h2>
              </div>
              <ul className="space-y-3">
                {qualifications.map((q, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                    <CheckCircle size={14} className="text-primary flex-shrink-0 mt-0.5" />
                    {q}
                  </li>
                ))}
              </ul>
            </div>

            {/* Conditions */}
            <div>
              <div className="flex items-center gap-2 mb-5">
                <Shield size={20} className="text-primary" />
                <h2 className="text-xl font-bold text-foreground">เงื่อนไขการสมัคร</h2>
              </div>
              <ul className="space-y-3">
                {conditions.map((c, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                    <CheckCircle size={14} className="text-primary flex-shrink-0 mt-0.5" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Documents */}
      <section className="py-16 bg-muted/30">
        <div className="container max-w-5xl mx-auto px-6">
          <div className="flex items-center gap-2 mb-6">
            <FileText size={20} className="text-primary" />
            <h2 className="text-xl font-bold text-foreground">เอกสารที่ใช้ประกอบการสมัคร</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {documents.map((d, i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border">
                <span className="text-xs font-bold text-primary bg-primary/10 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">
                  {i + 1}
                </span>
                <p className="text-sm text-foreground">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 bg-background">
        <div className="container max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">สอบถามข้อมูลเพิ่มเติม</h2>
          <p className="text-sm text-muted-foreground mb-6">
            เช็คสถานะการเป็นสมาชิก หรือสอบถามรายละเอียดได้ที่
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:accountant@entgroup.co.th" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-card border border-border text-sm text-foreground hover:border-primary transition-colors">
              <Mail size={16} className="text-primary" /> accountant@entgroup.co.th
            </a>
            <a href="tel:0864259269" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-card border border-border text-sm text-foreground hover:border-primary transition-colors">
              <Phone size={16} className="text-primary" /> 086-425-9269
            </a>
            <a href="tel:0822497922" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-card border border-border text-sm text-foreground hover:border-primary transition-colors">
              <Phone size={16} className="text-primary" /> 082-249-7922
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default WelcomeMember;
