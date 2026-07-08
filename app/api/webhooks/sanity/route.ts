import { NextRequest, NextResponse } from 'next/server';
import { isValidSignature, SIGNATURE_HEADER_NAME } from '@sanity/webhook';
import { upsertProduct, deleteProductBySanityId } from '@/lib/repositories/product.repository';

const secret = process.env.SANITY_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  try {
    const signature = req.headers.get(SIGNATURE_HEADER_NAME);
    const body = await req.text();

    if (secret) {
      if (!signature || !isValidSignature(body, signature, secret)) {
        return NextResponse.json({ success: false, message: 'Invalid signature' }, { status: 401 });
      }
    }

    const payload = JSON.parse(body);
    
    // Sanity webhooks can send different payloads based on configuration.
    // We expect the payload to contain `_id`, `_type`, and `price`.
    const sanityId = payload._id;
    
    if (!sanityId) {
      return NextResponse.json({ success: false, message: 'Missing _id in payload' }, { status: 400 });
    }

    // Determine if it's a delete operation.
    // A common pattern is to configure the webhook to send `{ "operation": "delete", "_id": ... }` 
    // or just checking if `price` is omitted (though not foolproof, it works for simple setups if we enforce price).
    // The most robust way without forcing a specific complex GROQ is to check a custom 'operation' field 
    // that the user configures in the Sanity webhook payload:
    // { "operation": "delete", "_id": _id }
    // Or, another pattern is that Sanity sends the full document if it exists, or just the `_id` and maybe `_type` if deleted without projection.
    
    const operation = payload.operation;

    if (operation === 'delete') {
      await deleteProductBySanityId(sanityId);
      return NextResponse.json({ success: true, message: `Product ${sanityId} deleted` }, { status: 200 });
    }

    // For create/update
    const price = payload.price;
    
    if (typeof price !== 'number') {
      // If no operation is provided, and price is missing, we might not be able to process it
      return NextResponse.json({ success: false, message: 'Missing price or operation in payload' }, { status: 400 });
    }

    await upsertProduct({
      sanityId,
      price,
      stock: 100, // Default stock for newly synced products, assuming manual adjustment in DB later
    });

    return NextResponse.json({ success: true, message: `Product ${sanityId} synced` }, { status: 200 });
  } catch (err) {
    console.error('[POST /api/webhooks/sanity]', err);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
