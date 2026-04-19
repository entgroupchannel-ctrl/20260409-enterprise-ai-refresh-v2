import * as React from 'npm:react@18.3.1'
import {
  Body, Button, Container, Head, Heading, Html, Preview, Text, Hr, Section,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'ENT Group'
const BRAND_NAVY = '#0A1628'
const BRAND_GOLD = '#C9A961'

interface InvestorVisionLinkProps {
  recipient_name?: string
  brief_url?: string
  expires_at?: string
}

const formatDate = (iso?: string) => {
  if (!iso) return ''
  try {
    const d = new Date(iso)
    return d.toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })
  } catch { return '' }
}

const InvestorVisionLinkEmail = ({ recipient_name, brief_url, expires_at }: InvestorVisionLinkProps) => (
  <Html lang="th" dir="ltr">
    <Head />
    <Preview>ลิงก์เข้าถึง Strategic Vision ของ ENT Group สำหรับท่าน</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Heading style={brand}>{SITE_NAME}</Heading>
          <Text style={tagline}>Investor Relations · Strategic Vision</Text>
        </Section>

        <Heading style={h2}>
          {recipient_name ? `เรียน คุณ${recipient_name}` : 'เรียน ท่านผู้ลงทุน'}
        </Heading>

        <Text style={text}>
          ขอบคุณที่ให้ความสนใจใน <strong>ENT Group</strong> — เรายินดีนำเสนอเอกสาร
          <strong> Strategic Vision</strong> ฉบับเต็ม ซึ่งครอบคลุม:
        </Text>

        <ul style={list}>
          <li style={li}>📊 Market Position & SWOT Analysis</li>
          <li style={li}>🎯 5-Year Strategic Roadmap</li>
          <li style={li}>♻️ ESG & Circular Wealth Engine</li>
          <li style={li}>💎 Investment Highlights</li>
        </ul>

        <Section style={ctaSection}>
          <Button href={brief_url} style={ctaButton}>
            เปิดเอกสาร Strategic Vision →
          </Button>
        </Section>

        {expires_at && (
          <Text style={notice}>
            ⏱️ ลิงก์นี้มีอายุการใช้งานถึง <strong>{formatDate(expires_at)}</strong>
          </Text>
        )}

        <Hr style={hr} />

        <Text style={smallText}>
          <strong>หมายเหตุด้านความปลอดภัย:</strong><br />
          ลิงก์นี้สร้างเฉพาะสำหรับท่านเท่านั้น กรุณาไม่ส่งต่อ ระบบบันทึกการเปิดดูทุกครั้ง
          เพื่อความปลอดภัยของข้อมูลเชิงกลยุทธ์
        </Text>

        <Text style={smallText}>
          หากท่านต้องการนัดหารือเพิ่มเติม สามารถตอบกลับอีเมลนี้ หรือติดต่อทีม Investor Relations
          ได้โดยตรง
        </Text>

        <Hr style={hr} />
        <Text style={footer}>
          {SITE_NAME} · บริษัท อีเอ็นที กรุ๊ป จำกัด<br />
          B2B Industrial Platform — แพลตฟอร์มจัดซื้ออุตสาหกรรมแบบครบวงจร
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: InvestorVisionLinkEmail,
  subject: 'ลิงก์เข้าถึง Strategic Vision — ENT Group Investor Relations',
  displayName: 'Investor Vision Link',
  previewData: {
    recipient_name: 'สมชาย ใจดี',
    brief_url: 'https://www.entgroup.co.th/investors/brief/preview-token',
    expires_at: new Date(Date.now() + 30 * 86400_000).toISOString(),
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: "'IBM Plex Sans Thai', Arial, sans-serif" }
const container = { padding: '20px 30px', maxWidth: '580px', margin: '0 auto' }
const header = { textAlign: 'center' as const, padding: '20px 0 16px', borderBottom: `2px solid ${BRAND_GOLD}` }
const brand = { fontSize: '24px', fontWeight: '700', color: BRAND_NAVY, margin: '0', letterSpacing: '0.05em' }
const tagline = { fontSize: '11px', color: BRAND_GOLD, margin: '4px 0 0', textTransform: 'uppercase' as const, letterSpacing: '0.15em', fontWeight: '600' }
const h2 = { fontSize: '18px', fontWeight: '600', color: BRAND_NAVY, margin: '24px 0 12px' }
const text = { fontSize: '14px', color: '#374151', lineHeight: '1.7', margin: '0 0 14px' }
const list = { padding: '0 0 0 20px', margin: '8px 0 20px' }
const li = { fontSize: '14px', color: '#374151', lineHeight: '2', listStyle: 'none' as const }
const ctaSection = { textAlign: 'center' as const, margin: '28px 0' }
const ctaButton = {
  backgroundColor: BRAND_NAVY,
  color: BRAND_GOLD,
  padding: '14px 28px',
  borderRadius: '6px',
  fontSize: '14px',
  fontWeight: '700',
  textDecoration: 'none',
  display: 'inline-block',
  letterSpacing: '0.02em',
}
const notice = { fontSize: '13px', color: '#6b7280', textAlign: 'center' as const, margin: '0 0 16px', padding: '10px', backgroundColor: '#f9fafb', borderRadius: '4px' }
const hr = { borderColor: '#e5e7eb', margin: '24px 0' }
const smallText = { fontSize: '12px', color: '#6b7280', lineHeight: '1.6', margin: '0 0 12px' }
const footer = { fontSize: '11px', color: '#9ca3af', margin: '0', textAlign: 'center' as const, lineHeight: '1.6' }
