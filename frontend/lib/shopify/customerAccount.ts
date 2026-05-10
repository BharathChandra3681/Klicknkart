import type { Customer } from './types';

const SHOP_ID   = process.env.SHOPIFY_SHOP_ID!;
const CLIENT_ID = process.env.SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID!;
const AUTH_BASE = `https://shopify.com/authentication/${SHOP_ID}`;
const API_URL   = `https://shopify.com/authentication/${SHOP_ID}/account/customer/api/2024-10/graphql`;

// ── PKCE helpers ──────────────────────────────────────────────────────────────

function base64urlEncode(buf: Uint8Array): string {
  return Buffer.from(buf)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

export function generateRandomString(bytes = 32): string {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return base64urlEncode(arr);
}

export async function generateCodeChallenge(verifier: string): Promise<string> {
  const data = new TextEncoder().encode(verifier);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return base64urlEncode(new Uint8Array(hash));
}

// ── OAuth URLs ────────────────────────────────────────────────────────────────

export async function buildAuthorizationUrl(params: {
  codeVerifier: string;
  state: string;
  redirectUri: string;
}): Promise<string> {
  const challenge = await generateCodeChallenge(params.codeVerifier);
  const url = new URL(`${AUTH_BASE}/oauth/authorize`);
  url.searchParams.set('client_id',             CLIENT_ID);
  url.searchParams.set('response_type',         'code');
  url.searchParams.set('redirect_uri',          params.redirectUri);
  url.searchParams.set('scope',                 'openid email https://api.customers.com/auth/customer.graphql');
  url.searchParams.set('code_challenge',        challenge);
  url.searchParams.set('code_challenge_method', 'S256');
  url.searchParams.set('state',                 params.state);
  return url.toString();
}

export function buildLogoutUrl(postLogoutRedirectUri: string): string {
  const url = new URL(`${AUTH_BASE}/logout`);
  url.searchParams.set('post_logout_redirect_uri', postLogoutRedirectUri);
  return url.toString();
}

// ── Token exchange ────────────────────────────────────────────────────────────

type TokenResponse = {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
};

export async function exchangeCodeForTokens(params: {
  code: string;
  codeVerifier: string;
  redirectUri: string;
}): Promise<TokenResponse | null> {
  const res = await fetch(`${AUTH_BASE}/oauth/token`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type:    'authorization_code',
      client_id:     CLIENT_ID,
      code:          params.code,
      redirect_uri:  params.redirectUri,
      code_verifier: params.codeVerifier,
    }),
  });
  if (!res.ok) { console.error('Token exchange failed:', await res.text()); return null; }
  return res.json();
}

export async function refreshAccessToken(refreshToken: string): Promise<TokenResponse | null> {
  const res = await fetch(`${AUTH_BASE}/oauth/token`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type:    'refresh_token',
      client_id:     CLIENT_ID,
      refresh_token: refreshToken,
    }),
  });
  if (!res.ok) return null;
  return res.json();
}

// ── Customer Account API GraphQL ──────────────────────────────────────────────

const CUSTOMER_QUERY = `
  query GetCustomer {
    customer {
      id
      firstName
      lastName
      emailAddress { emailAddress }
      phoneNumber  { phoneNumber }
      defaultAddress {
        id firstName lastName
        address1 address2
        city province zip country phone
      }
      addresses(first: 10) {
        nodes {
          id firstName lastName
          address1 address2
          city province zip country phone
        }
      }
      orders(first: 20, sortKey: CREATED_AT, reverse: true) {
        nodes {
          id
          number
          processedAt
          financialStatus
          fulfillmentStatus
          totalPrice { amount currencyCode }
          lineItems(first: 5) {
            nodes { title quantity }
          }
        }
      }
    }
  }
`;

export async function fetchCustomer(accessToken: string): Promise<Customer | null> {
  const res = await fetch(API_URL, {
    method:  'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ query: CUSTOMER_QUERY }),
  });
  if (!res.ok) return null;

  const { data, errors } = await res.json();
  if (errors?.length || !data?.customer) return null;

  const c = data.customer;

  // Map Customer Account API shape → our existing Customer type
  return {
    id:        c.id,
    firstName: c.firstName ?? null,
    lastName:  c.lastName  ?? null,
    email:     c.emailAddress?.emailAddress ?? '',
    phone:     c.phoneNumber?.phoneNumber   ?? null,
    defaultAddress: c.defaultAddress ?? null,
    addresses: {
      edges: (c.addresses?.nodes ?? []).map((n: any) => ({ node: n })),
    },
    orders: {
      edges: (c.orders?.nodes ?? []).map((n: any) => ({
        node: {
          id:                n.id,
          orderNumber:       n.number,
          processedAt:       n.processedAt,
          financialStatus:   n.financialStatus   ?? '',
          fulfillmentStatus: n.fulfillmentStatus ?? '',
          currentTotalPrice: n.totalPrice,
          lineItems: {
            edges: (n.lineItems?.nodes ?? []).map((li: any) => ({ node: li })),
          },
        },
      })),
    },
  };
}

// Cookie names (shared across API routes)
export const COOKIE = {
  ACCESS_TOKEN:  'shopify_ca_access',
  REFRESH_TOKEN: 'shopify_ca_refresh',
  EXPIRES_AT:    'shopify_ca_expires',
  STATE:         'shopify_oauth_state',
  VERIFIER:      'shopify_oauth_verifier',
} as const;
