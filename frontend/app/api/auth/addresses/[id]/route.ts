import { NextRequest, NextResponse } from 'next/server';
import { COOKIE } from '@/lib/shopify/customerAccount';

const SHOP_ID = process.env.SHOPIFY_SHOP_ID!;
const API_URL = `https://shopify.com/authentication/${SHOP_ID}/account/customer/api/2024-10/graphql`;

const UPDATE_MUTATION = `
  mutation customerAddressUpdate($addressId: ID!, $address: CustomerAddressInput!) {
    customerAddressUpdate(addressId: $addressId, address: $address) {
      customerAddress { id address1 address2 city province zip country firstName lastName phone }
      userErrors { field message code }
    }
  }
`;

const DELETE_MUTATION = `
  mutation customerAddressDelete($addressId: ID!) {
    customerAddressDelete(addressId: $addressId) {
      deletedAddressId
      userErrors { field message code }
    }
  }
`;

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const accessToken = req.cookies.get(COOKIE.ACCESS_TOKEN)?.value;
  if (!accessToken) return NextResponse.json({ errors: [{ message: 'Not authenticated' }] }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  const res = await fetch(API_URL, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` },
    body: JSON.stringify({ query: UPDATE_MUTATION, variables: { addressId: id, address: body } }),
  });

  if (!res.ok) return NextResponse.json({ errors: [{ message: 'API error' }] }, { status: 502 });

  const { data, errors } = await res.json();
  if (errors?.length) return NextResponse.json({ errors }, { status: 400 });

  const { customerAddress, userErrors } = data.customerAddressUpdate;
  return NextResponse.json({ address: customerAddress, errors: userErrors ?? [] });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const accessToken = req.cookies.get(COOKIE.ACCESS_TOKEN)?.value;
  if (!accessToken) return NextResponse.json({ errors: [{ message: 'Not authenticated' }] }, { status: 401 });

  const { id } = await params;

  const res = await fetch(API_URL, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` },
    body: JSON.stringify({ query: DELETE_MUTATION, variables: { addressId: id } }),
  });

  if (!res.ok) return NextResponse.json({ errors: [{ message: 'API error' }] }, { status: 502 });

  const { data, errors } = await res.json();
  if (errors?.length) return NextResponse.json({ errors }, { status: 400 });

  const { userErrors } = data.customerAddressDelete;
  return NextResponse.json({ errors: userErrors ?? [] });
}
