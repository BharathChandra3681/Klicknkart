import { NextRequest, NextResponse } from 'next/server';
import {
  exchangeCodeForTokens,
  COOKIE,
} from '@/lib/shopify/customerAccount';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL!;

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const code  = searchParams.get('code');
  const state = searchParams.get('state');

  const storedState    = req.cookies.get(COOKIE.STATE)?.value;
  const codeVerifier   = req.cookies.get(COOKIE.VERIFIER)?.value;

  // Validate state to prevent CSRF
  if (!code || !state || state !== storedState || !codeVerifier) {
    return NextResponse.redirect(`${APP_URL}/account/login?error=auth_failed`);
  }

  const redirectUri = `${APP_URL}/api/auth/callback`;
  const tokens = await exchangeCodeForTokens({ code, codeVerifier, redirectUri });

  if (!tokens) {
    return NextResponse.redirect(`${APP_URL}/account/login?error=token_failed`);
  }

  const expiresAt = new Date(Date.now() + tokens.expires_in * 1000);

  const res = NextResponse.redirect(`${APP_URL}/account`);

  const secure  = process.env.NODE_ENV === 'production';
  const baseOpts = { httpOnly: true, sameSite: 'lax' as const, secure, path: '/' };

  // Store tokens in httpOnly cookies
  res.cookies.set(COOKIE.ACCESS_TOKEN,  tokens.access_token,          { ...baseOpts, expires: expiresAt });
  res.cookies.set(COOKIE.EXPIRES_AT,    expiresAt.toISOString(),       { ...baseOpts, expires: expiresAt });

  if (tokens.refresh_token) {
    // Refresh token lives for 1 year
    const refreshExpiry = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
    res.cookies.set(COOKIE.REFRESH_TOKEN, tokens.refresh_token, { ...baseOpts, expires: refreshExpiry });
  }

  // Clear the PKCE cookies — they're no longer needed
  res.cookies.delete(COOKIE.STATE);
  res.cookies.delete(COOKIE.VERIFIER);

  return res;
}
