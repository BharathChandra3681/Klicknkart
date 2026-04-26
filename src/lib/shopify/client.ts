import { ShopifyError } from './types';

const SHOPIFY_GRAPHQL_API_ENDPOINT = `/api/2024-01/graphql.json`;

interface FetchStorefrontOptions {
  query: string;
  variables?: Record<string, unknown>;
  tags?: string[];
  cache?: RequestCache;
}

export async function fetchStorefront<T>({
  query,
  variables,
  tags,
  cache = 'force-cache',
}: FetchStorefrontOptions): Promise<T> {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

  if (!domain || !token) {
    throw new Error(
      'Missing SHOPIFY_STORE_DOMAIN or SHOPIFY_STOREFRONT_ACCESS_TOKEN environment variables.'
    );
  }

  const url = `https://${domain}${SHOPIFY_GRAPHQL_API_ENDPOINT}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': token,
    },
    body: JSON.stringify({ query, variables }),
    ...(tags ? { next: { tags } } : {}),
    cache,
  });

  if (!res.ok) {
    throw new Error(`Shopify API error: ${res.status} ${res.statusText}`);
  }

  const { data, errors }: { data: T; errors?: ShopifyError[] } = await res.json();

  if (errors?.length) {
    throw new Error(errors.map((e) => e.message).join('\n'));
  }

  return data;
}
