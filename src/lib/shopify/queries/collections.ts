import { productFragment } from '../fragments/product';
import { imageFragment } from '../fragments/image';

export const getCollectionsQuery = /* GraphQL */ `
  query getCollections($first: Int!) {
    collections(first: $first) {
      edges {
        node {
          id
          handle
          title
          description
          image {
            ...ImageFields
          }
        }
      }
    }
  }
  ${imageFragment}
`;

export const getCollectionByHandleQuery = /* GraphQL */ `
  query getCollectionByHandle($handle: String!, $first: Int!) {
    collectionByHandle(handle: $handle) {
      id
      handle
      title
      description
      image {
        ...ImageFields
      }
      products(first: $first) {
        edges {
          node {
            ...ProductFields
          }
        }
      }
    }
  }
  ${productFragment}
  ${imageFragment}
`;
