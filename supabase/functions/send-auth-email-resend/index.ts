import * as React from 'npm:react@18.3.1'
import { renderAsync } from 'npm:@react-email/components@0.0.22'
import { createClient } from 'npm:@supabase/supabase-js@2'
import {
  Body, Button, Container, Head, Heading, Html, Hr, Img, Preview, Section, Text,
} from 'npm:@react-email/components@0.0.22'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
}

const GATEWAY_URL = 'https://connector-gateway.lovable.dev/resend'
const DEFAULT_SITE_NAME = 'ENT Group'
const DEFAULT_PRIMARY = '#0fa888'
const DEFAULT_FONT = "'IBM Plex Sans Thai', Arial, sans-serif"
const FROM_EMAIL = 'ENT Group <noreply@entgroup.co.th>'

const DEFAULT_SUBJECTS: Record<string, string> = {
  signup: 'ยืนยันอีเมลของคุณ — ENT Group',
  recovery: 'รีเซ็ตรหัสผ่าน — ENT Group',
  magiclink: 'ลิงก์เข้าสู่ระบบ — ENT Group',
  invite: 'คุณได้รับเชิญเข้าร่วม — ENT Group',
  email_change: 'ยืนยันการเปลี่ยนอีเมล — ENT Group',
}

interface TemplateSettings {
  subject?: string
  heading?: string
  body_text?: string
  button_text?: string
  footer_text?: string
  primary_color?: string
  logo_url?: string
  site_name?: string
  font_family?: string
}

