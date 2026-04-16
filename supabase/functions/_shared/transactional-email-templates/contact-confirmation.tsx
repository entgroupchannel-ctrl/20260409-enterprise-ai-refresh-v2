import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Hr, Section,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'ENT Group'
const PRIMARY_COLOR = '#0fa888'

interface ContactConfirmationProps {
  name?: string
}

const ContactConfirmationEmail = ({ name }: ContactConfirmationProps) => (
  <Html lang="th" dir="ltr">
    <Head />
    <Preview>ขอบคุณที่ติดต่อ {SITE_NAME}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Heading style={h1}>{SITE_NAME}</Heading>
        </Section>
        <Heading style={h2}>ได้รับข้อความของคุณแล้ว</Heading>
        <Text style={text}>
          {name ? `สวัสดีครับ/ค่ะ คุณ${name},` : 'สวัสดีครับ/ค่ะ,'}
        </Text>
        <Text style={text}>
          เราได้รับข้อความของคุณเรียบร้อยแล้ว ทีมงาน ENT Group จะตรวจสอบและตอบกลับภายใน 1-2 วันทำการ
        </Text>
        <Text style={text}>
          หากมีความเร่งด่วน สามารถติดต่อเราได้โดยตรงทาง LINE @entgroup
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
  component: ContactConfirmationEmail,
  subject: 'ขอบคุณที่ติดต่อ ENT Group',
  displayName: 'Contact form confirmation',
  previewData: { name: 'สมชาย' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: "'IBM Plex Sans Thai', Arial, sans-serif" }
const container = { padding: '20px 30px', maxWidth: '580px', margin: '0 auto' }
const header = { textAlign: 'center' as const, padding: '20px 0 10px' }
const h1 = { fontSize: '20px', fontWeight: '700', color: PRIMARY_COLOR, margin: '0' }
const h2 = { fontSize: '18px', fontWeight: '600', color: '#1a1a2e', margin: '20px 0 10px' }
const text = { fontSize: '14px', color: '#374151', lineHeight: '1.6', margin: '0 0 16px' }
const hr = { borderColor: '#e5e7eb', margin: '24px 0' }
const footer = { fontSize: '12px', color: '#9ca3af', margin: '0', textAlign: 'center' as const }
