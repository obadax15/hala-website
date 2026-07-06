/**
 * Email Service
 * Sends transactional emails. Currently logs to console in development
 * (no Resend API key required). When RESEND_API_KEY is added to .env,
 * it switches to real email delivery automatically.
 */

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

async function sendEmail(payload: EmailPayload): Promise<{ success: boolean; id?: string }> {
  const apiKey = process.env.RESEND_API_KEY;

  // Development fallback — log to console
  if (!apiKey || apiKey === 'your_resend_api_key') {
    console.log('\n📧 [Email Service - DEV MODE]');
    console.log(`To: ${payload.to}`);
    console.log(`Subject: ${payload.subject}`);
    console.log('--- HTML Body ---');
    console.log(payload.html.replace(/<[^>]+>/g, '').trim());
    console.log('---\n');
    return { success: true, id: 'dev-email-' + Date.now() };
  }

  // Production — use Resend
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM ?? 'Halahello <noreply@halahello.com>',
        to: payload.to,
        subject: payload.subject,
        html: payload.html,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error('[Email Service] Resend error:', error);
      return { success: false };
    }

    const data = await res.json() as { id: string };
    return { success: true, id: data.id };
  } catch (err) {
    console.error('[Email Service] Unexpected error:', err);
    return { success: false };
  }
}

export async function sendContactConfirmation(name: string, email: string, message: string) {
  return sendEmail({
    to: email,
    subject: 'We received your message — Halahello ✨',
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #3A2E2A;">
        <div style="background: linear-gradient(135deg, #FAF7F5, #F6EDEE); padding: 40px; border-radius: 16px; text-align: center; margin-bottom: 32px;">
          <h1 style="font-size: 2rem; color: #CFA18D; margin: 0;">Halahello</h1>
          <p style="color: #6B5B55; font-style: italic; margin: 8px 0 0;">Where elegance meets creativity</p>
        </div>
        <h2 style="color: #3A2E2A;">Hello, ${name}! 💌</h2>
        <p>Thank you for reaching out. We've received your message and will get back to you within 1–2 business days.</p>
        <div style="background: #F6EDEE; border-left: 4px solid #CFA18D; padding: 20px; border-radius: 8px; margin: 24px 0;">
          <p style="font-style: italic; color: #6B5B55; margin: 0;">"${message}"</p>
        </div>
        <p>In the meantime, follow us on <a href="https://instagram.com/halahelloo" style="color: #CFA18D;">@halahelloo</a> for the latest collections.</p>
        <p style="color: #6B5B55;">With love,<br/><strong>The Halahello Team</strong></p>
      </div>
    `,
  });
}

export async function sendContactNotificationToAdmin(name: string, email: string, message: string) {
  const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@halahello.com';
  return sendEmail({
    to: adminEmail,
    subject: `📬 New Contact Message from ${name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #3A2E2A;">
        <h2>New Contact Form Submission</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px; font-weight: bold;">Name:</td><td style="padding: 8px;">${name}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Email:</td><td style="padding: 8px;">${email}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Message:</td><td style="padding: 8px;">${message}</td></tr>
        </table>
      </div>
    `,
  });
}

export async function sendCustomRequestConfirmation(name: string, email: string, details: string) {
  return sendEmail({
    to: email,
    subject: 'Your Custom Plexi Request — Halahello ✨',
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #3A2E2A;">
        <div style="background: linear-gradient(135deg, #FAF7F5, #F6EDEE); padding: 40px; border-radius: 16px; text-align: center; margin-bottom: 32px;">
          <h1 style="font-size: 2rem; color: #CFA18D; margin: 0;">Halahello</h1>
          <p style="color: #6B5B55; font-style: italic; margin: 8px 0 0;">Plexi by Halahello</p>
        </div>
        <h2 style="color: #3A2E2A;">Your request is in our hands, ${name}! ✦</h2>
        <p>We've received your custom Plexi request and our artisans are reviewing it. You'll receive a personal quote within 2–3 business days.</p>
        <div style="background: #F6EDEE; border-left: 4px solid #CFA18D; padding: 20px; border-radius: 8px; margin: 24px 0;">
          <strong>Your Request:</strong>
          <p style="color: #6B5B55; margin: 8px 0 0;">${details}</p>
        </div>
        <p>Follow our process:</p>
        <ol style="color: #6B5B55; line-height: 2;">
          <li>✅ Request Submitted</li>
          <li>⏳ Our team reviews and prepares a quote</li>
          <li>📩 You receive a quote via email</li>
          <li>💳 Approve &amp; pay to begin production</li>
          <li>📦 Your piece is crafted and shipped</li>
        </ol>
        <p style="color: #6B5B55;">With love,<br/><strong>The Halahello Artisans</strong></p>
      </div>
    `,
  });
}

export async function sendCustomRequestNotificationToAdmin(
  name: string,
  email: string,
  details: string,
  imageUrls: string[]
) {
  const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@halahello.com';
  return sendEmail({
    to: adminEmail,
    subject: `✦ New Custom Plexi Request from ${name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #3A2E2A;">
        <h2>New Custom Plexi Request</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px; font-weight: bold;">Name:</td><td style="padding: 8px;">${name}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Email:</td><td style="padding: 8px;">${email}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Details:</td><td style="padding: 8px;">${details}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Images:</td><td style="padding: 8px;">${imageUrls.length > 0 ? imageUrls.join('<br/>') : 'None'}</td></tr>
        </table>
      </div>
    `,
  });
}
