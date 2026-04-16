import * as React from 'npm:react@18.3.1'
import { renderAsync } from 'npm:@react-email/components@0.0.22'
import { parseEmailWebhookPayload } from 'npm:@lovable.dev/email-js'
import { WebhookError, verifyWebhookRequest } from 'npm:@lovable.dev/webhooks-js'
import { createClient } from 'npm:@supabase/supabase-js@2'
import {
  Body, Button, Container, Head, Heading, Html, Hr, Img, Link, Preview, Section, Text,
} from 'npm:@react-email/components@0.0.22'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, x-lovable-signature, x-lovable-timestamp, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

// Configuration
const DEFAULT_SITE_NAME = "ENT Group"
const SENDER_DOMAIN = "notify.www.entgroup.co.th"
const ROOT_DOMAIN = "www.entgroup.co.th"
const FROM_DOMAIN = "notify.www.entgroup.co.th"
const DEFAULT_PRIMARY = '#0fa888'
const DEFAULT_FONT = "'IBM Plex Sans Thai', Arial, sans-serif"

// Default subjects (fallback when DB has no data)
const DEFAULT_SUBJECTS: Record<string, string> = {
  signup: 'ยืนยันอีเมลของคุณ',
  invite: 'คุณได้รับเชิญเข้าร่วม',
  magiclink: 'ลิงก์เข้าสู่ระบบ',
  recovery: 'รีเซ็ตรหัสผ่าน',
  email_change: 'ยืนยันการเปลี่ยนอีเมล',
  reauthentication: 'รหัสยืนยันตัวตน',
}

// Sample data for preview mode
const SAMPLE_PROJECT_URL = "https://ent-vision-v2.lovable.app"
const SAMPLE_EMAIL = "user@example.test"
const SAMPLE_DATA: Record<string, object> = {
  signup: { confirmationUrl: SAMPLE_PROJECT_URL, recipient: SAMPLE_EMAIL },
  magiclink: { confirmationUrl: SAMPLE_PROJECT_URL },
  recovery: { confirmationUrl: SAMPLE_PROJECT_URL },
  invite: { confirmationUrl: SAMPLE_PROJECT_URL },
  email_change: { email: SAMPLE_EMAIL, newEmail: SAMPLE_EMAIL, confirmationUrl: SAMPLE_PROJECT_URL },
  reauthentication: { token: '123456' },
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
  is_active?: boolean
}

