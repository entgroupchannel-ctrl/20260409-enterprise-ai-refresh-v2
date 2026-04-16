/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body, Button, Container, Head, Heading, Html, Link, Preview, Text, Hr, Section,
} from 'npm:@react-email/components@0.0.22'

const SITE_NAME = 'ENT Group'
const PRIMARY = '#0fa888'

interface SignupEmailProps {
  siteName: string
  siteUrl: string
  recipient: string
  confirmationUrl: string
}

export const SignupEmail = ({ siteName, siteUrl, recipient, confirmationUrl }: SignupEmailProps) => (
  <Html lang="th" dir="ltr">
    <Head />
    <Preview>ยืนยันอีเมลของคุณสำหรับ {SITE_NAME}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Heading style={logo}>{SITE_NAME}</Heading>
        </Section>
        <Heading style={h1}>ยืนยันอีเมลของคุณ</Heading>
        <Text style={text}>
          ขอบคุณที่สมัครสมาชิก{' '}
          <Link href={siteUrl} style={link}><strong>{SITE_NAME}</strong></Link>
          {' '}— แพลตฟอร์มจัดซื้ออุตสาหกรรมแบบครบวงจร
        </Text>
        <Text style={text}>
          กรุณายืนยันอีเมลของคุณ (
          <Link href={`mailto:${recipient}`} style={link}>{recipient}</Link>
          ) โดยคลิกปุ่มด้านล่าง:
        </Text>
        <Section style={buttonSection}>
          <Button style={button} href={confirmationUrl}>
            ยืนยันอีเมล
          </Button>
        </Section>
        <Hr style={hr} />
        <Text style={footer}>
          หากคุณไม่ได้สร้างบัญชีนี้ สามารถเพิกเฉยอีเมลฉบับนี้ได้
        </Text>
        <Text style={footerBrand}>© {SITE_NAME} — B2B Industrial Platform</Text>
      </Container>
    </Body>
  </Html>
)

export default SignupEmail

const main = { backgroundColor: '#ffffff', fontFamily: "'IBM Plex Sans Thai', Arial, sans-serif" }
const container = { padding: '20px 30px', maxWidth: '580px', margin: '0 auto' }
const header = { textAlign: 'center' as const, padding: '20px 0 10px' }
const logo = { fontSize: '20px', fontWeight: '700' as const, color: PRIMARY, margin: '0' }
const h1 = { fontSize: '20px', fontWeight: '600' as const, color: '#1a1a2e', margin: '20px 0 10px' }
const text = { fontSize: '14px', color: '#374151', lineHeight: '1.6', margin: '0 0 16px' }
const link = { color: PRIMARY, textDecoration: 'underline' }
const buttonSection = { textAlign: 'center' as const, margin: '24px 0' }
const button = {
  backgroundColor: PRIMARY, color: '#ffffff', fontSize: '14px',
  borderRadius: '8px', padding: '12px 28px', textDecoration: 'none', fontWeight: '600' as const,
}
const hr = { borderColor: '#e5e7eb', margin: '24px 0' }
const footer = { fontSize: '12px', color: '#9ca3af', margin: '0 0 8px' }
const footerBrand = { fontSize: '12px', color: '#9ca3af', margin: '0', textAlign: 'center' as const }
