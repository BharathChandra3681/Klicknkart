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

// ── Order handlers ──────────────────────────────────────────────────────────

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

async function handleOrderCancelled(payload: Record<string, unknown>) {
  const orderId = payload['id'];
  const orderNumber = payload['order_number'];
  const email = payload['email'];
  const cancelReason = payload['cancel_reason'] ?? 'N/A';
  console.log(`[webhook] orders/cancelled — #${orderNumber} (${orderId}) email=${email} reason=${cancelReason}`);
  // TODO: notify user of cancellation, update internal order status, release inventory if needed
}

async function handleRefundCreate(payload: Record<string, unknown>) {
  const orderId = payload['order_id'];
  const refundId = payload['id'];
  const transactions = (payload['transactions'] as Array<{ amount?: string; gateway?: string }> | undefined) ?? [];
  const totalRefunded = transactions.reduce((sum, t) => sum + parseFloat(t.amount ?? '0'), 0);
  console.log(`[webhook] refunds/create — refund=${refundId} order=${orderId} amount=${totalRefunded.toFixed(2)}`);
  // TODO: notify user of refund processed, update internal financial records
}

// ── Product & inventory handlers ────────────────────────────────────────────

async function handleInventoryUpdate(payload: Record<string, unknown>) {
  const inventoryItemId = payload['inventory_item_id'];
  const locationId = payload['location_id'];
  const available = payload['available'];
  const updatedAt = payload['updated_at'];
  console.log(`[webhook] inventory_levels/update — item=${inventoryItemId} location=${locationId} available=${available} at=${updatedAt}`);
  // TODO: update local product availability cache, trigger low-stock alerts, invalidate cached product pages
}

async function handleProductUpdate(payload: Record<string, unknown>) {
  const productId = payload['id'];
  const title = payload['title'];
  const handle = payload['handle'];
  const variants = (payload['variants'] as Array<{ id: number; price: string; compare_at_price: string | null }> | undefined) ?? [];
  console.log(`[webhook] products/update — id=${productId} title=${title} handle=${handle} variants=${variants.length}`);
  // TODO: invalidate Next.js ISR cache for product/collection pages, update search index, refresh cached prices
}

async function handleProductDelete(payload: Record<string, unknown>) {
  const productId = payload['id'];
  console.log(`[webhook] products/delete — id=${productId}`);
  // TODO: remove from search index, invalidate caches, redirect product page to 404/collection page
}

// ── Customer handlers ───────────────────────────────────────────────────────

async function handleCustomerUpdate(payload: Record<string, unknown>) {
  const customerId = payload['id'];
  const email = payload['email'];
  const firstName = payload['first_name'];
  const lastName = payload['last_name'];
  const phone = payload['phone'];
  const verifiedEmail = payload['verified_email'];
  console.log(`[webhook] customers/update — id=${customerId} email=${email} name=${firstName} ${lastName} verified=${verifiedEmail}`);
  // TODO: sync profile changes into any internal user database, update marketing lists
}

// ── Main POST handler ───────────────────────────────────────────────────────

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
    case 'orders/cancelled':
      handleOrderCancelled(payload).catch((e) => console.error('[webhook] orders/cancelled error', e));
      break;
    case 'refunds/create':
      handleRefundCreate(payload).catch((e) => console.error('[webhook] refunds/create error', e));
      break;
    case 'inventory_levels/update':
      handleInventoryUpdate(payload).catch((e) => console.error('[webhook] inventory_levels/update error', e));
      break;
    case 'products/update':
      handleProductUpdate(payload).catch((e) => console.error('[webhook] products/update error', e));
      break;
    case 'products/delete':
      handleProductDelete(payload).catch((e) => console.error('[webhook] products/delete error', e));
      break;
    case 'customers/update':
      handleCustomerUpdate(payload).catch((e) => console.error('[webhook] customers/update error', e));
      break;
    default:
      console.log(`[webhook] unhandled topic: ${topic}`);
  }

  return response;
}