// Dynamic email template that reads from DB settings
function DynamicEmail({ settings, templateType, confirmationUrl, recipient, email, newEmail, token }: {
  settings: TemplateSettings
  templateType: string
  confirmationUrl?: string
  recipient?: string
  email?: string
  newEmail?: string
  token?: string
}) {
  const primary = settings.primary_color || DEFAULT_PRIMARY
  const siteName = settings.site_name || DEFAULT_SITE_NAME
  const fontFamily = settings.font_family || DEFAULT_FONT
  const isOTP = templateType === 'reauthentication'

  // Build body text with dynamic replacements
  let bodyText = settings.body_text || ''
  if (templateType === 'signup' && recipient) {
    bodyText = bodyText || `ขอบคุณที่สมัครสมาชิก ${siteName} กรุณายืนยันอีเมลของคุณ (${recipient}) โดยคลิกปุ่มด้านล่าง:`
  }
  if (templateType === 'email_change' && email && newEmail) {
    bodyText = bodyText || `คุณขอเปลี่ยนอีเมลจาก ${email} เป็น ${newEmail} คลิกปุ่มด้านล่างเพื่อยืนยัน:`
  }

  const main = { backgroundColor: '#ffffff', fontFamily }
  const container = { padding: '20px 30px', maxWidth: '580px', margin: '0 auto' }
  const header = { textAlign: 'center' as const, padding: '20px 0 10px' }
  const logo = { fontSize: '20px', fontWeight: '700' as const, color: primary, margin: '0' }
  const h1Style = { fontSize: '20px', fontWeight: '600' as const, color: '#1a1a2e', margin: '20px 0 10px' }
  const textStyle = { fontSize: '14px', color: '#374151', lineHeight: '1.6', margin: '0 0 16px' }
  const buttonSection = { textAlign: 'center' as const, margin: '24px 0' }
  const buttonStyle = {
    backgroundColor: primary, color: '#ffffff', fontSize: '14px',
    borderRadius: '8px', padding: '12px 28px', textDecoration: 'none', fontWeight: '600' as const,
  }
  const codeStyle = {
    fontFamily: 'Courier, monospace', fontSize: '28px', fontWeight: 'bold' as const,
    color: primary, margin: '0 0 24px', textAlign: 'center' as const, letterSpacing: '4px',
  }
  const hrStyle = { borderColor: '#e5e7eb', margin: '24px 0' }
  const footer = { fontSize: '12px', color: '#9ca3af', margin: '0 0 8px' }
  const contactInfo = { fontSize: '12px', color: '#9ca3af', margin: '0 0 4px', textAlign: 'center' as const }
  const footerBrand = { fontSize: '12px', color: '#9ca3af', margin: '0', textAlign: 'center' as const }

  return React.createElement(Html, { lang: 'th', dir: 'ltr' },
    React.createElement(Head, null),
    React.createElement(Preview, null, settings.heading || settings.subject || ''),
    React.createElement(Body, { style: main },
      React.createElement(Container, { style: container },
        React.createElement(Section, { style: header },
          settings.logo_url
            ? React.createElement(Img, { src: settings.logo_url, alt: siteName, style: { maxHeight: '40px', margin: '0 auto 8px' } })
            : null,
          React.createElement(Heading, { style: logo }, siteName),
        ),
        React.createElement(Heading, { style: h1Style }, settings.heading || ''),
        React.createElement(Text, { style: textStyle }, bodyText),
        isOTP
          ? React.createElement(Text, { style: codeStyle }, token || '------')
          : settings.button_text && confirmationUrl
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

// Fetch template settings from DB
async function getTemplateSettings(supabase: any, templateType: string): Promise<TemplateSettings> {
  try {
    const { data } = await supabase
      .from('email_template_settings')
      .select('*')
      .eq('template_type', templateType)
      .maybeSingle()
    return data || {}
  } catch {
    console.warn('Failed to fetch template settings, using defaults')
    return {}
  }
}

// Preview endpoint handler
async function handlePreview(req: Request): Promise<Response> {
  const previewCorsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, content-type',
  }

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: previewCorsHeaders })
  }

  const apiKey = Deno.env.get('LOVABLE_API_KEY')
  const authHeader = req.headers.get('Authorization')

  if (!apiKey || authHeader !== `Bearer ${apiKey}`) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { ...previewCorsHeaders, 'Content-Type': 'application/json' },
    })
  }

  let type: string
  try {
    const body = await req.json()
    type = body.type
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON in request body' }), {
      status: 400,
      headers: { ...previewCorsHeaders, 'Content-Type': 'application/json' },
    })
  }

  if (!DEFAULT_SUBJECTS[type]) {
    return new Response(JSON.stringify({ error: `Unknown email type: ${type}` }), {
      status: 400,
      headers: { ...previewCorsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )
  const settings = await getTemplateSettings(supabase, type)
  const sampleData = SAMPLE_DATA[type] || {}

  const element = React.createElement(DynamicEmail, {
    settings,
    templateType: type,
    ...sampleData,
  } as any)

  const html = await renderAsync(element)

  return new Response(html, {
    status: 200,
    headers: { ...previewCorsHeaders, 'Content-Type': 'text/html; charset=utf-8' },
  })
}

// Webhook handler
async function handleWebhook(req: Request): Promise<Response> {
  const apiKey = Deno.env.get('LOVABLE_API_KEY')

  if (!apiKey) {
    console.error('LOVABLE_API_KEY not configured')
    return new Response(
      JSON.stringify({ error: 'Server configuration error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  let payload: any
  let run_id = ''
  try {
    const verified = await verifyWebhookRequest({
      req,
      secret: apiKey,
      parser: parseEmailWebhookPayload,
    })
    payload = verified.payload
    run_id = payload.run_id
  } catch (error) {
    if (error instanceof WebhookError) {
      switch (error.code) {
        case 'invalid_signature':
        case 'missing_timestamp':
        case 'invalid_timestamp':
        case 'stale_timestamp':
          console.error('Invalid webhook signature', { error: error.message })
          return new Response(JSON.stringify({ error: 'Invalid signature' }), {
            status: 401,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          })
        case 'invalid_payload':
        case 'invalid_json':
          console.error('Invalid webhook payload', { error: error.message })
          return new Response(
            JSON.stringify({ error: 'Invalid webhook payload' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
      }
    }

    console.error('Webhook verification failed', { error })
    return new Response(
      JSON.stringify({ error: 'Invalid webhook payload' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  if (!run_id) {
    console.error('Webhook payload missing run_id')
    return new Response(
      JSON.stringify({ error: 'Invalid webhook payload' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  if (payload.version !== '1') {
    console.error('Unsupported payload version', { version: payload.version, run_id })
    return new Response(
      JSON.stringify({ error: `Unsupported payload version: ${payload.version}` }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  const emailType = payload.data.action_type
  console.log('Received auth event', { emailType, email: payload.data.email, run_id })

  if (!DEFAULT_SUBJECTS[emailType]) {
    console.error('Unknown email type', { emailType, run_id })
    return new Response(
      JSON.stringify({ error: `Unknown email type: ${emailType}` }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  // Create supabase client and fetch template settings from DB
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const settings = await getTemplateSettings(supabase, emailType)
  const siteName = settings.site_name || DEFAULT_SITE_NAME

  // Build dynamic email element
  const element = React.createElement(DynamicEmail, {
    settings,
    templateType: emailType,
    confirmationUrl: payload.data.url,
    recipient: payload.data.email,
    email: payload.data.email,
    newEmail: payload.data.new_email,
    token: payload.data.token,
  })

  // Render to HTML and plain text
  const html = await renderAsync(element)
  const text = await renderAsync(element, { plainText: true })

  const messageId = crypto.randomUUID()

  await supabase.from('email_send_log').insert({
    message_id: messageId,
    template_name: emailType,
    recipient_email: payload.data.email,
    status: 'pending',
  })

  const emailSubject = settings.subject || DEFAULT_SUBJECTS[emailType] || 'Notification'

  const { error: enqueueError } = await supabase.rpc('enqueue_email', {
    queue_name: 'auth_emails',
    payload: {
      run_id,
      message_id: messageId,
      to: payload.data.email,
      from: `${siteName} <noreply@${FROM_DOMAIN}>`,
      sender_domain: SENDER_DOMAIN,
      subject: emailSubject,
      html,
      text,
      purpose: 'transactional',
      label: emailType,
      queued_at: new Date().toISOString(),
    },
  })

  if (enqueueError) {
    console.error('Failed to enqueue auth email', { error: enqueueError, run_id, emailType })
    await supabase.from('email_send_log').insert({
      message_id: messageId,
      template_name: emailType,
      recipient_email: payload.data.email,
      status: 'failed',
      error_message: 'Failed to enqueue email',
    })
    return new Response(JSON.stringify({ error: 'Failed to enqueue email' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  console.log('Auth email enqueued', { emailType, email: payload.data.email, run_id })

  return new Response(
    JSON.stringify({ success: true, queued: true }),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

Deno.serve(async (req) => {
  const url = new URL(req.url)

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  if (url.pathname.endsWith('/preview')) {
    return handlePreview(req)
  }

  try {
    return await handleWebhook(req)
  } catch (error) {
    console.error('Webhook handler error:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