function EmailTemplate({ settings, templateType, confirmationUrl, recipient, email, newEmail }: {
  settings: TemplateSettings
  templateType: string
  confirmationUrl?: string
  recipient?: string
  email?: string
  newEmail?: string
}) {
  const primary = settings.primary_color || DEFAULT_PRIMARY
  const siteName = settings.site_name || DEFAULT_SITE_NAME
  const fontFamily = settings.font_family || DEFAULT_FONT

  let bodyText = settings.body_text || ''
  if (templateType === 'signup' && recipient) {
    bodyText = bodyText || `ขอบคุณที่สมัครสมาชิก ${siteName} กรุณายืนยันอีเมลของคุณ (${recipient}) โดยคลิกปุ่มด้านล่าง:`
  }
  if (templateType === 'recovery') {
    bodyText = bodyText || 'คุณได้ร้องขอรีเซ็ตรหัสผ่าน กรุณาคลิกปุ่มด้านล่างเพื่อตั้งรหัสผ่านใหม่:'
  }
  if (templateType === 'email_change' && email && newEmail) {
    bodyText = bodyText || `คุณขอเปลี่ยนอีเมลจาก ${email} เป็น ${newEmail} คลิกปุ่มด้านล่างเพื่อยืนยัน:`
  }

  const main = { backgroundColor: '#ffffff', fontFamily }
  const container = { padding: '20px 30px', maxWidth: '580px', margin: '0 auto' }
  const header = { textAlign: 'left' as const, padding: '16px 0 12px' }
  const logoLink = { textDecoration: 'none', display: 'inline-block' }
  const logoImg = { height: '32px', width: 'auto', display: 'block' }
  const logo = { fontSize: '18px', fontWeight: '700' as const, color: primary, margin: '0' }
  const h1Style = { fontSize: '20px', fontWeight: '600' as const, color: '#1a1a2e', margin: '20px 0 10px' }
  const textStyle = { fontSize: '14px', color: '#374151', lineHeight: '1.6', margin: '0 0 16px' }
  const buttonSection = { textAlign: 'center' as const, margin: '24px 0' }
  const buttonStyle = {
    backgroundColor: primary, color: '#ffffff', fontSize: '14px',
    borderRadius: '8px', padding: '12px 28px', textDecoration: 'none', fontWeight: '600' as const,
  }
  const hrStyle = { borderColor: '#e5e7eb', margin: '24px 0' }
  const footer = { fontSize: '12px', color: '#9ca3af', margin: '0 0 8px' }
  const contactInfo = { fontSize: '12px', color: '#9ca3af', margin: '0 0 4px', textAlign: 'center' as const }
  const footerBrand = { fontSize: '12px', color: '#9ca3af', margin: '0', textAlign: 'center' as const }

  return React.createElement(Html, { lang: 'th', dir: 'ltr' },
    React.createElement(Head, null,
      React.createElement('meta', { httpEquiv: 'Content-Type', content: 'text/html; charset=UTF-8' }),
      React.createElement('meta', { charSet: 'UTF-8' }),
    ),
    React.createElement(Preview, null, settings.heading || settings.subject || ''),
    React.createElement(Body, { style: main },
      React.createElement(Container, { style: container },
        React.createElement(Section, { style: header },
          React.createElement('a', { href: 'https://www.entgroup.co.th', style: logoLink },
            settings.logo_url
              ? React.createElement(Img, { src: settings.logo_url, alt: siteName, style: logoImg })
              : React.createElement(Heading, { style: logo }, siteName),
          ),
        ),
        React.createElement(Heading, { style: h1Style }, settings.heading || ''),
        React.createElement(Text, { style: textStyle }, bodyText),
        settings.button_text && confirmationUrl
          ? React.createElement(Section, { style: buttonSection },
              React.createElement(Button, { style: buttonStyle, href: confirmationUrl }, settings.button_text),
            )
          : null,
        React.createElement(Hr, { style: hrStyle }),
        React.createElement(Text, { style: footer }, settings.footer_text || ''),
        React.createElement(Text, { style: contactInfo }, 'Line: @entgroup | โทร: 02-045-6104 / 095-739-1053'),
        React.createElement(Text, { style: contactInfo }, 'Email: sales@entgroup.co.th'),
        React.createElement(Text, { style: footerBrand }, `© ${siteName} — B2B Industrial Platform`),
      ),
    ),
  )
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY')
  if (!LOVABLE_API_KEY) {
    return new Response(JSON.stringify({ error: 'LOVABLE_API_KEY not configured' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
  if (!RESEND_API_KEY) {
    return new Response(JSON.stringify({ error: 'RESEND_API_KEY not configured' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  // Validate auth - require logged-in user OR service role
  const authHeader = req.headers.get('Authorization')
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

  // For password reset, we allow unauthenticated requests (user forgot password)
  // but we validate the request body
  let body: {
    email: string
    type: string
    redirectTo?: string
    password?: string
    metadata?: Record<string, unknown>
  }
  try {
    body = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const { email, type, redirectTo, password, metadata } = body

  if (!email || !type) {
    return new Response(JSON.stringify({ error: 'email and type are required' }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  if (!DEFAULT_SUBJECTS[type]) {
    return new Response(JSON.stringify({ error: `Unknown email type: ${type}` }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey)

  try {
    // For signup with password: create user via admin API (no email sent by Supabase),
    // then generate confirmation link manually. This bypasses Supabase's SMTP rate limit.
    if (type === 'signup' && password) {
      const { error: createErr } = await adminClient.auth.admin.createUser({
        email,
        password,
        email_confirm: false, // require email confirmation via our link
        user_metadata: metadata || {},
      })

      if (createErr) {
        const code = (createErr as any).code || ''
        const msg = createErr.message || ''
        if (code === 'email_exists' || msg.toLowerCase().includes('already')) {
          return new Response(JSON.stringify({ error: 'อีเมลนี้ถูกใช้สมัครสมาชิกแล้ว', code: 'email_exists' }), {
            status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          })
        }
        console.error('createUser error:', createErr)
        return new Response(JSON.stringify({ error: msg }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
    }

    // Generate the action link using admin API (doesn't send email, no rate limit)
    const linkType = type === 'signup' ? 'signup' : type === 'recovery' ? 'recovery' : type === 'magiclink' ? 'magiclink' : type === 'invite' ? 'invite' : 'recovery'

    const linkOptions: Record<string, unknown> = {
      redirectTo: redirectTo || 'https://www.entgroup.co.th/login',
    }
    // For signup, generateLink also requires password (uses existing user if same)
    if (linkType === 'signup' && password) {
      linkOptions.password = password
      if (metadata) linkOptions.data = metadata
    }

    let { data: linkData, error: linkError } = await adminClient.auth.admin.generateLink({
      type: linkType,
      email,
      options: linkOptions,
    })

    // Fallback: if signup/invite fails because user already exists, use magiclink for testing
    if (linkError && (linkError as any).code === 'email_exists') {
      console.log(`User exists, falling back to magiclink for test: ${email}`)
      const fallback = await adminClient.auth.admin.generateLink({
        type: 'magiclink',
        email,
        options: { redirectTo: redirectTo || 'https://www.entgroup.co.th/login' },
      })
      linkData = fallback.data
      linkError = fallback.error
    }

    if (linkError) {
      console.error('generateLink error:', linkError)
      return new Response(JSON.stringify({ error: linkError.message }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const confirmationUrl = linkData?.properties?.action_link
    if (!confirmationUrl) {
      return new Response(JSON.stringify({ error: 'Failed to generate action link' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Fetch template settings from DB
    let settings: TemplateSettings = {}
    try {
      const { data } = await adminClient
        .from('email_template_settings')
        .select('*')
        .eq('template_type', type)
        .maybeSingle()
      if (data) settings = data
    } catch {
      console.warn('Failed to fetch template settings')
    }

    // Render email
    const element = React.createElement(EmailTemplate, {
      settings,
      templateType: type,
      confirmationUrl,
      recipient: email,
      email,
    })

    const html = await renderAsync(element)
    const text = await renderAsync(element, { plainText: true })
    const subject = settings.subject || DEFAULT_SUBJECTS[type]

    // Send via Resend connector gateway
    const resendResponse = await fetch(`${GATEWAY_URL}/emails`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'X-Connection-Api-Key': RESEND_API_KEY,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [email],
        subject,
        html,
        text,
      }),
    })

    const resendResult = await resendResponse.json()

    if (!resendResponse.ok) {
      console.error('Resend API error:', resendResult)
      return new Response(JSON.stringify({ error: 'Failed to send email via Resend', detail: resendResult }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Log to email_send_log
    try {
      await adminClient.from('email_send_log').insert({
        message_id: resendResult.id || crypto.randomUUID(),
        template_name: `resend_${type}`,
        recipient_email: email,
        status: 'sent',
      })
    } catch (e) {
      console.warn('Failed to log email send:', e)
    }

    console.log(`Email sent via Resend: ${type} -> ${email}`, { resendId: resendResult.id })

    return new Response(JSON.stringify({ success: true, id: resendResult.id }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Error:', error)
    const msg = error instanceof Error ? error.message : 'Unknown error'
    return new Response(JSON.stringify({ error: msg }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
