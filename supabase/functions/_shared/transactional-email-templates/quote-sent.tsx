import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Button, Hr, Section,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'ENT Group'
const PRIMARY_COLOR = '#0fa888'

interface QuoteSentProps {
  customerName?: string
  quoteNumber?: string
  viewUrl?: string
}

const QuoteSentEmail = ({ customerName, quoteNumber, viewUrl }: QuoteSentProps) => (
  <Html lang="th" dir="ltr">
    <Head />
    <Preview>ใบเสนอราคา {quoteNumber || ''} จาก {SITE_NAME}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Heading style={h1}>{SITE_NAME}</Heading>
        </Section>
        <Heading style={h2}>ใบเสนอราคาของคุณพร้อมแล้ว</Heading>
        <Text style={text}>
          {customerName ? `สวัสดีครับ/ค่ะ คุณ${customerName},` : 'สวัสดีครับ/ค่ะ,'}
        </Text>
        <Text style={text}>
          เราได้จัดทำใบเสนอราคา{quoteNumber ? ` หมายเลข ${quoteNumber}` : ''} เรียบร้อยแล้ว
          กรุณาตรวจสอบรายละเอียดและเงื่อนไขต่างๆ
        </Text>
        {viewUrl && (
          <Section style={{ textAlign: 'center', margin: '30px 0' }}>
            <Button style={button} href={viewUrl}>
              ดูใบเสนอราคา
            </Button>
          </Section>
        )}
        <Hr style={hr} />
        <Text style={footer}>
          ขอบคุณที่ไว้วางใจ {SITE_NAME} — แพลตฟอร์มจัดซื้ออุตสาหกรรมแบบครบวงจร
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: QuoteSentEmail,
  subject: (data: Record<string, any>) =>
    `ใบเสนอราคา ${data.quoteNumber || ''} — ${SITE_NAME}`,
  displayName: 'Quote sent to customer',
  previewData: { customerName: 'สมชาย', quoteNumber: 'QT-2026-0001', viewUrl: 'https://entgroup.co.th/my-quotes/123' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: "'IBM Plex Sans Thai', Arial, sans-serif" }
const container = { padding: '20px 30px', maxWidth: '580px', margin: '0 auto' }
const header = { textAlign: 'center' as const, padding: '20px 0 10px' }
const h1 = { fontSize: '20px', fontWeight: '700', color: PRIMARY_COLOR, margin: '0' }
const h2 = { fontSize: '18px', fontWeight: '600', color: '#1a1a2e', margin: '20px 0 10px' }
const text = { fontSize: '14px', color: '#374151', lineHeight: '1.6', margin: '0 0 16px' }
const button = {
  backgroundColor: PRIMARY_COLOR,
  color: '#ffffff',
  padding: '12px 28px',
  borderRadius: '8px',
  fontSize: '14px',
  fontWeight: '600',
  textDecoration: 'none',
}
const hr = { borderColor: '#e5e7eb', margin: '24px 0' }
const footer = { fontSize: '12px', color: '#9ca3af', margin: '0', textAlign: 'center' as const }
