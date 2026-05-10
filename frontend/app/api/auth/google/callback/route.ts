import { NextResponse } from 'next/server';
import { COOKIE } from '@/lib/shopify/customerAccount';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    console.error('Google OAuth Error:', error);
    return NextResponse.redirect(new URL('/account/login?error=google_oauth_failed', request.url));
  }

  if (!code) {
    return NextResponse.redirect(new URL('/account/login?error=no_google_code', request.url));
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = new URL('/api/auth/google/callback', request.url).toString();

  if (!clientId || !clientSecret) {
    console.error('Google Client ID or Secret is not configured.');
    return NextResponse.redirect(new URL('/account/login?error=google_config_missing', request.url));
  }

  try {
    // Exchange authorization code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code: code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }).toString(),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      console.error('Google Token Exchange Error:', tokenData.error_description || tokenData.error);
      return NextResponse.redirect(new URL(`/account/login?error=google_token_exchange_failed&details=${tokenData.error}`, request.url));
    }

    const { access_token, id_token } = tokenData;

    // Verify ID token and get user info
    // In a real app, you'd typically verify the ID token's signature and claims
    // For simplicity, we'll just decode it and trust Google for now.
    // A more robust solution would use a library like 'google-auth-library'
    const userInfoResponse = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`);
    const userInfo = await userInfoResponse.json();

    if (userInfo.error) {
      console.error('Google User Info Error:', userInfo.error_description || userInfo.error);
      return NextResponse.redirect(new URL(`/account/login?error=google_user_info_failed&details=${userInfo.error}`, request.url));
    }

    const { sub: googleId, email, name, picture } = userInfo;

    const response = NextResponse.redirect(new URL('/account', request.url));
    response.cookies.set(
      COOKIE.GOOGLE_SESSION,
      JSON.stringify({ googleId, email, name, picture }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      },
    );
    return response;

  } catch (error) {
    console.error('Google OAuth Callback General Error:', error);
    return NextResponse.redirect(new URL('/account/login?error=google_callback_error', request.url));
  }
}
