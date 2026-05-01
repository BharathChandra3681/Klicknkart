import { shopifyFetch } from './client';
import {
  GET_PRODUCTS_QUERY,
  GET_PRODUCT_BY_HANDLE_QUERY,
} from './queries/products';
import {
  GET_COLLECTIONS_QUERY,
  GET_COLLECTION_BY_HANDLE_QUERY,
} from './queries/collections';
import {
  CREATE_CART_MUTATION,
  ADD_TO_CART_MUTATION,
  UPDATE_CART_MUTATION,
  REMOVE_FROM_CART_MUTATION,
  GET_CART_QUERY,
} from './queries/cart';
import type { Cart, Collection, Product, ShopifyConnection } from './types';

// ── Products ─────────────────────────────────────────────────────────────────

export async function getProducts(first = 24): Promise<Product[]> {
  try {
    const data = await shopifyFetch<{ products: ShopifyConnection<Product> }>({
      query: GET_PRODUCTS_QUERY, variables: { first },
    });
    return data.products.edges.map((e) => e.node);
  } catch { return []; }
}

export async function getProductByHandle(handle: string): Promise<Product | null> {
  try {
    const data = await shopifyFetch<{ productByHandle: Product | null }>({
      query: GET_PRODUCT_BY_HANDLE_QUERY, variables: { handle },
    });
    return data.productByHandle;
  } catch { return null; }
}

// ── Collections ───────────────────────────────────────────────────────────────

export async function getCollections(first = 20): Promise<Collection[]> {
  try {
    const data = await shopifyFetch<{ collections: ShopifyConnection<Collection> }>({
      query: GET_COLLECTIONS_QUERY, variables: { first },
    });
    return data.collections.edges.map((e) => e.node);
  } catch { return []; }
}

export async function getCollectionByHandle(handle: string, first = 24): Promise<Collection | null> {
  try {
    const data = await shopifyFetch<{ collectionByHandle: Collection | null }>({
      query: GET_COLLECTION_BY_HANDLE_QUERY, variables: { handle, first },
    });
    return data.collectionByHandle;
  } catch { return null; }
}

// ── Cart ──────────────────────────────────────────────────────────────────────

export async function createCart(
  lines: { merchandiseId: string; quantity: number }[] = []
): Promise<Cart> {
  const data = await shopifyFetch<{ cartCreate: { cart: Cart } }>({
    query: CREATE_CART_MUTATION,
    variables: { lines },
  });
  return data.cartCreate.cart;
}

export async function getCart(cartId: string): Promise<Cart | null> {
  const data = await shopifyFetch<{ cart: Cart | null }>({
    query: GET_CART_QUERY,
    variables: { cartId },
  });
  return data.cart;
}

export async function addToCart(
  cartId: string,
  lines: { merchandiseId: string; quantity: number }[]
): Promise<Cart> {
  const data = await shopifyFetch<{ cartLinesAdd: { cart: Cart } }>({
    query: ADD_TO_CART_MUTATION,
    variables: { cartId, lines },
  });
  return data.cartLinesAdd.cart;
}

export async function updateCartLine(
  cartId: string,
  lineId: string,
  quantity: number
): Promise<Cart> {
  const data = await shopifyFetch<{ cartLinesUpdate: { cart: Cart } }>({
    query: UPDATE_CART_MUTATION,
    variables: { cartId, lines: [{ id: lineId, quantity }] },
  });
  return data.cartLinesUpdate.cart;
}

export async function removeFromCart(
  cartId: string,
  lineIds: string[]
): Promise<Cart> {
  const data = await shopifyFetch<{ cartLinesRemove: { cart: Cart } }>({
    query: REMOVE_FROM_CART_MUTATION,
    variables: { cartId, lineIds },
  });
  return data.cartLinesRemove.cart;
}
