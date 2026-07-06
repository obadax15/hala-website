import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  sendContactConfirmation,
  sendContactNotificationToAdmin,
} from '@/lib/services/email.service';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', issues: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, email, message } = parsed.data;

    // Send emails concurrently (don't block on admin email)
    await Promise.allSettled([
      sendContactConfirmation(name, email, message),
      sendContactNotificationToAdmin(name, email, message),
    ]);

    return NextResponse.json(
      { success: true, message: 'Message received! We\'ll be in touch soon.' },
      { status: 200 }
    );
  } catch (err) {
    console.error('[POST /api/contact]', err);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
