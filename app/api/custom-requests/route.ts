import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createCustomRequest } from '@/lib/repositories/custom-request.repository';
import {
  sendCustomRequestConfirmation,
  sendCustomRequestNotificationToAdmin,
} from '@/lib/services/email.service';

const customRequestSchema = z.object({
  name: z.string().min(2, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  color: z.string().max(100).optional(),
  occasion: z.string().max(200).optional(),
  message: z.string().min(10, 'Please describe your request in more detail').max(3000),
  imageUrls: z.array(z.string().url()).max(5).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = customRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', issues: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, email, color, occasion, message, imageUrls = [] } = parsed.data;

    // Build the full details string from all fields
    const details = [
      message,
      color ? `Color preference: ${color}` : null,
      occasion ? `Occasion: ${occasion}` : null,
    ]
      .filter(Boolean)
      .join('\n\n');

    // Persist to database
    const customRequest = await createCustomRequest({
      name,
      email,
      details,
      imageUrls,
    });

    // Send emails concurrently
    await Promise.allSettled([
      sendCustomRequestConfirmation(name, email, details),
      sendCustomRequestNotificationToAdmin(name, email, details, imageUrls),
    ]);

    return NextResponse.json(
      {
        success: true,
        id: customRequest.id,
        message: 'Your custom request has been submitted! We\'ll send you a quote within 2–3 business days.',
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('[POST /api/custom-requests]', err);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
