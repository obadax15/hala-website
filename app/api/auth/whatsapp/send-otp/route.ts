import { NextResponse } from 'next/server';
import { whatsappService } from '@/lib/services/whatsapp.service';
import { defaultRateLimiter } from '@/lib/rate-limit';

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    // Rate limit: Max 5 OTP requests per IP
    try {
      await defaultRateLimiter.check(5, `otp_${ip}`);
    } catch (rateLimitResponse) {
      return rateLimitResponse as NextResponse;
    }

    const { phone } = await req.json();

    if (!phone || typeof phone !== 'string') {
      return NextResponse.json({ error: 'Valid phone number is required' }, { status: 400 });
    }

    // Basic E.164 validation (starts with + and contains 10-15 digits)
    const phoneRegex = /^\+[1-9]\d{9,14}$/;
    if (!phoneRegex.test(phone)) {
      return NextResponse.json({ error: 'Phone number must be in E.164 format (e.g. +963912345678)' }, { status: 400 });
    }

    await whatsappService.sendOTP(phone);

    return NextResponse.json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Send OTP Error:', error);
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 });
  }
}
