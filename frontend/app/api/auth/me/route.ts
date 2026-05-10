import { NextRequest, NextResponse } from 'next/server';
import {
  fetchCustomer,
  refreshAccessToken,
  COOKIE,
} from '@/lib/shopify/customerAccount';
import type { Customer } from '@/lib/shopify/types';

function buildGoogleCustomer(rawValue: string): Customer | null {
  try {
    const session = JSON.parse(rawValue) as {
      googleId?: string;
      email?: string;
      name?: string;
      picture?: string;
    };

    if (!session.googleId || !session.email) {
      return null;
    }

    const parts = (session.name ?? '').trim().split(/\s+/).filter(Boolean);
    const firstName = parts[0] ?? null;
    const lastName = parts.length > 1 ? parts.slice(1).join(' ') : null;

    return {
      id: session.googleId,
      firstName,
      lastName,
      email: session.email,
      phone: null,
      defaultAddress: null,
      addresses: { edges: [] },
      orders: { edges: [] },
    };
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  let accessToken  = req.cookies.get(COOKIE.ACCESS_TOKEN)?.value;
  const expiresAt  = req.cookies.get(COOKIE.EXPIRES_AT)?.value;
  const refreshToken = req.cookies.get(COOKIE.REFRESH_TOKEN)?.value;
  const googleSession = req.cookies.get(COOKIE.GOOGLE_SESSION)?.value;

  if (!accessToken && googleSession) {
    const customer = buildGoogleCustomer(googleSession);
    if (customer) {
      return NextResponse.json({ customer });
    }
  }

  if (!accessToken) {
    return NextResponse.json({ customer: null }, { status: 401 });
  }

  // Proactively refresh if within 5 minutes of expiry
  if (expiresAt && refreshToken) {
    const expiry = new Date(expiresAt);
    const fiveMin = 5 * 60 * 1000;
    if (expiry.getTime() - Date.now() < fiveMin) {
      const newTokens = await refreshAccessToken(refreshToken);
      if (newTokens) {
        accessToken = newTokens.access_token;
        const newExpiry = new Date(Date.now() + newTokens.expires_in * 1000);
        const secure   = process.env.NODE_ENV === 'production';
        const baseOpts = { httpOnly: true, sameSite: 'lax' as const, secure, path: '/' };

        const customer = await fetchCustomer(accessToken);
        const res      = NextResponse.json({ customer });
        res.cookies.set(COOKIE.ACCESS_TOKEN, accessToken,              { ...baseOpts, expires: newExpiry });
        res.cookies.set(COOKIE.EXPIRES_AT,   newExpiry.toISOString(),  { ...baseOpts, expires: newExpiry });
        if (newTokens.refresh_token) {
          const refreshExpiry = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
          res.cookies.set(COOKIE.REFRESH_TOKEN, newTokens.refresh_token, { ...baseOpts, expires: refreshExpiry });
        }
        return res;
      }
    }
  }

  const customer = await fetchCustomer(accessToken);
  if (!customer) {
    return NextResponse.json({ customer: null }, { status: 401 });
  }

  return NextResponse.json({ customer });
}
