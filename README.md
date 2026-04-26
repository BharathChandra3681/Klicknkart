# Klicknkart

E-commerce storefront built with Next.js 14 and Shopify Storefront API.

## Setup

**1. Clone the repo**
```bash
git clone https://github.com/BharathChandra3681/Klicknkart.git
cd Klicknkart
```

**2. Install dependencies**
```bash
npm install
```

**3. Configure environment variables**
```bash
cp .env.example .env.local
```
Open `.env.local` and fill in your Shopify credentials:
```
SHOPIFY_STORE_DOMAIN=yourstore.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_token_here
SHOPIFY_REVALIDATION_SECRET=any_random_string
```

> **Getting Shopify credentials:**
> 1. Shopify Admin → Settings → Apps and sales channels → Develop apps
> 2. Create app → Configure Storefront API scopes → Install app
> 3. Copy the **Storefront API access token**

**4. Run the dev server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Tech Stack

- [Next.js 14](https://nextjs.org) — App Router, React Server Components
- [Shopify Storefront API](https://shopify.dev/docs/api/storefront) — GraphQL
- [Tailwind CSS](https://tailwindcss.com)
- [Zustand](https://zustand-demo.pmnd.rs) — Cart state management
