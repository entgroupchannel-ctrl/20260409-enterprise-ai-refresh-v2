import SEOHead from "@/components/SEOHead";
import { useState, useEffect, useRef } from "react";
import bannerContact from "@/assets/banner-contact.jpg";
import teamSky from "@/assets/team-sky.png";
import teamSom from "@/assets/team-som.png";
import teamPreaw from "@/assets/team-preaw.png";
import { Link } from "react-router-dom";
import LineQRButton from "@/components/LineQRButton";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Phone, Mail, MapPin, ArrowLeft, Send, MessageCircle, Users, Camera, Upload, Loader2, CreditCard, Globe,
} from "lucide-react";
import FooterCompact from "@/components/FooterCompact";

/* ═══════════════════════════════════════════
   i18n — TH / EN
   ═══════════════════════════════════════════ */
type Lang = "th" | "en";

const t = {
  th: {
    seoTitle: "ติดต่อเรา — ENT Group",
    seoDesc: "ติดต่อ ENT Group สอบถามสินค้า Mini PC, Panel PC, Industrial Computer ขอใบเสนอราคา โทร สำนักงานปากเกร็ด นนทบุรี",
    bannerTitle: "ติดต่อเรา",
    bannerSub: "ติดต่อทีมงานของเรา — พร้อมให้คำปรึกษาและดูแลทุกโครงการ",
    backHome: "กลับหน้าหลัก",
    phone: "โทรศัพท์",
    fax: "Fax",
    emailSales: "อีเมลฝ่ายขาย",
    headOffice: "สำนักงานใหญ่ & สำนักงานขาย",
    companyName: "บริษัท อีเอ็นที กรุ๊ป จำกัด",
    address: "70/5 หมู่ 4 เมทโทร บิซทาวน์ แจ้งวัฒนะ 2\nตำบลคลองพระอุดม อำเภอปากเกร็ด\nนนทบุรี 11120",
    taxId: "เลขประจำตัวผู้เสียภาษี: 0135558013167",
    lineOfficial: "LINE Official",
    addLine: "แอดไลน์ @entgroup",
    openGoogleMaps: "เปิดใน Google Maps",
    formTitle: "ส่งข้อความถึงเรา",
    formSub: "กรอกข้อมูลด้านล่าง ทีมงานจะติดต่อกลับภายใน 24 ชั่วโมง",
    scanCard: "📇 สแกนนามบัตร — กรอกข้อมูลอัตโนมัติ",
    scanCardSub: "ถ่ายรูปหรืออัปโหลดนามบัตร ระบบ AI จะดึงข้อมูลให้อัตโนมัติ",
    uploadedCard: "นามบัตรที่อัปโหลด",
    scanning: "กำลังสแกนนามบัตร...",
    removeCard: "ลบภาพ & อัปโหลดใหม่",
    scanSuccess: "สแกนนามบัตรสำเร็จ!",
    scanSuccessDesc: "กรอกข้อมูลจากนามบัตรให้อัตโนมัติแล้ว",
    scanFail: "สแกนนามบัตรไม่สำเร็จ",
    scanFailDesc: "กรุณาลองอีกครั้ง หรือกรอกข้อมูลเอง",
    successTitle: "ส่งข้อความเรียบร้อย!",
    successDesc: "ขอบคุณที่ติดต่อเรา ทีมงานจะตอบกลับโดยเร็วที่สุด",
    sendAgain: "ส่งข้อความอีกครั้ง",
    lblName: "ชื่อ",
    lblEmail: "อีเมล",
    lblPhone: "โทรศัพท์",
    lblCompany: "บริษัท",
    lblLineId: "LINE ID",
    lblWhatsApp: "WhatsApp",
    lblCategory: "หมวดหมู่สินค้า",
    lblCallback: "เวลาที่สะดวกให้ติดต่อกลับ",
    lblMessage: "ข้อความ",
    phName: "ชื่อ-นามสกุล",
    phEmail: "email@company.com",
    phPhone: "08x-xxx-xxxx",
    phCompany: "ชื่อบริษัท / หน่วยงาน",
    phLineId: "@lineid",
    phWhatsApp: "+66...",
    phMessage: "รายละเอียดที่ต้องการสอบถาม เช่น จำนวน สเปกที่ต้องการ งบประมาณ...",
    subscribe: "สมัครรับข่าวสาร โปรโมชั่น และอัปเดตจาก ENT Group",
    submit: "ส่งข้อความ",
    submitSuccess: "ส่งข้อความเรียบร้อย!",
    submitSuccessDesc: "ทีมงานจะตอบกลับภายใน 24 ชม.",
    submitError: "เกิดข้อผิดพลาด",
    salesTeam: "ติดต่อทีมขายของเรา",
    salesTeamSub: "ติดต่อได้ที่",
    expertSales: "ผู้เชี่ยวชาญงานขาย",
    salesStaff: "เจ้าหน้าที่ฝ่ายขาย",
    needQuote: "ต้องการใบเสนอราคา?",
    needQuoteSub: "เลือกสินค้าและจำนวนที่ต้องการ — ฝ่ายขายจะจัดทำใบเสนอราคาให้ภายใน 24 ชม.",
    requestQuote: "ขอใบเสนอราคา →",
    categories: [
      "เลือกหมวดหมู่",
      "GT Series — Mini PC", "GB Series — Compact", "EPC Series", "EPC Box Series",
      "GK Series — Panel PC", "Panel PC GTG/GTY", "UTC Series",
      "Smart Display & KIOSK", "Rugged Tablet / Notebook", "Volktek Switch",
      "Mini PC Firewall", "vCloudPoint", "Waterproof PC IP69K", "อื่นๆ",
    ],
    callbackTimes: ["เลือก", "เช้า (9:00-12:00)", "บ่าย (13:00-16:00)", "เย็น (16:00-18:00)", "เวลาใดก็ได้"],
  },
  en: {
    seoTitle: "Contact Us — ENT Group",
    seoDesc: "Contact ENT Group for Mini PC, Panel PC, Industrial Computer inquiries. Request a quotation. Office in Pak Kret, Nonthaburi, Thailand.",
    bannerTitle: "Contact Us",
    bannerSub: "Reach our team — ready to consult and support your projects",
    backHome: "Back to Home",
    phone: "Phone",
    fax: "Fax",
    emailSales: "Sales Email",
    headOffice: "Head Office & Sales Office",
    companyName: "ENT GROUP Co., Ltd.",
    address: "70/5 Moo 4, Metro Biztown, Chaengwattana 2\nKhlong Phra Udom, Pak Kret\nNonthaburi 11120, Thailand",
    taxId: "Tax ID: 0135558013167",
    lineOfficial: "LINE Official",
    addLine: "Add LINE @entgroup",
    openGoogleMaps: "Open in Google Maps",
    formTitle: "Send us a message",
    formSub: "Fill in the form below. Our team will get back to you within 24 hours.",
    scanCard: "📇 Scan Business Card — Auto-fill form",
    scanCardSub: "Take a photo or upload your business card. AI will extract info automatically.",
    uploadedCard: "Uploaded business card",
    scanning: "Scanning business card...",
    removeCard: "Remove & re-upload",
    scanSuccess: "Card scanned successfully!",
    scanSuccessDesc: "Form has been auto-filled with card data.",
    scanFail: "Card scan failed",
    scanFailDesc: "Please try again or fill in manually.",
    successTitle: "Message sent!",
    successDesc: "Thank you for reaching out. We'll respond as soon as possible.",
    sendAgain: "Send another message",
    lblName: "Name",
    lblEmail: "Email",
    lblPhone: "Phone",
    lblCompany: "Company",
    lblLineId: "LINE ID",
    lblWhatsApp: "WhatsApp",
    lblCategory: "Product Category",
    lblCallback: "Preferred Callback Time",
    lblMessage: "Message",
    phName: "Full name",
    phEmail: "email@company.com",
    phPhone: "08x-xxx-xxxx",
    phCompany: "Company / Organization",
    phLineId: "@lineid",
    phWhatsApp: "+66...",
    phMessage: "Please describe your requirements: quantity, specifications, budget...",
    subscribe: "Subscribe to news, promotions, and updates from ENT Group",
    submit: "Send Message",
    submitSuccess: "Message sent!",
    submitSuccessDesc: "Our team will respond within 24 hours.",
    submitError: "An error occurred",
    salesTeam: "Contact Our Sales Team",
    salesTeamSub: "Reach us at",
    expertSales: "Sales Expert",
    salesStaff: "Sales Representative",
    needQuote: "Need a quotation?",
    needQuoteSub: "Select products and quantities — our sales team will prepare a quote within 24 hours.",
    requestQuote: "Request a Quote →",
    categories: [
      "Select category",
      "GT Series — Mini PC", "GB Series — Compact", "EPC Series", "EPC Box Series",
      "GK Series — Panel PC", "Panel PC GTG/GTY", "UTC Series",
      "Smart Display & KIOSK", "Rugged Tablet / Notebook", "Volktek Switch",
      "Mini PC Firewall", "vCloudPoint", "Waterproof PC IP69K", "Others",
    ],
    callbackTimes: ["Select", "Morning (9:00-12:00)", "Afternoon (13:00-16:00)", "Evening (16:00-18:00)", "Anytime"],
  },
};

