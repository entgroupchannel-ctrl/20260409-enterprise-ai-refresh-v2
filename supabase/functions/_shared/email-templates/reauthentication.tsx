/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body, Container, Head, Heading, Html, Preview, Text, Hr, Section,
} from 'npm:@react-email/components@0.0.22'

const SITE_NAME = 'ENT Group'
const PRIMARY = '#0fa888'

interface ReauthenticationEmailProps {
  token: string
}

export const ReauthenticationEmail = ({ token }: ReauthenticationEmailProps) => (
  <Html lang="th" dir="ltr">
    <Head />
    <Preview>รหัสยืนยันตัวตนของคุณ</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Heading style={logo}>{SITE_NAME}</Heading>
        </Section>
        <Heading style={h1}>ยืนยันตัวตน</Heading>
        <Text style={text}>ใช้รหัสด้านล่างเพื่อยืนยันตัวตนของคุณ:</Text>
        <Text style={codeStyle}>{token}</Text>
        <Hr style={hr} />
        <Text style={footer}>
          รหัสนี้จะหมดอายุในเวลาอันสั้น หากคุณไม่ได้ขอรหัสนี้ สามารถเพิกเฉยอีเมลฉบับนี้ได้
        </Text>
        <Text style={footerBrand}>© {SITE_NAME} — B2B Industrial Platform</Text>
      </Container>
    </Body>
  </Html>
)

export default ReauthenticationEmail

const main = { backgroundColor: '#ffffff', fontFamily: "'IBM Plex Sans Thai', Arial, sans-serif" }
const container = { padding: '20px 30px', maxWidth: '580px', margin: '0 auto' }
const header = { textAlign: 'center' as const, padding: '20px 0 10px' }
const logo = { fontSize: '20px', fontWeight: '700' as const, color: PRIMARY, margin: '0' }
const h1 = { fontSize: '20px', fontWeight: '600' as const, color: '#1a1a2e', margin: '20px 0 10px' }
const text = { fontSize: '14px', color: '#374151', lineHeight: '1.6', margin: '0 0 16px' }
const codeStyle = {
  fontFamily: 'Courier, monospace', fontSize: '28px', fontWeight: 'bold' as const,
  color: PRIMARY, margin: '0 0 30px', textAlign: 'center' as const, letterSpacing: '4px',
}
const hr = { borderColor: '#e5e7eb', margin: '24px 0' }
const footer = { fontSize: '12px', color: '#9ca3af', margin: '0 0 8px' }
const footerBrand = { fontSize: '12px', color: '#9ca3af', margin: '0', textAlign: 'center' as const }
