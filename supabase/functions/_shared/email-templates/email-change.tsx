/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body, Button, Container, Head, Heading, Html, Link, Preview, Text, Hr, Section,
} from 'npm:@react-email/components@0.0.22'

const SITE_NAME = 'ENT Group'
const PRIMARY = '#0fa888'

interface EmailChangeEmailProps {
  siteName: string
  email: string
  newEmail: string
  confirmationUrl: string
}

export const EmailChangeEmail = ({ siteName, email, newEmail, confirmationUrl }: EmailChangeEmailProps) => (
  <Html lang="th" dir="ltr">
    <Head />
    <Preview>ยืนยันการเปลี่ยนอีเมลสำหรับ {SITE_NAME}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Heading style={logo}>{SITE_NAME}</Heading>
        </Section>
        <Heading style={h1}>ยืนยันการเปลี่ยนอีเมล</Heading>
        <Text style={text}>
          คุณขอเปลี่ยนอีเมลสำหรับ {SITE_NAME} จาก{' '}
          <Link href={`mailto:${email}`} style={link}>{email}</Link>{' '}
          เป็น{' '}
          <Link href={`mailto:${newEmail}`} style={link}>{newEmail}</Link>
        </Text>
        <Text style={text}>คลิกปุ่มด้านล่างเพื่อยืนยันการเปลี่ยนแปลง:</Text>
        <Section style={buttonSection}>
          <Button style={button} href={confirmationUrl}>
            ยืนยันการเปลี่ยนอีเมล
          </Button>
        </Section>
        <Hr style={hr} />
        <Text style={footer}>
          หากคุณไม่ได้ขอเปลี่ยนอีเมล กรุณาตรวจสอบความปลอดภัยบัญชีของคุณทันที
        </Text>
        <Text style={footerBrand}>© {SITE_NAME} — B2B Industrial Platform</Text>
      </Container>
    </Body>
  </Html>
)

export default EmailChangeEmail

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
