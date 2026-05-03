import { NextRequest, NextResponse } from 'next/server';
import { COOKIE } from '@/lib/shopify/customerAccount';

const SHOP_ID = process.env.SHOPIFY_SHOP_ID!;
const API_URL = `https://shopify.com/authentication/${SHOP_ID}/account/customer/api/2024-10/graphql`;

const CREATE_MUTATION = `
  mutation customerAddressCreate($address: CustomerAddressInput!) {
    customerAddressCreate(address: $address) {
      customerAddress { id address1 address2 city province zip country firstName lastName phone }
      userErrors { field message code }
    }
  }
`;

export async function POST(req: NextRequest) {
  const accessToken = req.cookies.get(COOKIE.ACCESS_TOKEN)?.value;
  if (!accessToken) return NextResponse.json({ errors: [{ message: 'Not authenticated' }] }, { status: 401 });

  const body = await req.json();

  const res = await fetch(API_URL, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` },
    body: JSON.stringify({ query: CREATE_MUTATION, variables: { address: body } }),
  });

  if (!res.ok) return NextResponse.json({ errors: [{ message: 'API error' }] }, { status: 502 });

  const { data, errors } = await res.json();
  if (errors?.length) return NextResponse.json({ errors }, { status: 400 });

  const { customerAddress, userErrors } = data.customerAddressCreate;
  return NextResponse.json({ address: customerAddress, errors: userErrors ?? [] });
}
