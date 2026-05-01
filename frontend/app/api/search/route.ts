import { NextRequest, NextResponse } from 'next/server';
import { searchProducts } from '@/lib/shopify';

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q') ?? '';
  if (!q.trim()) return NextResponse.json({ products: [] });
  const products = await searchProducts(q, 24);
  return NextResponse.json({ products });
}
