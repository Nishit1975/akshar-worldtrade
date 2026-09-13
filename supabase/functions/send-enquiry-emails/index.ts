/// <reference path="../deno.d.ts" />
import { createClient } from 'npm:@supabase/supabase-js@2'
import nodemailer from 'npm:nodemailer@6.9.16'

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface EnquiryPayload {
  enquiryId?: string
  enquiry?: {
    id?: string
    name?: string
    company_name?: string
    country?: string
    email?: string
    phone?: string
    product?: string
    quantity?: string
    message?: string
    created_at?: string
  }
}

// Helper to escape HTML characters
function escapeHtml(text: string | null | undefined): string {
  if (!text) return ''
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

// Helper to sanitize phone for WhatsApp
function sanitizeWhatsApp(phone: string | null | undefined): string | null {
  if (!phone) return null
  const cleaned = phone.replace(/[^0-9+]/g, '').replace(/^00/, '+')
  const digits = cleaned.replace(/\+/g, '')
  if (digits.length < 7) return null
  return `https://wa.me/${digits}`
}

Deno.serve(async (req: Request) => {
  // 1. Handle CORS Preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const body: EnquiryPayload = await req.json().catch(() => ({}))
    const { enquiryId, enquiry: fallbackEnquiry } = body

    if (!enquiryId && !fallbackEnquiry?.email) {
      return new Response(
        JSON.stringify({ error: 'Missing enquiryId or enquiry data' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 2. Fetch genuine enquiry data from Supabase if credentials are present
    const supabaseUrl = Deno.env.get('SUPABASE_URL')?.trim() || ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')?.trim() || ''

    let enquiryData = fallbackEnquiry || null

    if (supabaseUrl && supabaseServiceKey && enquiryId) {
      try {
        const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)
        const { data, error } = await supabaseAdmin
          .from('enquiries')
          .select('*')
          .eq('id', enquiryId)
          .maybeSingle()
        if (!error && data) {
          enquiryData = data
        }
      } catch (dbErr) {
        console.warn('Database query fallback warning:', dbErr)
      }
    }

    if (!enquiryData || !enquiryData.email || !enquiryData.name) {
      return new Response(
        JSON.stringify({ error: 'Valid enquiry details with buyer name and email required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const id = enquiryData.id || enquiryId || 'ENQ-' + Date.now()
    const buyerName = enquiryData.name.trim()
    const buyerEmail = enquiryData.email.trim()
    const company = enquiryData.company_name?.trim() || ''
    const country = enquiryData.country?.trim() || ''
    const phone = enquiryData.phone?.trim() || ''
    const product = enquiryData.product?.trim() || 'General Inquiry'
    const quantity = enquiryData.quantity?.trim() || ''
    const message = enquiryData.message?.trim() || 'No message provided'
    const enquiryDate = enquiryData.created_at
      ? new Date(enquiryData.created_at).toLocaleString('en-GB', {
          dateStyle: 'full',
          timeStyle: 'short',
        })
      : new Date().toLocaleString('en-GB', { dateStyle: 'full', timeStyle: 'short' })

    const adminRecipient = Deno.env.get('ADMIN_NOTIFICATION_EMAIL')?.trim() || 'aksharworldtrade@gmail.com'
    const gmailUser = Deno.env.get('GMAIL_USER')?.trim() || 'aksharworldtrade@gmail.com'
    const rawGmailPassword = Deno.env.get('GMAIL_APP_PASSWORD')?.trim() || Deno.env.get('SMTP_PASS')?.trim() || ''
    // Remove potential inner/outer quotes and spaces from Gmail App Password
    const gmailAppPassword = rawGmailPassword.replace(/\s+/g, '').replace(/^["']|["']$/g, '')
    const smtpHost = Deno.env.get('SMTP_HOST')?.trim() || 'smtp.gmail.com'
    const smtpPort = Number(Deno.env.get('SMTP_PORT')) || 465
    const resendApiKey = Deno.env.get('RESEND_API_KEY')?.trim() || ''
    const websiteUrl = Deno.env.get('WEBSITE_URL')?.trim() || 'https://akshar-worldtrade.com'
    const adminUrl = `${websiteUrl}/admin/enquiries`

    const waLink = sanitizeWhatsApp(phone)

    // Validate email configuration existence
    if (!gmailAppPassword && !resendApiKey) {
      console.warn(
        'Email secrets (GMAIL_APP_PASSWORD or RESEND_API_KEY) are not configured yet in Supabase Edge Function secrets.'
      )
      return new Response(
        JSON.stringify({
          success: false,
          warning: 'Email provider credentials not configured in Edge Function secrets.',
          enquiryId: id,
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // ── 3. EMAIL 1: ADMIN NOTIFICATION TEMPLATE ──────────────────
    const adminSubject = `New Buyer Enquiry — ${product} — ${buyerName}`
    
    const adminText = `A new buyer enquiry has been received through the Akshar Worldtrade website.

Enquiry ID: ${id}
Enquiry Date: ${enquiryDate}

Buyer Details
-------------------------
Name: ${buyerName}
${company ? `Company: ${company}\n` : ''}${country ? `Country: ${country}\n` : ''}Email: ${buyerEmail}
${phone ? `Phone / WhatsApp: ${phone}\n` : ''}
Product Requirement
-------------------------
Product: ${product}
${quantity ? `Quantity / Volume: ${quantity}\n` : ''}
Message:
${message}

Actions:
- Reply by Email: mailto:${buyerEmail}?subject=Re:%20Enquiry%20for%20${encodeURIComponent(product)}%20-%20Akshar%20Worldtrade
${waLink ? `- WhatsApp Buyer: ${waLink}\n` : ''}- Open Admin Panel: ${adminUrl}

Best regards,
Akshar Worldtrade
Import | Export | Global Trade`

    const adminHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Buyer Enquiry</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; margin: 0; padding: 0; background-color: #f8fafc; }
    .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0; }
    .header { background: #0f2744; color: #ffffff; padding: 24px; text-align: center; }
    .header h1 { margin: 0; font-size: 20px; font-weight: 700; letter-spacing: 0.5px; color: #ffffff; }
    .header p { margin: 6px 0 0 0; font-size: 13px; color: #d4af37; text-transform: uppercase; letter-spacing: 1px; }
    .content { padding: 24px; }
    .badge { display: inline-block; background: #e0f2fe; color: #0369a1; padding: 4px 10px; border-radius: 9999px; font-size: 12px; font-weight: 600; margin-bottom: 16px; }
    .section-title { font-size: 13px; font-weight: 700; color: #0f2744; text-transform: uppercase; letter-spacing: 0.5px; margin: 20px 0 10px 0; border-bottom: 2px solid #f1f5f9; padding-bottom: 6px; }
    .data-table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
    .data-table td { padding: 8px 0; font-size: 14px; vertical-align: top; }
    .data-table td.label { width: 35%; color: #64748b; font-weight: 500; }
    .data-table td.value { width: 65%; color: #0f2744; font-weight: 600; }
    .message-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 14px; font-size: 14px; color: #334155; white-space: pre-wrap; margin-top: 8px; }
    .button-group { margin-top: 24px; text-align: center; }
    .btn { display: inline-block; padding: 10px 18px; border-radius: 6px; font-size: 13px; font-weight: 600; text-decoration: none; margin: 4px 6px; }
    .btn-primary { background: #0f2744; color: #ffffff; }
    .btn-whatsapp { background: #16a34a; color: #ffffff; }
    .btn-outline { background: #ffffff; color: #0f2744; border: 1px solid #cbd5e1; }
    .footer { background: #f1f5f9; padding: 16px 24px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>AKSHAR WORLDTRADE</h1>
      <p>New Buyer Enquiry Notification</p>
    </div>
    <div class="content">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <span class="badge">New Lead Received</span>
        <span style="font-size: 12px; color: #64748b; font-family: monospace;">Ref: ${escapeHtml(id)}</span>
      </div>

      <p style="margin-top: 0; font-size: 14px; color: #475569;">
        A new buyer enquiry has been submitted through the Akshar Worldtrade website.
      </p>

      <div class="section-title">Buyer Contact Details</div>
      <table class="data-table">
        <tr><td class="label">Full Name:</td><td class="value">${escapeHtml(buyerName)}</td></tr>
        ${company ? `<tr><td class="label">Company:</td><td class="value">${escapeHtml(company)}</td></tr>` : ''}
        ${country ? `<tr><td class="label">Country:</td><td class="value">${escapeHtml(country)}</td></tr>` : ''}
        <tr><td class="label">Email Address:</td><td class="value"><a href="mailto:${escapeHtml(buyerEmail)}" style="color: #0f2744;">${escapeHtml(buyerEmail)}</a></td></tr>
        ${phone ? `<tr><td class="label">Phone / WhatsApp:</td><td class="value">${escapeHtml(phone)}</td></tr>` : ''}
      </table>

      <div class="section-title">Product Requirement</div>
      <table class="data-table">
        <tr><td class="label">Product:</td><td class="value">${escapeHtml(product)}</td></tr>
        ${quantity ? `<tr><td class="label">Quantity / Volume:</td><td class="value">${escapeHtml(quantity)}</td></tr>` : ''}
        <tr><td class="label">Submission Date:</td><td class="value">${escapeHtml(enquiryDate)}</td></tr>
      </table>

      <div class="section-title">Buyer Message</div>
      <div class="message-box">${escapeHtml(message)}</div>

      <div class="button-group">
        <a href="mailto:${escapeHtml(buyerEmail)}?subject=Re:%20Enquiry%20for%20${encodeURIComponent(product)}%20-%20Akshar%20Worldtrade" class="btn btn-primary">
          Reply by Email
        </a>
        ${waLink ? `
        <a href="${escapeHtml(waLink)}" class="btn btn-whatsapp" target="_blank">
          WhatsApp Buyer
        </a>` : ''}
        <a href="${escapeHtml(adminUrl)}" class="btn btn-outline" target="_blank">
          Open Admin Panel
        </a>
      </div>
    </div>
    <div class="footer">
      <strong>Akshar Worldtrade</strong> • Import | Export | Global Trade<br>
      Connecting India with the World
    </div>
  </div>
</body>
</html>`

    // ── 4. EMAIL 2: BUYER AUTO-ACKNOWLEDGEMENT TEMPLATE ─────────
    const buyerSubject = `Enquiry Received — Akshar Worldtrade`

    // Construct plain text details block
    const buyerDetailsText = [
      `Product: ${product}`,
      quantity ? `Quantity / Volume: ${quantity}` : null,
      country ? `Country: ${country}` : null,
      company ? `Company: ${company}` : null,
    ].filter(Boolean).join('\n')

    const buyerText = `Dear ${buyerName},

Thank you for contacting Akshar Worldtrade and for your interest in our products.

We have successfully received your enquiry regarding ${product}.

Our trade team is reviewing your requirements and will get back to you within 24 hours with the relevant product details, pricing, availability, packaging options, and quotation.

Your enquiry details:

${buyerDetailsText}

We appreciate your interest in doing business with Akshar Worldtrade and look forward to working with you.

Best regards,

Akshar Worldtrade
Import | Export | Global Trade
Connecting India with the World

aksharworldtrade@gmail.com`

    const buyerHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Enquiry Received — Akshar Worldtrade</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; margin: 0; padding: 0; background-color: #f8fafc; }
    .wrapper { width: 100%; background-color: #f8fafc; padding: 24px 0; }
    .container { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 6px; overflow: hidden; border: 1px solid #e2e8f0; }
    .header { background: #0f2744; color: #ffffff; padding: 24px 28px; text-align: left; }
    .header h1 { margin: 0; font-size: 20px; font-weight: 700; color: #ffffff; letter-spacing: 0.5px; }
    .header p { margin: 4px 0 0 0; font-size: 12px; color: #d4af37; text-transform: uppercase; letter-spacing: 1px; }
    .content { padding: 28px; font-size: 15px; color: #334155; }
    .content p { margin: 0 0 16px 0; }
    .details-box { background: #f8fafc; border: 1px solid #e2e8f0; border-left: 3px solid #0f2744; border-radius: 4px; padding: 14px 18px; margin: 20px 0; }
    .details-box h3 { margin: 0 0 10px 0; font-size: 14px; font-weight: 700; color: #0f2744; }
    .detail-row { font-size: 14px; margin-bottom: 6px; }
    .detail-row:last-child { margin-bottom: 0; }
    .detail-label { color: #64748b; font-weight: 500; display: inline-block; width: 140px; }
    .detail-val { color: #0f2744; font-weight: 600; }
    .signature { margin-top: 24px; padding-top: 16px; border-top: 1px solid #f1f5f9; font-size: 14px; color: #475569; }
    .footer { background: #f8fafc; padding: 16px 28px; text-align: left; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
    .footer a { color: #0f2744; text-decoration: none; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <h1>Akshar Worldtrade</h1>
        <p>Import | Export | Global Trade</p>
      </div>
      <div class="content">
        <p>Dear ${escapeHtml(buyerName)},</p>
        <p>Thank you for contacting Akshar Worldtrade and for your interest in our products.</p>
        <p>We have successfully received your enquiry regarding <strong>${escapeHtml(product)}</strong>.</p>
        <p>Our trade team is reviewing your requirements and will get back to you within 24 hours with the relevant product details, pricing, availability, packaging options, and quotation.</p>
        
        <div class="details-box">
          <h3>Your enquiry details:</h3>
          <div class="detail-row"><span class="detail-label">Product:</span> <span class="detail-val">${escapeHtml(product)}</span></div>
          ${quantity ? `<div class="detail-row"><span class="detail-label">Quantity / Volume:</span> <span class="detail-val">${escapeHtml(quantity)}</span></div>` : ''}
          ${country ? `<div class="detail-row"><span class="detail-label">Country:</span> <span class="detail-val">${escapeHtml(country)}</span></div>` : ''}
          ${company ? `<div class="detail-row"><span class="detail-label">Company:</span> <span class="detail-val">${escapeHtml(company)}</span></div>` : ''}
        </div>

        <p>We appreciate your interest in doing business with Akshar Worldtrade and look forward to working with you.</p>

        <div class="signature">
          Best regards,<br><br>
          <strong>Akshar Worldtrade</strong><br>
          Import | Export | Global Trade<br>
          Connecting India with the World<br><br>
          <a href="mailto:aksharworldtrade@gmail.com" style="color: #0f2744; text-decoration: none; font-weight: 500;">aksharworldtrade@gmail.com</a>
        </div>
      </div>
      <div class="footer">
        Akshar Worldtrade &bull; Connecting India with the World<br>
        Email: <a href="mailto:aksharworldtrade@gmail.com">aksharworldtrade@gmail.com</a>
      </div>
    </div>
  </div>
</body>
</html>`

    // ── 5. SEND EMAILS VIA CONFIGURED METHOD ─────────────────────
    let adminEmailSent = false
    let buyerEmailSent = false
    let sendError: string | null = null

    // Method A: Gmail SMTP / Custom SMTP via Nodemailer
    if (gmailAppPassword) {
      try {
        const transportConfig: any =
          smtpHost === 'smtp.gmail.com'
            ? {
                service: 'gmail',
                auth: {
                  user: gmailUser,
                  pass: gmailAppPassword,
                },
              }
            : {
                host: smtpHost,
                port: smtpPort,
                secure: smtpPort === 465,
                auth: {
                  user: gmailUser,
                  pass: gmailAppPassword,
                },
              }

        const transporter = nodemailer.createTransport(transportConfig)

        // 1. Send Admin Notification
        await transporter.sendMail({
          from: `"Akshar Worldtrade" <${gmailUser}>`,
          to: adminRecipient,
          replyTo: buyerEmail,
          subject: adminSubject,
          text: adminText,
          html: adminHtml,
        })
        adminEmailSent = true

        // 2. Send Buyer Auto-Acknowledgement
        await transporter.sendMail({
          from: `"Akshar Worldtrade" <${gmailUser}>`,
          to: buyerEmail,
          replyTo: gmailUser,
          subject: buyerSubject,
          text: buyerText,
          html: buyerHtml,
        })
        buyerEmailSent = true
      } catch (err: any) {
        console.error('Nodemailer SMTP sending error:', err?.message || err)
        sendError = err?.message || 'SMTP transmission error'
      }
    }
    // Method B: Resend API (HTTP REST)
    else if (resendApiKey) {
      try {
        // Send Admin Notification
        const adminRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Akshar Worldtrade <onboarding@resend.dev>',
            to: adminRecipient,
            reply_to: buyerEmail,
            subject: adminSubject,
            text: adminText,
            html: adminHtml,
          }),
        })
        adminEmailSent = adminRes.ok

        // Send Buyer Acknowledgement
        const buyerRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Akshar Worldtrade <onboarding@resend.dev>',
            to: buyerEmail,
            reply_to: gmailUser,
            subject: buyerSubject,
            text: buyerText,
            html: buyerHtml,
          }),
        })
        buyerEmailSent = buyerRes.ok
      } catch (err: any) {
        console.error('Resend API sending error:', err?.message || err)
        sendError = err?.message || 'Resend API error'
      }
    }

    // 6. Update enquiry log columns if table contains them
    if (supabaseUrl && supabaseServiceKey && (enquiryData.id || enquiryId)) {
      try {
        const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)
        await supabaseAdmin
          .from('enquiries')
          .update({
            email_notification_sent: adminEmailSent,
            buyer_ack_sent: buyerEmailSent,
            email_error: sendError,
          })
          .eq('id', enquiryData.id || enquiryId)
      } catch {
        // Non-critical update, ignore if columns do not exist
      }
    }

    return new Response(
      JSON.stringify({
        success: adminEmailSent && buyerEmailSent,
        adminEmailSent,
        buyerEmailSent,
        error: sendError,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (globalErr: any) {
    console.error('Unhandled send-enquiry-emails error:', globalErr?.message || globalErr)
    return new Response(
      JSON.stringify({ error: 'Internal edge function error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
