const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const GATEWAY_URL = 'https://connector-gateway.lovable.dev/resend'
const FROM_EMAIL = 'ENT Group <noreply@entgroup.co.th>'
const CC_SALES = 'sales@entgroup.co.th'
const SITE_URL = 'https://www.entgroup.co.th'

// ─── Email Templates ───
interface TemplateData {
  customerName: string
  quoteNumber: string
  grandTotal: number
  products: string
  saleName: string
  saleEmail: string
  poNumber?: string
  poFileName?: string
  rejectReason?: string
  counterValue?: string
  negotiationSubject?: string
}

const fp = (n: number) => new Intl.NumberFormat('th-TH').format(Math.round(n))

const baseHeader = `
<div style="text-align:center;margin-bottom:32px;">
  <h1 style="color:#0f9d7a;font-size:24px;margin:0;">ENT GROUP</h1>
  <p style="color:#666;font-size:13px;margin:4px 0 0;">Industrial Computing Solutions</p>
</div>`

const baseFooter = `
<hr style="border:none;border-top:1px solid #eee;margin:32px 0;">
<p style="color:#55575d;font-size:13px;line-height:1.6;">
  หากมีข้อสงสัย สามารถติดต่อได้ที่<br>
  📞 <a href="tel:020456104" style="color:#0f9d7a;text-decoration:none;font-weight:600;">02-045-6104</a>
  &nbsp;|&nbsp; 💬 LINE: <a href="https://lin.ee/entgroup" style="color:#0f9d7a;text-decoration:none;font-weight:600;">@entgroup</a>
  &nbsp;|&nbsp; 🌐 <a href="${SITE_URL}" style="color:#0f9d7a;text-decoration:none;">www.entgroup.co.th</a>
</p>
<p style="color:#999;font-size:11px;text-align:center;margin-top:20px;">
  บริษัท อี.เอ็น.ที. กรุ๊ป จำกัด | อีเมลนี้ส่งอัตโนมัติจากระบบ ENT Vision
</p>`

const wrap = (content: string) => `<!DOCTYPE html>
<html lang="th"><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background-color:#f8f9fa;font-family:'IBM Plex Sans Thai',Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 24px;background:#ffffff;">
    ${baseHeader}${content}${baseFooter}
  </div>
</body></html>`

const highlight = (text: string) =>
  `<div style="background:#f0fdf9;border-left:4px solid #0f9d7a;padding:16px 20px;margin:24px 0;border-radius:0 8px 8px 0;">
    <p style="color:#1a1a2e;font-size:14px;margin:0;font-weight:600;">${text}</p>
  </div>`

const infoBox = (title: string, items: string[]) =>
  `<div style="background:#f8fafc;border:1px solid #e2e8f0;padding:20px;margin:24px 0;border-radius:8px;">
    <p style="color:#1a1a2e;font-size:14px;margin:0 0 12px;font-weight:600;">${title}</p>
    ${items.map(i => `<p style="color:#55575d;font-size:13px;margin:4px 0;line-height:1.6;">${i}</p>`).join('')}
  </div>`

const ctaButton = (text: string, url: string) =>
  `<div style="text-align:center;margin:28px 0;">
    <a href="${url}" style="display:inline-block;background:#0f9d7a;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:8px;font-size:14px;font-weight:600;">${text}</a>
  </div>`

// ─── Template per event type ───
type EventType = 'new' | 'quoted' | 'negotiation_customer' | 'negotiation_admin_reply' | 'won' | 'po_uploaded' | 'po_approved' | 'po_rejected' | 'lost'

interface EmailSet {
  customer?: { subject: string; html: string }
  sale?: { subject: string; html: string }
}