const ContactUs = () => {  const [lang, setLang] = useState<Lang>("th");
  const i = t[lang];
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", company: "", lineId: "", whatsapp: "",
    callbackTime: "", category: "", message: "", subscribe: true,
  });
  const [submitted, setSubmitted] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [cardPreview, setCardPreview] = useState<string | null>(null);
  const [extractedCardData, setExtractedCardData] = useState<Record<string, string> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);


  const handleCardUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const base64 = ev.target?.result as string;
      setCardPreview(base64);
      setScanning(true);
      try {
        const { data, error } = await supabase.functions.invoke("scan-business-card", { body: { image: base64 } });
        if (error) throw error;
        const extracted = data?.data || {};
        setExtractedCardData(extracted);
        setForm((prev) => ({
          ...prev,
          name: extracted.name || prev.name, email: extracted.email || prev.email,
          phone: extracted.phone || prev.phone, company: extracted.company || prev.company,
          lineId: extracted.lineId || prev.lineId, whatsapp: extracted.whatsapp || prev.whatsapp,
        }));
        toast({ title: i.scanSuccess, description: i.scanSuccessDesc });
      } catch {
        toast({ title: i.scanFail, description: i.scanFailDesc, variant: "destructive" });
      } finally {
        setScanning(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const businessCardPayload = extractedCardData ? {
        ...extractedCardData,
        image_preview: cardPreview ? cardPreview.substring(0, 500) + "..." : null,
        scanned_at: new Date().toISOString(),
      } : null;

      const { error } = await (supabase.from as any)("contact_submissions").insert({
        name: form.name, email: form.email, phone: form.phone || null,
        company: form.company || null, line_id: form.lineId || null,
        whatsapp: form.whatsapp || null, callback_time: form.callbackTime || null,
        category: form.category || null, message: form.message,
        business_card_data: businessCardPayload,
      });
      if (error) throw error;

      if (form.subscribe && form.email) {
        await (supabase.from as any)("subscribers").insert({
          email: form.email, name: form.name || null, source: "contact_form",
        }).then(() => {});
      }

      // Notify admins about new contact form submission
      import('@/lib/notifications').then(({ notifyAdmins, sendTransactionalEmail }) => {
        notifyAdmins({
          type: 'new_contact',
          title: 'มีข้อความใหม่จากฟอร์มติดต่อ',
          message: `${form.name} (${form.email}) — ${form.message.substring(0, 80)}`,
          priority: 'high',
          actionUrl: '/admin/contacts',
          actionLabel: 'ดูรายละเอียด',
        });
        // Send confirmation email to customer
        sendTransactionalEmail({
          templateName: 'contact-confirmation',
          recipientEmail: form.email,
          idempotencyKey: `contact-confirm-${Date.now()}`,
          templateData: { customerName: form.name },
        });
      });

      setSubmitted(true);
      toast({ title: i.submitSuccess, description: i.submitSuccessDesc });
    } catch (err: any) {
      toast({ title: i.submitError, description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead title={i.seoTitle} description={i.seoDesc} path="/contact" />

      {/* Banner */}
      <div className="relative h-48 md:h-64 overflow-hidden">
        <img src={bannerContact} alt={i.bannerTitle} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="container max-w-6xl mx-auto px-6">
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-1">{i.bannerTitle}</h1>
            <p className="text-sm md:text-base text-white/80">{i.bannerSub}</p>
          </div>
        </div>
      </div>

      {/* Nav bar */}
      <div className="container max-w-6xl mx-auto px-6 py-3 border-b border-border flex items-center justify-between">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft size={14} /> {i.backHome}

        </Link>
        <button
          onClick={() => setLang(lang === "th" ? "en" : "th")}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-semibold text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all">
          <Globe size={14} /> {lang === "th" ? "EN" : "TH"}

        </button>
      </div>

      {/* Content */}
      <section className="pb-16 md:pb-24 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Left — Contact info + Map */}
            <div className="lg:col-span-2 space-y-5">
              <div className="card-surface rounded-xl p-5">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                    <Phone size={16} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground mb-1">{i.phone}</h3>
                    <a href="tel:020456104" className="block text-sm text-primary hover:underline">02-045-6104</a>
                    <a href="tel:0957391053" className="block text-sm text-primary hover:underline">095-739-1053</a>
                    <p className="text-xs text-muted-foreground mt-1">{i.fax}: 02-045-6105</p>
                  </div>
                </div>
              </div>

              <div className="card-surface rounded-xl p-5">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                    <Mail size={16} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground mb-1">{i.emailSales}</h3>
                    <a href="mailto:Sale@entgroup.co.th" className="text-sm text-primary hover:underline">Sale@entgroup.co.th</a>
                  </div>
                </div>
              </div>

              <div className="card-surface rounded-xl p-5">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                    <MapPin size={16} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground mb-1">{i.headOffice}</h3>
                    <p className="text-xs font-semibold text-foreground mb-1">{i.companyName}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">{i.address}</p>
                    <p className="text-[10px] text-muted-foreground/60 mt-2">{i.taxId}</p>
                  </div>
                </div>
              </div>

              <div className="card-surface rounded-xl p-5">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[hsl(120,60%,40%)]/10 border border-[hsl(120,60%,40%)]/20 flex items-center justify-center shrink-0">
                    <MessageCircle size={16} className="text-[hsl(120,60%,40%)]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground mb-2">{i.lineOfficial}</h3>
                    <div className="flex items-center gap-4">
                      <img
                        src="https://nvidia-jetson.com/images/line-qr.png"
                        alt="LINE QR Code @entgroup"
                        className="w-24 h-24 rounded-lg border border-border bg-white p-1"
                      />
                      <LineQRButton className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[hsl(120,60%,40%)] text-white text-xs font-bold hover:bg-[hsl(120,60%,35%)] transition-colors">
                        {i.addLine}
                      </LineQRButton>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-surface rounded-xl overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3872.5!2d100.4793839!3d13.9320709!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e2839e781a7a99%3A0xfae548f49721eb09!2sENT%20GROUP%20Co.%2CLtd.!5e0!3m2!1sth!2sth!4v1"

                  width="100%" height="220" style={{ border: 0 }} allowFullScreen loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade" title="ENTGroup Office Location" className="w-full"></iframe>
                <div className="p-3">
                  <a href="https://maps.app.goo.gl/vuvJHVwy2n2G3o7e6" target="_blank" rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline flex items-center gap-1">
                    <MapPin size={11} /> {i.openGoogleMaps}

                  </a>
                </div>
              </div>
            </div>

            {/* Right — Form */}
            <div className="lg:col-span-3">
              <div className="card-surface rounded-xl p-6 md:p-8">
                <h2 className="text-lg font-display font-bold text-foreground mb-1">{i.formTitle}</h2>
                <p className="text-xs text-muted-foreground mb-4">{i.formSub}</p>

                {/* Business Card Scanner */}
                <div className="mb-6 p-4 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 hover:border-primary/50 transition-colors">
                  <input ref={fileInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleCardUpload} />
                  {cardPreview ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                        <CreditCard size={16} className="text-primary" /> {i.uploadedCard}

                      </div>
                      <div className="relative rounded-lg overflow-hidden border border-border">
                        <img src={cardPreview} alt="Business card" className="w-full h-auto max-h-48 object-contain bg-white" />
                        {scanning && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <div className="flex items-center gap-2 text-white text-sm font-medium bg-black/60 px-4 py-2 rounded-lg">
                              <Loader2 size={16} className="animate-spin" /> {i.scanning}

                            </div>
                          </div>
                        )}
                      </div>
                      <button type="button" onClick={() => { setCardPreview(null); fileInputRef.current && (fileInputRef.current.value = ""); }}
                        className="text-xs text-muted-foreground hover:text-destructive transition-colors">{i.removeCard}</button>
                    </div>
                  ) : (
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full flex flex-col items-center gap-2 py-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                        <Camera size={22} className="text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{i.scanCard}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{i.scanCardSub}</p>
                      </div>
                    </button>
                  )}
                </div>

                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                      <Send size={24} className="text-primary" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2">{i.successTitle}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{i.successDesc}</p>
                    <button onClick={() => {
                      setSubmitted(false);
                      setForm({ name: "", email: "", phone: "", company: "", lineId: "", whatsapp: "", callbackTime: "", category: "", message: "", subscribe: true });
                    }} className="text-sm text-primary hover:underline">{i.sendAgain}</button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-foreground mb-1.5">{i.lblName} <span className="text-destructive">*</span></label>
                        <input type="text" name="name" required value={form.name} onChange={handleChange} placeholder={i.phName} className={inputClass} />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-foreground mb-1.5">{i.lblEmail} <span className="text-destructive">*</span></label>
                        <input type="email" name="email" required value={form.email} onChange={handleChange} placeholder={i.phEmail} className={inputClass} />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-foreground mb-1.5">{i.lblPhone}</label>
                        <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder={i.phPhone} className={inputClass} />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-foreground mb-1.5">{i.lblCompany}</label>
                        <input type="text" name="company" value={form.company} onChange={handleChange} placeholder={i.phCompany} className={inputClass} />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-foreground mb-1.5">{i.lblLineId}</label>
                        <input type="text" name="lineId" value={form.lineId} onChange={handleChange} placeholder={i.phLineId} className={inputClass} />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-foreground mb-1.5">{i.lblWhatsApp}</label>
                        <input type="tel" name="whatsapp" value={form.whatsapp} onChange={handleChange} placeholder={i.phWhatsApp} className={inputClass} />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-foreground mb-1.5">{i.lblCategory}</label>
                        <select name="category" value={form.category} onChange={handleChange} className={inputClass}>

                          {i.categories.map((c, idx) => (
                            <option key={c} value={idx === 0 ? "" : c}>{c}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-foreground mb-1.5">{i.lblCallback}</label>
                        <select name="callbackTime" value={form.callbackTime} onChange={handleChange} className={inputClass}>

                          {i.callbackTimes.map((ct, idx) => (
                            <option key={ct} value={idx === 0 ? "" : ct}>{ct}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1.5">{i.lblMessage} <span className="text-destructive">*</span></label>
                      <textarea name="message" required rows={5} value={form.message} onChange={handleChange} placeholder={i.phMessage} className={`${inputClass} resize-none`} />
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={form.subscribe} onChange={(e) => setForm({ ...form, subscribe: e.target.checked })}
                        className="rounded border-border text-primary focus:ring-primary/30 w-4 h-4" />
                      <span className="text-xs text-muted-foreground">{i.subscribe}</span>
                    </label>
                    <button type="submit" disabled={loading}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-colors disabled:opacity-50">
                      {loading ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />} {i.submit}

                    </button>
                  </form>
                )}
              </div>

              {/* Sales Team */}
              <div className="mt-6 card-surface rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Users size={18} className="text-primary" />
                  <h3 className="text-base font-display font-bold text-foreground">{i.salesTeam}</h3>
                </div>
                <p className="text-xs text-muted-foreground mb-5">
                  {i.salesTeamSub} <a href="mailto:Sale@entgroup.co.th" className="text-primary hover:underline">Sale@entgroup.co.th</a>
                </p>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { name: "Sky - Adisak", role: i.expertSales, img: teamSky },
                    { name: "Som - Rungaroon", role: i.salesStaff, img: teamSom },
                    { name: "Preaw - Unthikan", role: i.salesStaff, img: teamPreaw },
                  ].map((person) => (
                    <div key={person.name} className="text-center">
                      <img src={person.img} alt={person.name} className="w-20 h-20 rounded-full mx-auto mb-2 object-cover border-2 border-primary/20" />
                      <p className="text-xs font-bold text-foreground">{person.name}</p>
                      <p className="text-[10px] text-muted-foreground">{person.role}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="mt-6 card-surface rounded-xl p-5 border-l-4 border-primary">
                <p className="text-sm text-foreground font-medium mb-1">{i.needQuote}</p>
                <p className="text-xs text-muted-foreground mb-3">{i.needQuoteSub}</p>
                <button onClick={() => setQuoteOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-colors">
                  {i.requestQuote}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <FooterCompact />
    </div>
  );
};

export default ContactUs;

