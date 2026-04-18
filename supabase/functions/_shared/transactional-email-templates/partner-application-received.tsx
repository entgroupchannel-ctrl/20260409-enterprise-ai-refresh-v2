import * as React from 'npm:react@18.3.1'
import {
  Body, Button, Container, Head, Heading, Html, Preview, Text, Hr, Section,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'ENT Group'
const PRIMARY_COLOR = '#0fa888'
const PORTAL_URL = 'https://www.entgroup.co.th/partner/portal'

interface PartnerAppReceivedProps {
  name?: string
  companyName?: string
  applicationNumber?: string
  lang?: 'th' | 'en' | 'zh'
}

const greet = (lang: string, name?: string) => {
  if (lang === 'zh') return name ? `${name} 您好,` : '您好,'
  if (lang === 'en') return name ? `Dear ${name},` : 'Hello,'
  return name ? `เรียน คุณ${name}` : 'เรียน ผู้สมัคร'
}

const PartnerApplicationReceivedEmail = ({ name, companyName, applicationNumber, lang = 'th' }: PartnerAppReceivedProps) => {
  const isZh = lang === 'zh'
  const isEn = lang === 'en'

  const title = isZh ? '感谢您申请成为合作伙伴' : isEn ? 'Thank you for your partnership application' : 'ขอบคุณที่สมัครเป็นพันธมิตรกับเรา'
  const subtitle = isZh ? '我们已收到您的申请' : isEn ? "We've received your application" : 'เราได้รับใบสมัครของคุณเรียบร้อยแล้ว'
  const intro = isZh
    ? `感谢 ${companyName ?? '贵公司'} 申请成为 ENT Group 的合作伙伴。我们的团队将在 3-5 个工作日内审核您的申请。`
    : isEn
    ? `Thank you, ${companyName ?? 'your company'}, for applying to partner with ENT Group. Our team will review your application within 3-5 business days.`
    : `ขอบคุณ ${companyName ?? 'บริษัทของท่าน'} ที่สนใจเป็นพันธมิตรกับ ENT Group ทีมงานจะตรวจสอบใบสมัครภายใน 3-5 วันทำการ`
  const next = isZh ? '接下来:' : isEn ? 'What happens next:' : 'ขั้นตอนถัดไป:'
  const step1 = isZh ? '我们的合作伙伴团队将审核您提交的资料' : isEn ? 'Our partner team reviews your submission' : 'ทีมพันธมิตรของเราตรวจสอบข้อมูลที่ท่านส่งมา'
  const step2 = isZh ? '如果合适,我们会安排电话会议' : isEn ? 'If a good fit, we will schedule a call' : 'หากเหมาะสม เราจะนัดประชุมทางโทรศัพท์'
  const step3 = isZh ? '通过门户网站随时查看申请状态' : isEn ? 'Track your status anytime in the Partner Portal' : 'ติดตามสถานะใบสมัครได้ตลอดเวลาใน Partner Portal'
  const cta = isZh ? '进入合作伙伴门户' : isEn ? 'Open Partner Portal' : 'เข้าสู่ Partner Portal'
  const refLabel = isZh ? '申请编号' : isEn ? 'Application no.' : 'หมายเลขใบสมัคร'
  const footerText = isZh
    ? `如有疑问,请联系 LINE @entgroup`
    : isEn
    ? `Questions? Reach us on LINE @entgroup`
    : `หากมีคำถาม ติดต่อเราได้ที่ LINE @entgroup`

  return (
    <Html lang={lang} dir="ltr">
      <Head />
      <Preview>{subtitle} — {SITE_NAME}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={h1}>{SITE_NAME}</Heading>
          </Section>
          <Heading style={h2}>{title}</Heading>
          <Text style={text}>{greet(lang, name)}</Text>
          <Text style={text}>{intro}</Text>

          {applicationNumber && (
            <Section style={refBox}>
              <Text style={refLabelStyle}>{refLabel}</Text>
              <Text style={refValue}>{applicationNumber}</Text>
            </Section>
          )}

          <Heading style={h3}>{next}</Heading>
          <Text style={listItem}>1. {step1}</Text>
          <Text style={listItem}>2. {step2}</Text>
          <Text style={listItem}>3. {step3}</Text>

          <Section style={ctaSection}>
            <Button href={PORTAL_URL} style={button}>{cta}</Button>
          </Section>

          <Hr style={hr} />
          <Text style={footer}>{footerText}</Text>
          <Text style={footer}>© {SITE_NAME} — B2B Industrial Platform</Text>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: PartnerApplicationReceivedEmail,
  subject: (data: Record<string, any>) => {
    const lang = data?.lang ?? 'th'
    if (lang === 'zh') return '感谢您申请 ENT Group 合作伙伴'
    if (lang === 'en') return 'Your ENT Group partnership application received'
    return 'ขอบคุณที่สมัครเป็นพันธมิตร ENT Group'
  },
  displayName: 'Partner application received',
  previewData: { name: 'สมชาย', companyName: 'ABC Co., Ltd.', applicationNumber: 'PA-2026-0001', lang: 'th' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: "'IBM Plex Sans Thai', Arial, sans-serif" }
const container = { padding: '20px 30px', maxWidth: '580px', margin: '0 auto' }
const header = { textAlign: 'center' as const, padding: '20px 0 10px' }
const h1 = { fontSize: '20px', fontWeight: '700', color: PRIMARY_COLOR, margin: '0' }
const h2 = { fontSize: '20px', fontWeight: '600', color: '#1a1a2e', margin: '20px 0 10px' }
const h3 = { fontSize: '15px', fontWeight: '600', color: '#1a1a2e', margin: '20px 0 8px' }
const text = { fontSize: '14px', color: '#374151', lineHeight: '1.6', margin: '0 0 14px' }
const listItem = { fontSize: '14px', color: '#374151', lineHeight: '1.6', margin: '0 0 6px', paddingLeft: '8px' }
const refBox = { backgroundColor: '#f0fdf9', border: `1px solid ${PRIMARY_COLOR}33`, borderRadius: '8px', padding: '12px 16px', margin: '16px 0' }
const refLabelStyle = { fontSize: '12px', color: '#6b7280', margin: '0 0 4px' }
const refValue = { fontSize: '16px', fontWeight: '600', color: PRIMARY_COLOR, margin: '0', letterSpacing: '0.5px' }
const ctaSection = { textAlign: 'center' as const, margin: '24px 0' }
const button = { backgroundColor: PRIMARY_COLOR, color: '#ffffff', padding: '12px 28px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', textDecoration: 'none', display: 'inline-block' }
const hr = { borderColor: '#e5e7eb', margin: '24px 0' }
const footer = { fontSize: '12px', color: '#9ca3af', margin: '0 0 4px', textAlign: 'center' as const }