function buildEmails(event: EventType, d: TemplateData): EmailSet {
  const greeting = `<h2 style="color:#1a1a2e;font-size:20px;margin-bottom:16px;">สวัสดีครับ คุณ${d.customerName}</h2>`
  const saleGreeting = `<h2 style="color:#1a1a2e;font-size:20px;margin-bottom:16px;">สวัสดีครับ คุณ${d.saleName}</h2>`

  switch (event) {
    // ─── 1. ลูกค้าส่งใบเสนอราคาใหม่ ───
    case 'new':
      return {
        customer: {
          subject: `✅ ได้รับคำขอใบเสนอราคา ${d.quoteNumber} — ENT Group`,
          html: wrap(`${greeting}
            <p style="color:#55575d;font-size:15px;line-height:1.7;">ขอบคุณสำหรับคำขอใบเสนอราคา ทีมฝ่ายขายได้รับข้อมูลเรียบร้อยแล้ว</p>
            ${infoBox('📦 สินค้าที่สอบถาม:', [d.products])}
            ${highlight('⏰ ทีมขายจะตรวจสอบและส่งใบเสนอราคาภายใน 1-2 วันทำการ')}
            <p style="color:#55575d;font-size:13px;">ผู้ดูแลของท่าน: <strong>${d.saleName}</strong> (${d.saleEmail})</p>
            ${ctaButton('ดูสถานะใบเสนอราคา', `${SITE_URL}/my-account?tab=quotes`)}`)
        },
        sale: {
          subject: `🆕 คำขอใบเสนอราคาใหม่ ${d.quoteNumber} — ${d.customerName}`,
          html: wrap(`${saleGreeting}
            <p style="color:#55575d;font-size:15px;line-height:1.7;">มีคำขอใบเสนอราคาใหม่เข้ามาและถูกมอบหมายให้คุณ</p>
            ${infoBox('📋 รายละเอียด:', [
              `ลูกค้า: <strong>${d.customerName}</strong>`,
              `เลขที่: <strong>${d.quoteNumber}</strong>`,
              `สินค้า: ${d.products}`,
            ])}
            ${highlight('⚡ กรุณาตรวจสอบและส่งราคาภายใน 24 ชม.')}
            ${ctaButton('ไปจัดการ Quote', `${SITE_URL}/admin?tab=quote_review`)}`)
        },
      }

    // ─── 2. Admin ส่งราคาแล้ว ───
    case 'quoted':
      return {
        customer: {
          subject: `💰 ใบเสนอราคา ${d.quoteNumber} พร้อมแล้ว — ENT Group`,
          html: wrap(`${greeting}
            <p style="color:#55575d;font-size:15px;line-height:1.7;">ใบเสนอราคาของท่านได้รับการตรวจสอบและจัดส่งเรียบร้อยแล้ว</p>
            ${infoBox('📄 สรุปใบเสนอราคา:', [
              `เลขที่: <strong>${d.quoteNumber}</strong>`,
              `สินค้า: ${d.products}`,
              `ยอดรวม: <strong style="color:#0f9d7a;font-size:18px;">฿${fp(d.grandTotal)}</strong>`,
            ])}
            <p style="color:#55575d;font-size:13px;">ท่านสามารถดูรายละเอียด ต่อรองราคา หรือยอมรับใบเสนอราคาได้ผ่านระบบ</p>
            ${ctaButton('ดูใบเสนอราคา', `${SITE_URL}/my-account?tab=quotes`)}`)
        },
      }

    // ─── 3. ลูกค้าขอต่อรอง ───
    case 'negotiation_customer':
      return {
        sale: {
          subject: `🔔 ลูกค้าขอต่อรอง ${d.quoteNumber} — ${d.negotiationSubject || ''}`,
          html: wrap(`${saleGreeting}
            <p style="color:#55575d;font-size:15px;line-height:1.7;">ลูกค้า <strong>${d.customerName}</strong> ส่งคำขอต่อรองสำหรับใบเสนอราคา ${d.quoteNumber}</p>
            ${infoBox('💬 รายละเอียดการต่อรอง:', [
              `เรื่อง: <strong>${d.negotiationSubject || '-'}</strong>`,
              d.counterValue ? `ข้อเสนอ: <strong>${d.counterValue}</strong>` : '',
            ].filter(Boolean))}
            ${highlight('⏰ กรุณาตอบกลับภายใน 24 ชม. (SLA)')}
            ${ctaButton('ไปตอบกลับ', `${SITE_URL}/admin?tab=quote_review`)}`)
        },
      }

    // ─── 4. Admin ตอบกลับการต่อรอง ───
    case 'negotiation_admin_reply':
      return {
        customer: {
          subject: `💬 Admin ตอบกลับการต่อรอง ${d.quoteNumber} — ENT Group`,
          html: wrap(`${greeting}
            <p style="color:#55575d;font-size:15px;line-height:1.7;">ทีมขายได้ตอบกลับคำขอต่อรองของท่านสำหรับใบเสนอราคา ${d.quoteNumber}</p>
            ${d.counterValue ? infoBox('📝 ข้อเสนอใหม่:', [`${d.counterValue}`]) : ''}
            <p style="color:#55575d;font-size:13px;">ท่านสามารถยอมรับข้อเสนอ หรือเจรจาต่อได้ผ่านระบบ</p>
            ${ctaButton('ดูรายละเอียด', `${SITE_URL}/my-account?tab=quotes`)}`)
        },
      }

    // ─── 5. ตกลงราคา (won) ───
    case 'won':
      return {
        customer: {
          subject: `🎉 ตกลงราคาสำเร็จ ${d.quoteNumber} — กรุณาส่ง PO`,
          html: wrap(`${greeting}
            <p style="color:#55575d;font-size:15px;line-height:1.7;">ยินดีด้วยครับ! ใบเสนอราคา ${d.quoteNumber} ได้ตกลงราคาเรียบร้อยแล้ว</p>
            ${infoBox('✅ สรุปการสั่งซื้อ:', [
              `เลขที่: <strong>${d.quoteNumber}</strong>`,
              `ยอดรวม: <strong style="color:#0f9d7a;font-size:18px;">฿${fp(d.grandTotal)}</strong>`,
            ])}
            ${highlight('📎 ขั้นตอนถัดไป: กรุณาอัปโหลดใบสั่งซื้อ (PO) เพื่อยืนยันการสั่งซื้อ')}
            ${ctaButton('อัปโหลด PO', `${SITE_URL}/my-account?tab=quotes`)}`)
        },
      }

    // ─── 6. ลูกค้าส่ง PO ───
    case 'po_uploaded':
      return {
        customer: {
          subject: `📎 ได้รับ PO เรียบร้อย ${d.quoteNumber} — ENT Group`,
          html: wrap(`${greeting}
            <p style="color:#55575d;font-size:15px;line-height:1.7;">ขอบคุณครับ! เราได้รับใบสั่งซื้อ (PO) ของท่านเรียบร้อยแล้ว</p>
            ${infoBox('📄 ข้อมูล PO:', [
              `เลข PO: <strong>${d.poNumber || '-'}</strong>`,
              `ไฟล์: ${d.poFileName || '-'}`,
              `ใบเสนอราคา: <strong>${d.quoteNumber}</strong>`,
            ])}
            ${highlight('⏰ ทีมขายจะตรวจสอบและยืนยัน PO ภายใน 1 วันทำการ')}
            <p style="color:#55575d;font-size:13px;">ผู้ดูแลของท่าน: <strong>${d.saleName}</strong> (${d.saleEmail})</p>`)
        },
        sale: {
          subject: `📎 ลูกค้าส่ง PO — ${d.quoteNumber} (${d.customerName})`,
          html: wrap(`${saleGreeting}
            <p style="color:#55575d;font-size:15px;line-height:1.7;">ลูกค้า <strong>${d.customerName}</strong> ส่งใบสั่งซื้อ (PO) สำหรับ ${d.quoteNumber}</p>
            ${infoBox('📄 ข้อมูล PO:', [
              `เลข PO: <strong>${d.poNumber || '-'}</strong>`,
              `ไฟล์: ${d.poFileName || '-'}`,
              `มูลค่า: <strong style="color:#0f9d7a;">฿${fp(d.grandTotal)}</strong>`,
            ])}
            ${highlight('⚡ กรุณาตรวจสอบและอนุมัติ PO โดยเร็ว')}
            ${ctaButton('ไปตรวจสอบ PO', `${SITE_URL}/admin?tab=quote_review`)}`)
        },
      }

    // ─── 7. Admin อนุมัติ PO ───
    case 'po_approved':
      return {
        customer: {
          subject: `✅ PO ได้รับการยืนยัน ${d.quoteNumber} — ENT Group`,
          html: wrap(`${greeting}
            <p style="color:#55575d;font-size:15px;line-height:1.7;">ใบสั่งซื้อ (PO) ของท่านได้รับการยืนยันเรียบร้อยแล้ว</p>
            ${infoBox('🎉 ยืนยันการสั่งซื้อ:', [
              `เลขที่: <strong>${d.quoteNumber}</strong>`,
              `เลข PO: <strong>${d.poNumber || '-'}</strong>`,
              `มูลค่า: <strong style="color:#0f9d7a;font-size:18px;">฿${fp(d.grandTotal)}</strong>`,
            ])}
            ${highlight('📦 ทีมงานจะเริ่มดำเนินการจัดเตรียมสินค้าและแจ้งกำหนดจัดส่งให้ท่านทราบ')}
            <p style="color:#55575d;font-size:13px;">ผู้ดูแลของท่าน: <strong>${d.saleName}</strong> (${d.saleEmail})</p>`)
        },
      }

    // ─── 8. Admin ปฏิเสธ PO ───
    case 'po_rejected':
      return {
        customer: {
          subject: `⚠️ PO ต้องแก้ไข ${d.quoteNumber} — ENT Group`,
          html: wrap(`${greeting}
            <p style="color:#55575d;font-size:15px;line-height:1.7;">ใบสั่งซื้อ (PO) ของท่านต้องแก้ไขก่อนดำเนินการต่อ</p>
            ${d.rejectReason ? infoBox('📝 เหตุผล:', [d.rejectReason]) : ''}
            ${highlight('📎 กรุณาแก้ไขและอัปโหลด PO ใหม่ผ่านระบบ')}
            ${ctaButton('อัปโหลด PO ใหม่', `${SITE_URL}/my-account?tab=quotes`)}`)
        },
      }

    // ─── 9. ยกเลิก ───
    case 'lost':
      return {
        customer: {
          subject: `📋 ใบเสนอราคา ${d.quoteNumber} ถูกยกเลิก — ENT Group`,
          html: wrap(`${greeting}
            <p style="color:#55575d;font-size:15px;line-height:1.7;">ใบเสนอราคา ${d.quoteNumber} ถูกยกเลิกแล้ว</p>
            <p style="color:#55575d;font-size:14px;line-height:1.6;">
              หากท่านต้องการสอบถามเพิ่มเติมหรือสร้างใบเสนอราคาใหม่ สามารถทำได้ตลอดเวลาผ่านระบบ
            </p>
            ${ctaButton('สร้างใบเสนอราคาใหม่', `${SITE_URL}/my-account?tab=create-quote`)}`)
        },
      }

    default:
      return {}
  }
}

