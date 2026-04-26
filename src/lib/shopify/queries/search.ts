import { productFragment } from '../fragments/product';

export const searchProductsQuery = /* GraphQL */ `
  query searchProducts($query: String!, $first: Int!) {
    products(first: $first, query: $query) {
      edges {
        node {
          ...ProductFields
        }
      }
    }
  }
  ${productFragment}
`;
