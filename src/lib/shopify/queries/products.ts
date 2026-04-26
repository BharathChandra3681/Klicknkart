import { productFragment } from '../fragments/product';

export const getProductsQuery = /* GraphQL */ `
  query getProducts($first: Int!, $sortKey: ProductSortKeys, $reverse: Boolean) {
    products(first: $first, sortKey: $sortKey, reverse: $reverse) {
      edges {
        node {
          ...ProductFields
        }
      }
    }
  }
  ${productFragment}
`;

export const getProductByHandleQuery = /* GraphQL */ `
  query getProductByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      ...ProductFields
    }
  }
  ${productFragment}
`;

export const getProductHandlesQuery = /* GraphQL */ `
  query getProductHandles($first: Int!) {
    products(first: $first) {
      edges {
        node {
          handle
        }
      }
    }
  }
`;
