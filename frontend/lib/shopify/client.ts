import { createStorefrontApiClient } from '@shopify/storefront-api-client';

const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!;
const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!;

if (!domain || !storefrontAccessToken) {
  console.warn('Shopify env vars not set — API calls will fail. Set NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN and NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN in .env.local');
}

export const shopifyClient = createStorefrontApiClient({
  storeDomain: domain,
  apiVersion: '2026-04',
  publicAccessToken: storefrontAccessToken,
});

export async function shopifyFetch<T>({
  query,
  variables,
}: {
  query: string;
  variables?: Record<string, unknown>;
}): Promise<T> {
  const { data, errors } = await shopifyClient.request<T>(query, { variables });

  if (errors) {
    throw new Error(errors.message ?? 'Shopify API error');
  }

  return data as T;
}
