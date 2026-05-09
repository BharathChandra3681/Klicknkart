import { createHmac, timingSafeEqual } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

const WEBHOOK_SECRET = process.env.SHOPIFY_WEBHOOK_SECRET ?? '';

function verifyHmac(body: string, hmacHeader: string): boolean {
  if (!WEBHOOK_SECRET) return false;
  const digest = createHmac('sha256', WEBHOOK_SECRET)
    .update(body, 'utf8')
    .digest('base64');
  try {
    return timingSafeEqual(Buffer.from(digest), Buffer.from(hmacHeader));
  } catch {
    return false;
  }
}

async function handleOrderPaid(payload: Record<string, unknown>) {
  const orderId = payload['id'];
  const orderNumber = payload['order_number'];
  const email = payload['email'];
  const total = payload['total_price'];
  console.log(`[webhook] orders/paid — #${orderNumber} (${orderId}) email=${email} total=${total}`);
  // TODO: trigger transactional email, update internal DB, etc.
}

async function handleOrderFulfilled(payload: Record<string, unknown>) {
  const orderId = payload['id'];
  const orderNumber = payload['order_number'];
  const trackingNumbers = (payload['fulfillments'] as Array<{ tracking_number?: string }> | undefined)
    ?.map((f) => f.tracking_number)
    .filter(Boolean);
  console.log(`[webhook] orders/fulfilled — #${orderNumber} (${orderId}) tracking=${trackingNumbers?.join(', ')}`);
  // TODO: send shipping notification email, etc.
}

export async function POST(req: NextRequest) {
  const hmacHeader = req.headers.get('x-shopify-hmac-sha256') ?? '';
  const topic = req.headers.get('x-shopify-topic') ?? '';

  const body = await req.text();

  if (!verifyHmac(body, hmacHeader)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Respond 200 immediately so Shopify doesn't retry
  const response = NextResponse.json({ received: true }, { status: 200 });

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(body);
  } catch {
    return response;
  }

  // Fire-and-forget — must not await inside the response path
  switch (topic) {
    case 'orders/paid':
      handleOrderPaid(payload).catch((e) => console.error('[webhook] orders/paid error', e));
      break;
    case 'orders/fulfilled':
      handleOrderFulfilled(payload).catch((e) => console.error('[webhook] orders/fulfilled error', e));
      break;
    default:
      console.log(`[webhook] unhandled topic: ${topic}`);
  }

  return response;
}
