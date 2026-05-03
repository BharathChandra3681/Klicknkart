import { NextRequest, NextResponse } from 'next/server';
import { COOKIE } from '@/lib/shopify/customerAccount';

const SHOP_ID  = process.env.SHOPIFY_SHOP_ID!;
const API_URL  = `https://shopify.com/authentication/${SHOP_ID}/account/customer/api/2024-10/graphql`;

const UPDATE_MUTATION = `
  mutation customerUpdate($input: CustomerUpdateInput!) {
    customerUpdate(input: $input) {
      customer {
        id
        firstName
        lastName
        emailAddress { emailAddress }
        phoneNumber   { phoneNumber }
      }
      userErrors { field message code }
    }
  }
`;

export async function POST(req: NextRequest) {
  const accessToken = req.cookies.get(COOKIE.ACCESS_TOKEN)?.value;
  if (!accessToken) {
    return NextResponse.json({ errors: [{ message: 'Not authenticated' }] }, { status: 401 });
  }

  const body = await req.json();
  const { firstName, lastName, emailAddress, phoneNumber } = body;

  const input: Record<string, unknown> = {};
  if (firstName    !== undefined) input.firstName    = firstName;
  if (lastName     !== undefined) input.lastName     = lastName;
  if (emailAddress !== undefined) input.emailAddress = emailAddress;
  if (phoneNumber  !== undefined) input.phoneNumber  = phoneNumber;

  const res = await fetch(API_URL, {
    method:  'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ query: UPDATE_MUTATION, variables: { input } }),
  });

  if (!res.ok) {
    return NextResponse.json({ errors: [{ message: 'API request failed' }] }, { status: 502 });
  }

  const { data, errors } = await res.json();
  if (errors?.length) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  const { customer, userErrors } = data.customerUpdate;
  return NextResponse.json({ customer, errors: userErrors ?? [] });
}
