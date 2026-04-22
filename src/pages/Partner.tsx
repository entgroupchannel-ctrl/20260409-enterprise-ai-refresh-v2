import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useState } from "react";
import {
  Building2, Globe2, Truck, Megaphone, CheckCircle2, ArrowRight, ArrowLeft,
  FileText, Search, Video, Package, Handshake, Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useI18n } from "@/contexts/I18nContext";
import LangToggle from "@/components/LangToggle";
import ThemeToggle from "@/components/ThemeToggle";
import FooterCompact from "@/components/FooterCompact";
import PartnerInquiryDialog from "@/components/partner/PartnerInquiryDialog";
import logo from "@/assets/logo-entgroup.avif";

const Partner = () => {
  const { t, lang } = useI18n();
  const [inquiryOpen, setInquiryOpen] = useState(false);

  const stats = [
    { value: "15+", label: t("partner.statsYears") },
    { value: "500+", label: t("partner.statsCustomers") },
    { value: "30+", label: t("partner.statsCategories") },
    { value: "5+", label: t("partner.statsCountries") },
  ];

  const benefits = [
    { icon: Globe2, title: t("partner.why1Title"), desc: t("partner.why1Desc") },
    { icon: Building2, title: t("partner.why2Title"), desc: t("partner.why2Desc") },
    { icon: Truck, title: t("partner.why3Title"), desc: t("partner.why3Desc") },
    { icon: Megaphone, title: t("partner.why4Title"), desc: t("partner.why4Desc") },
  ];

  const categories = [
    t("partner.cat1"), t("partner.cat2"), t("partner.cat3"),
    t("partner.cat4"), t("partner.cat5"), t("partner.cat6"),
  ];

  const requirements = [
    t("partner.req1"), t("partner.req2"), t("partner.req3"),
    t("partner.req4"), t("partner.req5"), t("partner.req6"),
  ];

  const steps = [
    { icon: FileText, title: t("partner.step1Title"), desc: t("partner.step1Desc") },
    { icon: Search, title: t("partner.step2Title"), desc: t("partner.step2Desc") },
    { icon: Video, title: t("partner.step3Title"), desc: t("partner.step3Desc") },
    { icon: Package, title: t("partner.step4Title"), desc: t("partner.step4Desc") },
    { icon: Handshake, title: t("partner.step5Title"), desc: t("partner.step5Desc") },
  ];

  const faqs = [
    { q: t("partner.faq1Q"), a: t("partner.faq1A") },
    { q: t("partner.faq2Q"), a: t("partner.faq2A") },
    { q: t("partner.faq3Q"), a: t("partner.faq3A") },
    { q: t("partner.faq4Q"), a: t("partner.faq4A") },
  ];

  const htmlLang = lang === "zh" ? "zh-CN" : lang;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <html lang={htmlLang} />
        <title>{t("partner.metaTitle")}</title>
        <meta name="description" content={t("partner.metaDesc")} />
        <link rel="canonical" href="https://www.entgroup.co.th/partner" />
      </Helmet>

      {/* ── Top bar — same style as /gt-series ── */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-4">
            <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft size={14} />
              {t("nav.home")}
            </Link>
            <div className="h-6 w-px bg-border" />
            <Link to="/" className="flex items-center gap-3">
              <img src={logo} alt="ENT GROUP" className="h-8 w-auto"  loading="lazy" decoding="async"/>
              <div className="hidden md:flex flex-col leading-tight">
                <span className="text-[11px] font-semibold text-foreground">ENT Group</span>
                <span className="text-[10px] text-muted-foreground">B2B Industrial Platform</span>
              </div>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <LangToggle variant="full" />
            <div className="h-5 w-px bg-border" />
            <ThemeToggle />
            <Button asChild size="sm" className="hidden sm:inline-flex">
              <Link to="/partner/apply">{t("partner.ctaApply")}</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background pointer-events-none" />
        <div className="absolute top-0 right-0 -z-0 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="container max-w-7xl relative mx-auto px-6 py-20 md:py-28">
          <div className="max-w-3xl">
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wider uppercase mb-6">
              {t("partner.eyebrow")}
            </span>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight mb-6">
              {t("partner.heroTitle")}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8 max-w-2xl">
              {t("partner.heroSubtitle")}
            </p>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <Link to="/partner/apply">
                  {t("partner.ctaApply")} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="#why">{t("partner.ctaLearn")}</a>
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl">
            {stats.map((s, i) => (
              <div key={i} className="border-l-2 border-primary/40 pl-4">
                <div className="text-3xl md:text-4xl font-bold text-foreground">{s.value}</div>
                <div className="text-xs md:text-sm text-muted-foreground mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why partner ── */}
      <section id="why" className="py-20 md:py-28">
        <div className="container max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-12 max-w-2xl">
            {t("partner.whyTitle")}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {benefits.map((b, i) => (
              <Card key={i} className="border-border/50 hover:border-primary/40 transition-colors">
                <CardContent className="p-6 md:p-8">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <b.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{b.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{b.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── Looking for ── */}
      <section className="py-20 md:py-28 bg-muted/30 border-y border-border/50">
        <div className="container max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-12 max-w-2xl">
            {t("partner.lookingTitle")}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((c, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-5 rounded-lg bg-background border border-border/50 hover:border-primary/40 transition-colors"
              >
                <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                <span className="font-medium">{c}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Requirements ── */}
      <section className="py-20 md:py-28">
        <div className="container max-w-4xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-12">
            {t("partner.reqTitle")}
          </h2>
          <ul className="space-y-4">
            {requirements.map((r, i) => (
              <li key={i} className="flex items-start gap-4 p-5 rounded-lg bg-card border border-border/50">
                <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-lg">{r}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Process ── */}
      <section className="py-20 md:py-28 bg-muted/30 border-y border-border/50">
        <div className="container max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-12 max-w-2xl">
            {t("partner.processTitle")}
          </h2>
          <div className="grid md:grid-cols-5 gap-4">
            {steps.map((s, i) => (
              <div key={i} className="relative">
                <Card className="h-full border-border/50">
                  <CardContent className="p-5">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                      <s.icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2 text-sm">{s.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 md:py-28">
        <div className="container max-w-3xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-12">
            {t("partner.faqTitle")}
          </h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-border/50">
                <AccordionTrigger className="text-left text-lg font-semibold hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed text-base">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section
        id="apply"
        className="py-20 md:py-28 bg-gradient-to-br from-primary/10 via-background to-primary/5 border-t border-border/50"
      >
        <div className="container max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
            {t("partner.finalCtaTitle")}
          </h2>
          <p className="text-lg text-muted-foreground mb-10">
            {t("partner.finalCtaDesc")}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" asChild>
              <Link to="/partner/apply">
                {t("partner.ctaApply")} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" onClick={() => setInquiryOpen(true)}>
              <Mail className="mr-2 h-4 w-4" />
              {t("partner.contactEmail")}
            </Button>
          </div>
        </div>
      </section>

      <FooterCompact />

      <PartnerInquiryDialog open={inquiryOpen} onOpenChange={setInquiryOpen} />
    </div>
  );
};

export default Partner;
