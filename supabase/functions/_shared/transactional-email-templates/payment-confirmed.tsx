import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Hr, Section,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'ENT Group'
const PRIMARY_COLOR = '#0fa888'

interface PaymentConfirmedProps {
  customerName?: string
  invoiceNumber?: string
  amount?: string
}

const PaymentConfirmedEmail = ({ customerName, invoiceNumber, amount }: PaymentConfirmedProps) => (
  <Html lang="th" dir="ltr">
    <Head />
    <Preview>ยืนยันการชำระเงินสำเร็จ — {SITE_NAME}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Heading style={h1}>{SITE_NAME}</Heading>
        </Section>
        <Heading style={h2}>✅ ยืนยันการชำระเงินเรียบร้อย</Heading>
        <Text style={text}>
          {customerName ? `สวัสดีครับ/ค่ะ คุณ${customerName},` : 'สวัสดีครับ/ค่ะ,'}
        </Text>
        <Text style={text}>
          เราได้ตรวจสอบและยืนยันการชำระเงินของคุณเรียบร้อยแล้ว
          {invoiceNumber ? ` สำหรับใบแจ้งหนี้ ${invoiceNumber}` : ''}
          {amount ? ` จำนวน ${amount} บาท` : ''}
        </Text>
        <Text style={text}>
          ขอบคุณสำหรับการชำระเงิน ทีมงานของเราจะดำเนินการตามขั้นตอนถัดไปให้เร็วที่สุด
        </Text>
        <Hr style={hr} />
        <Text style={footer}>
          ขอบคุณที่ไว้วางใจ {SITE_NAME} — แพลตฟอร์มจัดซื้ออุตสาหกรรมแบบครบวงจร
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: PaymentConfirmedEmail,
  subject: 'ยืนยันการชำระเงินเรียบร้อย — ENT Group',
  displayName: 'Payment confirmed',
  previewData: { customerName: 'สมชาย', invoiceNumber: 'INV-2026-0001', amount: '125,000.00' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: "'IBM Plex Sans Thai', Arial, sans-serif" }
const container = { padding: '20px 30px', maxWidth: '580px', margin: '0 auto' }
const header = { textAlign: 'center' as const, padding: '20px 0 10px' }
const h1 = { fontSize: '20px', fontWeight: '700', color: PRIMARY_COLOR, margin: '0' }
const h2 = { fontSize: '18px', fontWeight: '600', color: '#1a1a2e', margin: '20px 0 10px' }
const text = { fontSize: '14px', color: '#374151', lineHeight: '1.6', margin: '0 0 16px' }
const hr = { borderColor: '#e5e7eb', margin: '24px 0' }
const footer = { fontSize: '12px', color: '#9ca3af', margin: '0', textAlign: 'center' as const }
