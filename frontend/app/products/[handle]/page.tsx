import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getProductByHandle, getProducts } from '@/lib/shopify';
import ProductDetails from './ProductDetails';
import Footer from '@/components/Footer';

export const revalidate = 60;

export async function generateStaticParams() {
  const products = await getProducts(50);
  return products.map((p) => ({ handle: p.handle }));
}

type Props = { params: Promise<{ handle: string }> };

export default async function ProductPage({ params }: Props) {
  const { handle } = await params;
  const product = await getProductByHandle(handle);
  if (!product) notFound();

  return (
    <>
      <div className="max-w-7xl mx-auto px-6 lg:px-16 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-outline mb-8">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <Link href="/products" className="hover:text-primary transition-colors">Products</Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-on-surface">{product.title}</span>
        </nav>

        <ProductDetails product={product} />
      </div>
      <Footer />
    </>
  );
}
