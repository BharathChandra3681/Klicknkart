import { fetchStorefront } from './client';
import {
  getProductsQuery,
  getProductByHandleQuery,
  getProductHandlesQuery,
} from './queries/products';
import {
  getCollectionsQuery,
  getCollectionByHandleQuery,
} from './queries/collections';
import { searchProductsQuery } from './queries/search';
import {
  cartCreateMutation,
  cartLinesAddMutation,
  cartLinesUpdateMutation,
  cartLinesRemoveMutation,
  getCartQuery,
} from './mutations/cart';
import { Product, Collection, ShopifyCart } from './types';

export const TAGS = {
  products: 'products',
  collections: 'collections',
  cart: 'cart',
} as const;

// ─── Products ────────────────────────────────────────────────────────────────

export async function getProducts({
  first = 20,
  sortKey = 'RELEVANCE',
  reverse = false,
}: {
  first?: number;
  sortKey?: string;
  reverse?: boolean;
} = {}): Promise<Product[]> {
  const data = await fetchStorefront<{ products: { edges: { node: Product }[] } }>({
    query: getProductsQuery,
    variables: { first, sortKey, reverse },
    tags: [TAGS.products],
  });
  return data.products.edges.map((e) => e.node);
}

export async function getProductByHandle(handle: string): Promise<Product | null> {
  const data = await fetchStorefront<{ productByHandle: Product | null }>({
    query: getProductByHandleQuery,
    variables: { handle },
    tags: [TAGS.products],
  });
  return data.productByHandle;
}

export async function getProductHandles(first = 100): Promise<string[]> {
  const data = await fetchStorefront<{ products: { edges: { node: { handle: string } }[] } }>({
    query: getProductHandlesQuery,
    variables: { first },
    tags: [TAGS.products],
  });
  return data.products.edges.map((e) => e.node.handle);
}

// ─── Collections ─────────────────────────────────────────────────────────────

export async function getCollections(first = 20): Promise<Collection[]> {
  const data = await fetchStorefront<{ collections: { edges: { node: Collection }[] } }>({
    query: getCollectionsQuery,
    variables: { first },
    tags: [TAGS.collections],
  });
  return data.collections.edges.map((e) => e.node);
}

export async function getCollectionByHandle(
  handle: string,
  first = 20
): Promise<Collection | null> {
  const data = await fetchStorefront<{ collectionByHandle: Collection | null }>({
    query: getCollectionByHandleQuery,
    variables: { handle, first },
    tags: [TAGS.collections],
  });
  return data.collectionByHandle;
}

// ─── Search ───────────────────────────────────────────────────────────────────

export async function searchProducts(query: string, first = 20): Promise<Product[]> {
  const data = await fetchStorefront<{ products: { edges: { node: Product }[] } }>({
    query: searchProductsQuery,
    variables: { query, first },
    cache: 'no-store',
  });
  return data.products.edges.map((e) => e.node);
}

// ─── Cart ─────────────────────────────────────────────────────────────────────

export async function getCart(cartId: string): Promise<ShopifyCart | null> {
  const data = await fetchStorefront<{ cart: ShopifyCart | null }>({
    query: getCartQuery,
    variables: { cartId },
    cache: 'no-store',
  });
  return data.cart;
}

export async function createCart(): Promise<ShopifyCart> {
  const data = await fetchStorefront<{ cartCreate: { cart: ShopifyCart } }>({
    query: cartCreateMutation,
    variables: { input: {} },
    cache: 'no-store',
  });
  return data.cartCreate.cart;
}

export async function addToCart(
  cartId: string,
  variantId: string,
  quantity = 1
): Promise<ShopifyCart> {
  const data = await fetchStorefront<{ cartLinesAdd: { cart: ShopifyCart } }>({
    query: cartLinesAddMutation,
    variables: {
      cartId,
      lines: [{ merchandiseId: variantId, quantity }],
    },
    cache: 'no-store',
  });
  return data.cartLinesAdd.cart;
}

export async function updateCartLine(
  cartId: string,
  lineId: string,
  quantity: number
): Promise<ShopifyCart> {
  const data = await fetchStorefront<{ cartLinesUpdate: { cart: ShopifyCart } }>({
    query: cartLinesUpdateMutation,
    variables: {
      cartId,
      lines: [{ id: lineId, quantity }],
    },
    cache: 'no-store',
  });
  return data.cartLinesUpdate.cart;
}

export async function removeCartLine(cartId: string, lineId: string): Promise<ShopifyCart> {
  const data = await fetchStorefront<{ cartLinesRemove: { cart: ShopifyCart } }>({
    query: cartLinesRemoveMutation,
    variables: { cartId, lineIds: [lineId] },
    cache: 'no-store',
  });
  return data.cartLinesRemove.cart;
}
