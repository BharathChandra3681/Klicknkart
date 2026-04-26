export interface ShopifyImage {
  url: string;
  altText: string | null;
  width: number;
  height: number;
}

export interface Money {
  amount: string;
  currencyCode: string;
}

export interface ProductOption {
  id: string;
  name: string;
  values: string[];
}

export interface ProductVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: { name: string; value: string }[];
  price: Money;
  compareAtPrice: Money | null;
}

export interface Product {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  availableForSale: boolean;
  featuredImage: ShopifyImage | null;
  images: { edges: { node: ShopifyImage }[] };
  priceRange: {
    minVariantPrice: Money;
    maxVariantPrice: Money;
  };
  options: ProductOption[];
  variants: { edges: { node: ProductVariant }[] };
  tags: string[];
  vendor: string;
}

export interface Collection {
  id: string;
  handle: string;
  title: string;
  description: string;
  image: ShopifyImage | null;
  products: { edges: { node: Product }[] };
}

export interface CartLine {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    product: Pick<Product, 'id' | 'handle' | 'title' | 'featuredImage'>;
    selectedOptions: { name: string; value: string }[];
  };
  cost: {
    totalAmount: Money;
    subtotalAmount: Money;
  };
}

export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  lines: { edges: { node: CartLine }[] };
  cost: {
    subtotalAmount: Money;
    totalAmount: Money;
    totalTaxAmount: Money | null;
  };
}

export interface ShopifyError {
  message: string;
  locations?: { line: number; column: number }[];
  path?: string[];
}