// ─── Main Handler ───
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY')
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY is not configured')
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
    if (!RESEND_API_KEY) throw new Error('RESEND_API_KEY is not configured')

    const {
      event,           // EventType
      quoteId,         // UUID
      customerEmail,   // string
      customerName,    // string
      quoteNumber,     // string
      grandTotal,      // number
      products,        // string (summary)
      saleEmail,       // string
      saleName,        // string
      poNumber,        // string?
      poFileName,      // string?
      rejectReason,    // string?
      counterValue,    // string?
      negotiationSubject, // string?
    } = await req.json()

    if (!event || !customerEmail) {
      return new Response(JSON.stringify({ error: 'Missing: event, customerEmail' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const templateData: TemplateData = {
      customerName: customerName || 'ลูกค้า',
      quoteNumber: quoteNumber || '-',
      grandTotal: grandTotal || 0,
      products: products || '-',
      saleName: saleName || 'ทีมขาย ENT Group',
      saleEmail: saleEmail || CC_SALES,
      poNumber, poFileName, rejectReason, counterValue, negotiationSubject,
    }

    const emails = buildEmails(event as EventType, templateData)
    const results: any[] = []

    // Send customer email
    if (emails.customer && customerEmail) {
      const res = await fetch(`${GATEWAY_URL}/emails`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'X-Connection-Api-Key': RESEND_API_KEY,
        },
        body: JSON.stringify({
          from: FROM_EMAIL,
          to: [customerEmail],
          cc: [CC_SALES],
          subject: emails.customer.subject,
          html: emails.customer.html,
        }),
      })
      const data = await res.json()
      results.push({ to: 'customer', ok: res.ok, data })
    }

    // Send sale email
    if (emails.sale && saleEmail) {
      const res = await fetch(`${GATEWAY_URL}/emails`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'X-Connection-Api-Key': RESEND_API_KEY,
        },
        body: JSON.stringify({
          from: FROM_EMAIL,
          to: [saleEmail],
          cc: [CC_SALES],
          subject: emails.sale.subject,
          html: emails.sale.html,
        }),
      })
      const data = await res.json()
      results.push({ to: 'sale', ok: res.ok, data })
    }

    console.log(`[notify-quote-status] event=${event} quote=${quoteNumber} results=`, results)

    return new Response(JSON.stringify({ success: true, results }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error: unknown) {
    console.error('Error in notify-quote-status:', error)
    const msg = error instanceof Error ? error.message : 'Unknown error'
    return new Response(JSON.stringify({ success: false, error: msg }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
