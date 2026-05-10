import { NextRequest, NextResponse } from 'next/server';
import {
  fetchCustomer,
  refreshAccessToken,
  COOKIE,
} from '@/lib/shopify/customerAccount';

export async function GET(req: NextRequest) {
  console.log('[api/auth/me] Checking for session...');
  let accessToken  = req.cookies.get(COOKIE.ACCESS_TOKEN)?.value;
  const expiresAt  = req.cookies.get(COOKIE.EXPIRES_AT)?.value;
  const refreshToken = req.cookies.get(COOKIE.REFRESH_TOKEN)?.value;

  if (!accessToken) {
    console.log('[api/auth/me] No access token found in cookies.');
    return NextResponse.json({ customer: null }, { status: 401 });
  }
  console.log('[api/auth/me] Access token found.');

  // Proactively refresh if within 5 minutes of expiry
  if (expiresAt && refreshToken) {
    const expiry = new Date(expiresAt);
    const fiveMin = 5 * 60 * 1000;
    if (expiry.getTime() - Date.now() < fiveMin) {
      console.log('[api/auth/me] Access token is expiring soon, attempting to refresh...');
      const newTokens = await refreshAccessToken(refreshToken);
      if (newTokens) {
        console.log('[api/auth/me] Access token refreshed successfully.');
        accessToken = newTokens.access_token;
        const newExpiry = new Date(Date.now() + newTokens.expires_in * 1000);
        const secure   = process.env.NODE_ENV === 'production';
        const baseOpts = { httpOnly: true, sameSite: 'lax' as const, secure, path: '/' };

        const customer = await fetchCustomer(accessToken);
        console.log(`[api/auth/me] Fetched customer after refresh: ${customer ? customer.id : 'null'}`);
        const res      = NextResponse.json({ customer });
        res.cookies.set(COOKIE.ACCESS_TOKEN, accessToken,              { ...baseOpts, expires: newExpiry });
        res.cookies.set(COOKIE.EXPIRES_AT,   newExpiry.toISOString(),  { ...baseOpts, expires: newExpiry });
        if (newTokens.refresh_token) {
          const refreshExpiry = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
          res.cookies.set(COOKIE.REFRESH_TOKEN, newTokens.refresh_token, { ...baseOpts, expires: refreshExpiry });
        }
        return res;
      } else {
        console.log('[api/auth/me] Failed to refresh access token.');
      }
    }
  }

  console.log('[api/auth/me] Fetching customer with existing token...');
  const customer = await fetchCustomer(accessToken);
  if (!customer) {
    console.log('[api/auth/me] fetchCustomer returned null. Invalidating session.');
    return NextResponse.json({ customer: null }, { status: 401 });
  }

  console.log(`[api/auth/me] Successfully fetched customer: ${customer.id}`);
  return NextResponse.json({ customer });
}
