import { NextRequest, NextResponse } from 'next/server';
import { buildLogoutUrl, COOKIE } from '@/lib/shopify/customerAccount';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL!;

export async function GET(req: NextRequest) {
  const postLogoutUri = `${APP_URL}/`;
  const shopifyLogoutUrl = buildLogoutUrl(postLogoutUri);

  const res = NextResponse.redirect(shopifyLogoutUrl);

  // Clear all auth cookies
  const deleteOpts = { path: '/' };
  res.cookies.delete({ name: COOKIE.ACCESS_TOKEN,  ...deleteOpts });
  res.cookies.delete({ name: COOKIE.REFRESH_TOKEN, ...deleteOpts });
  res.cookies.delete({ name: COOKIE.EXPIRES_AT,    ...deleteOpts });
  res.cookies.delete({ name: COOKIE.STATE,         ...deleteOpts });
  res.cookies.delete({ name: COOKIE.VERIFIER,      ...deleteOpts });

  return res;
}
