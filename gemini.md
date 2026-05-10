# Gemini Project Overview: Klicknkart

This document provides a summary of the Klicknkart project to assist with development.

## 1. Project Overview

Klicknkart is an e-commerce storefront built with Next.js and the Shopify Storefront API. It provides a modern, fast, and user-friendly interface for an online store.

## 2. Tech Stack

*   **Framework:** [Next.js](https://nextjs.org) (using the App Router)
*   **E-commerce Platform:** [Shopify Storefront API](https://shopify.dev/docs/api/storefront) (GraphQL)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com)
*   **State Management:** [Zustand](https://zustand-demo.pmnd.rs) (for cart state)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)

## 3. Project Structure

The project seems to contain two Next.js applications, one in the root directory and one in the `frontend` directory. The `frontend` directory appears to be the main application.

*   `frontend/`: The main Next.js application.
    *   `app/`: Contains the pages of the application, following the App Router structure.
        *   `app/api/`: API routes for authentication and other backend functions.
        *   `app/account/`: Pages for user account management (login, register, etc.).
        *   `app/products/`: Pages for displaying products.
        *   `app/cart/`: The shopping cart page.
    *   `components/`: Reusable React components used throughout the application.
    *   `lib/shopify/`: Contains the logic for interacting with the Shopify Storefront API, including the client, queries, and type definitions.
    *   `context/`: React context providers for managing global state (cart and customer information).
*   `scripts/`: Contains scripts for seeding the Shopify store with product data.
*   **Root Directory:** Contains a separate Next.js project. Its purpose is not entirely clear from the file structure alone, but it may be a work-in-progress, a different version of the application, or for a different purpose.

## 4. Key Files

*   `frontend/package.json`: Defines the dependencies and scripts for the main frontend application.
*   `frontend/next.config.ts`: The Next.js configuration file for the frontend application.
*   `frontend/app/layout.tsx`: The main layout component for the application.
*   `.env.example`: A template for the required environment variables.
*   `scripts/seed-shopify.mjs`: A script for seeding product data into Shopify.

## 5. Development Workflow

To run the frontend application in a development environment:

1.  Navigate to the `frontend` directory: `cd frontend`
2.  Install the dependencies: `npm install`
3.  Copy the environment variable template: `cp .env.example .env.local`
4.  Fill in the required Shopify credentials in `.env.local`.
5.  Start the development server: `npm run dev`

The application will be available at [http://localhost:3000](http://localhost:3000).
