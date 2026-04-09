const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const GATEWAY_URL = 'https://connector-gateway.lovable.dev/resend'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY')
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY is not configured')

    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
    if (!RESEND_API_KEY) throw new Error('RESEND_API_KEY is not configured')

    const { type, name, email, products } = await req.json()

    if (!email || !type) {
      return new Response(JSON.stringify({ error: 'Missing required fields: email, type' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const displayName = name || 'คุณลูกค้า'
    let subject: string
    let html: string

    if (type === 'contact') {
      subject = '✅ ได้รับข้อความของคุณแล้ว — ENT Group'
      html = `
<!DOCTYPE html>
<html lang="th">
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background-color:#ffffff;font-family:'IBM Plex Sans Thai',Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 24px;">
    <div style="text-align:center;margin-bottom:32px;">
      <h1 style="color:#0f9d7a;font-size:24px;margin:0;">ENT GROUP</h1>
      <p style="color:#666;font-size:13px;margin:4px 0 0;">Industrial Computing Solutions</p>
    </div>
    <h2 style="color:#1a1a2e;font-size:20px;margin-bottom:16px;">สวัสดีครับ คุณ${displayName}</h2>
    <p style="color:#55575d;font-size:15px;line-height:1.7;">
      ขอบคุณที่ติดต่อมา ทีมงาน ENT Group ได้รับข้อความของคุณเรียบร้อยแล้ว
    </p>
    <div style="background:#f0fdf9;border-left:4px solid #0f9d7a;padding:16px 20px;margin:24px 0;border-radius:0 8px 8px 0;">
      <p style="color:#1a1a2e;font-size:14px;margin:0;font-weight:600;">⏰ เราจะติดต่อกลับภายใน 24 ชั่วโมง</p>
    </div>
    <p style="color:#55575d;font-size:14px;line-height:1.6;">
      หากต้องการติดต่อด่วน สามารถโทรหาเราได้ที่<br>
      📞 <a href="tel:021006388" style="color:#0f9d7a;text-decoration:none;font-weight:600;">02-100-6388</a><br>
      💬 LINE: <a href="https://lin.ee/entgroup" style="color:#0f9d7a;text-decoration:none;font-weight:600;">@entgroup</a>
    </p>
    <hr style="border:none;border-top:1px solid #eee;margin:32px 0;">
    <p style="color:#999;font-size:12px;text-align:center;">
      บริษัท อีเอ็นที กรุ๊ป จำกัด | 70/5 หมู่ 4 เมทโทร บิซทาวน์ แจ้งวัฒนะ 2 ปากเกร็ด นนทบุรี 11120
    </p>
  </div>
</body>
</html>`
    } else if (type === 'quote') {
      const productList = Array.isArray(products) && products.length > 0
        ? products.map((p: any) => `• ${p.category || ''} ${p.model || ''} x${p.qty || 1}`).join('<br>')
        : '(ไม่ได้ระบุ)'

      subject = '✅ ได้รับคำขอใบเสนอราคาแล้ว — ENT Group'
      html = `
<!DOCTYPE html>
<html lang="th">
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background-color:#ffffff;font-family:'IBM Plex Sans Thai',Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 24px;">
    <div style="text-align:center;margin-bottom:32px;">
      <h1 style="color:#0f9d7a;font-size:24px;margin:0;">ENT GROUP</h1>
      <p style="color:#666;font-size:13px;margin:4px 0 0;">Industrial Computing Solutions</p>
    </div>
    <h2 style="color:#1a1a2e;font-size:20px;margin-bottom:16px;">สวัสดีครับ คุณ${displayName}</h2>
    <p style="color:#55575d;font-size:15px;line-height:1.7;">
      ขอบคุณสำหรับคำขอใบเสนอราคา ทีมฝ่ายขายได้รับข้อมูลเรียบร้อยแล้ว
    </p>
    <div style="background:#f0fdf9;border:1px solid #d1fae5;padding:20px;margin:24px 0;border-radius:8px;">
      <p style="color:#1a1a2e;font-size:14px;margin:0 0 12px;font-weight:600;">📦 สินค้าที่สอบถาม:</p>
      <p style="color:#55575d;font-size:14px;margin:0;line-height:1.8;">${productList}</p>
    </div>
    <div style="background:#f0fdf9;border-left:4px solid #0f9d7a;padding:16px 20px;margin:24px 0;border-radius:0 8px 8px 0;">
      <p style="color:#1a1a2e;font-size:14px;margin:0;font-weight:600;">⏰ ใบเสนอราคาจะจัดส่งภายใน 1-2 วันทำการ</p>
    </div>
    <p style="color:#55575d;font-size:14px;line-height:1.6;">
      หากต้องการติดต่อด่วน สามารถโทรหาเราได้ที่<br>
      📞 <a href="tel:021006388" style="color:#0f9d7a;text-decoration:none;font-weight:600;">02-100-6388</a><br>
      💬 LINE: <a href="https://lin.ee/entgroup" style="color:#0f9d7a;text-decoration:none;font-weight:600;">@entgroup</a>
    </p>
    <hr style="border:none;border-top:1px solid #eee;margin:32px 0;">
    <p style="color:#999;font-size:12px;text-align:center;">
      บริษัท อีเอ็นที กรุ๊ป จำกัด | 70/5 หมู่ 4 เมทโทร บิซทาวน์ แจ้งวัฒนะ 2 ปากเกร็ด นนทบุรี 11120
    </p>
  </div>
</body>
</html>`
    } else {
      return new Response(JSON.stringify({ error: 'Invalid type. Use "contact" or "quote"' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const response = await fetch(`${GATEWAY_URL}/emails`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'X-Connection-Api-Key': RESEND_API_KEY,
      },
      body: JSON.stringify({
        from: 'ENT Group <noreply@entgroup.co.th>',
        to: [email],
        subject,
        html,
      }),
    })

    const data = await response.json()
    if (!response.ok) {
      console.error('Resend API error:', data)
      // Don't fail the whole flow — email is best-effort
      return new Response(JSON.stringify({ success: false, error: data }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error: unknown) {
    console.error('Error sending email:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return new Response(JSON.stringify({ success: false, error: errorMessage }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
