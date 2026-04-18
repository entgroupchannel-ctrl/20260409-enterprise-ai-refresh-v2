import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Button, Hr, Section,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'ENT Group'
const PRIMARY_COLOR = '#0fa888'
const SITE_URL = 'https://entgroup.co.th'

interface QuoteReceivedInviteProps {
  customerName?: string
  quoteNumber?: string
  customerEmail?: string
}

const QuoteReceivedInviteEmail = ({ customerName, quoteNumber, customerEmail }: QuoteReceivedInviteProps) => {
  const params = new URLSearchParams()
  if (customerEmail) params.set('email', customerEmail)
  if (quoteNumber) params.set('ref', quoteNumber)
  if (customerName) params.set('name', customerName)
  const registerUrl = `${SITE_URL}/register?${params.toString()}`

  return (
    <Html lang="th" dir="ltr">
      <Head />
      <Preview>เราได้รับคำขอใบเสนอราคา {quoteNumber || ''} แล้ว</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={h1}>{SITE_NAME}</Heading>
          </Section>
          <Heading style={h2}>ขอบคุณที่ส่งคำขอใบเสนอราคา 🎉</Heading>
          <Text style={text}>
            {customerName ? `สวัสดีครับ/ค่ะ คุณ${customerName},` : 'สวัสดีครับ/ค่ะ,'}
          </Text>
          <Text style={text}>
            เราได้รับคำขอใบเสนอราคา{quoteNumber ? ` หมายเลข ${quoteNumber}` : ''} ของท่านเรียบร้อยแล้ว
            ทีมงานจะติดต่อกลับภายใน <strong>4 ชั่วโมง</strong> ในเวลาทำการ
          </Text>

          <Section style={inviteBox}>
            <Heading style={h3}>📌 สมัครสมาชิกฟรี เพื่อติดตามใบเสนอราคา</Heading>
            <Text style={inviteText}>
              สร้างบัญชีใน 30 วินาที — ดูสถานะ, รับการแจ้งเตือน, ดาวน์โหลด PDF, และตอบกลับได้ทันที
            </Text>
            <Section style={{ textAlign: 'center', margin: '16px 0 4px' }}>
              <Button style={button} href={registerUrl}>
                สมัครสมาชิกเพื่อติดตาม
              </Button>
            </Section>
            <Text style={hint}>
              เราเตรียมข้อมูลของท่านไว้แล้ว — เพียงตั้งรหัสผ่านก็เริ่มใช้งานได้ทันที
            </Text>
          </Section>

          <Hr style={hr} />
          <Text style={footer}>
            ขอบคุณที่ไว้วางใจ {SITE_NAME} — แพลตฟอร์มจัดซื้ออุตสาหกรรมแบบครบวงจร
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: QuoteReceivedInviteEmail,
  subject: (data: Record<string, any>) =>
    `ได้รับคำขอใบเสนอราคา ${data.quoteNumber || ''} — ${SITE_NAME}`,
  displayName: 'Quote received — invite guest to register',
  previewData: { customerName: 'สมชาย', quoteNumber: 'QT-2026-0001', customerEmail: 'somchai@example.com' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: "'IBM Plex Sans Thai', Arial, sans-serif" }
const container = { padding: '20px 30px', maxWidth: '580px', margin: '0 auto' }
const header = { textAlign: 'center' as const, padding: '20px 0 10px' }
const h1 = { fontSize: '20px', fontWeight: '700', color: PRIMARY_COLOR, margin: '0' }
const h2 = { fontSize: '20px', fontWeight: '600', color: '#1a1a2e', margin: '20px 0 10px' }
const h3 = { fontSize: '15px', fontWeight: '600', color: '#1a1a2e', margin: '0 0 8px' }
const text = { fontSize: '14px', color: '#374151', lineHeight: '1.6', margin: '0 0 16px' }
const inviteBox = { backgroundColor: '#f0fdf9', border: `1px solid ${PRIMARY_COLOR}33`, borderRadius: '10px', padding: '18px 20px', margin: '20px 0' }
const inviteText = { fontSize: '13px', color: '#374151', lineHeight: '1.6', margin: '0 0 8px' }
const hint = { fontSize: '11px', color: '#6b7280', textAlign: 'center' as const, margin: '4px 0 0' }
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
