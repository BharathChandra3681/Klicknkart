import { shopifyFetch } from './client';
import {
  GET_PRODUCTS_QUERY,
  GET_PRODUCT_BY_HANDLE_QUERY,
  SEARCH_PRODUCTS_QUERY,
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
import {
  CUSTOMER_CREATE_MUTATION,
  CUSTOMER_ACCESS_TOKEN_CREATE,
  CUSTOMER_ACCESS_TOKEN_DELETE,
  GET_CUSTOMER_QUERY,
  CUSTOMER_RECOVER_MUTATION,
  CUSTOMER_UPDATE_MUTATION,
  CUSTOMER_ADDRESS_CREATE_MUTATION,
  CUSTOMER_ADDRESS_UPDATE_MUTATION,
  CUSTOMER_ADDRESS_DELETE_MUTATION,
} from './queries/customer';
import type {
  Cart, Collection, Product, ShopifyConnection,
  Customer, CustomerAccessToken, CustomerUserError, CustomerAddress,
} from './types';

// ── Products ─────────────────────────────────────────────────────────────────

export async function getProducts(
  first = 24,
  after?: string,
): Promise<{ products: Product[]; pageInfo: { hasNextPage: boolean; endCursor: string | null } }> {
  try {
    const data = await shopifyFetch<{ products: ShopifyConnection<Product> }>({
      query: GET_PRODUCTS_QUERY, variables: { first, after },
    });
    return {
      products: data.products.edges.map((e) => e.node),
      pageInfo: {
        hasNextPage: data.products.pageInfo?.hasNextPage ?? false,
        endCursor:   data.products.pageInfo?.endCursor   ?? null,
      },
    };
  } catch { return { products: [], pageInfo: { hasNextPage: false, endCursor: null } }; }
}

export async function getProductByHandle(handle: string): Promise<Product | null> {
  try {
    const data = await shopifyFetch<{ productByHandle: Product | null }>({
      query: GET_PRODUCT_BY_HANDLE_QUERY, variables: { handle },
    });
    return data.productByHandle;
  } catch { return null; }
}

export async function searchProducts(query: string, first = 24): Promise<Product[]> {
  try {
    const data = await shopifyFetch<{ products: ShopifyConnection<Product> }>({
      query: SEARCH_PRODUCTS_QUERY, variables: { query, first },
    });
    return data.products.edges.map((e) => e.node);
  } catch { return []; }
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

export async function getCollectionByHandle(
  handle: string,
  first = 24,
  after?: string,
): Promise<{ collection: Collection; hasNextPage: boolean; endCursor: string | null } | null> {
  try {
    const data = await shopifyFetch<{ collectionByHandle: Collection | null }>({
      query: GET_COLLECTION_BY_HANDLE_QUERY, variables: { handle, first, after },
    });
    if (!data.collectionByHandle) return null;
    const col = data.collectionByHandle;
    return {
      collection:  col,
      hasNextPage: col.products.pageInfo?.hasNextPage ?? false,
      endCursor:   col.products.pageInfo?.endCursor   ?? null,
    };
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

// ── Customer Auth ─────────────────────────────────────────────────────────────

export async function createCustomer(input: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  acceptsMarketing?: boolean;
}): Promise<{ customer: Customer | null; errors: CustomerUserError[] }> {
  const data = await shopifyFetch<{
    customerCreate: { customer: Customer | null; customerUserErrors: CustomerUserError[] };
  }>({
    query: CUSTOMER_CREATE_MUTATION,
    variables: { input },
  });
  return {
    customer: data.customerCreate.customer,
    errors: data.customerCreate.customerUserErrors,
  };
}

export async function loginCustomer(email: string, password: string): Promise<{
  accessToken: CustomerAccessToken | null;
  errors: CustomerUserError[];
}> {
  const data = await shopifyFetch<{
    customerAccessTokenCreate: {
      customerAccessToken: CustomerAccessToken | null;
      customerUserErrors: CustomerUserError[];
    };
  }>({
    query: CUSTOMER_ACCESS_TOKEN_CREATE,
    variables: { input: { email, password } },
  });
  return {
    accessToken: data.customerAccessTokenCreate.customerAccessToken,
    errors: data.customerAccessTokenCreate.customerUserErrors,
  };
}

export async function logoutCustomer(accessToken: string): Promise<void> {
  await shopifyFetch({
    query: CUSTOMER_ACCESS_TOKEN_DELETE,
    variables: { customerAccessToken: accessToken },
  });
}

export async function getCustomer(accessToken: string): Promise<Customer | null> {
  try {
    const data = await shopifyFetch<{ customer: Customer | null }>({
      query: GET_CUSTOMER_QUERY,
      variables: { customerAccessToken: accessToken },
    });
    return data.customer;
  } catch { return null; }
}

export async function recoverCustomer(email: string): Promise<CustomerUserError[]> {
  const data = await shopifyFetch<{
    customerRecover: { customerUserErrors: CustomerUserError[] };
  }>({
    query: CUSTOMER_RECOVER_MUTATION,
    variables: { email },
  });
  return data.customerRecover.customerUserErrors;
}

export async function updateCustomer(
  accessToken: string,
  customer: { firstName?: string; lastName?: string; email?: string; phone?: string; password?: string; acceptsMarketing?: boolean },
): Promise<{ customer: Customer | null; errors: CustomerUserError[] }> {
  const data = await shopifyFetch<{
    customerUpdate: { customer: Customer | null; customerUserErrors: CustomerUserError[] };
  }>({
    query: CUSTOMER_UPDATE_MUTATION,
    variables: { customerAccessToken: accessToken, customer },
  });
  return {
    customer: data.customerUpdate.customer,
    errors: data.customerUpdate.customerUserErrors,
  };
}

type AddressInput = {
  firstName?: string; lastName?: string;
  address1?: string; address2?: string;
  city?: string; province?: string; zip?: string; country?: string;
  phone?: string;
};

export async function createCustomerAddress(
  accessToken: string, address: AddressInput,
): Promise<{ address: CustomerAddress | null; errors: CustomerUserError[] }> {
  const data = await shopifyFetch<{
    customerAddressCreate: { customerAddress: CustomerAddress | null; customerUserErrors: CustomerUserError[] };
  }>({
    query: CUSTOMER_ADDRESS_CREATE_MUTATION,
    variables: { customerAccessToken: accessToken, address },
  });
  return {
    address: data.customerAddressCreate.customerAddress,
    errors: data.customerAddressCreate.customerUserErrors,
  };
}

export async function updateCustomerAddress(
  accessToken: string, id: string, address: AddressInput,
): Promise<CustomerUserError[]> {
  const data = await shopifyFetch<{
    customerAddressUpdate: { customerUserErrors: CustomerUserError[] };
  }>({
    query: CUSTOMER_ADDRESS_UPDATE_MUTATION,
    variables: { customerAccessToken: accessToken, id, address },
  });
  return data.customerAddressUpdate.customerUserErrors;
}

export async function deleteCustomerAddress(
  accessToken: string, id: string,
): Promise<CustomerUserError[]> {
  const data = await shopifyFetch<{
    customerAddressDelete: { customerUserErrors: CustomerUserError[] };
  }>({
    query: CUSTOMER_ADDRESS_DELETE_MUTATION,
    variables: { customerAccessToken: accessToken, id },
  });
  return data.customerAddressDelete.customerUserErrors;
}
