# Goal Description

Currently, when you add a new product in Sanity Studio, it appears on the website but lacks a price and an "Add to Cart" button. This happens because the product is missing a corresponding record in the Supabase database, which tracks prices and inventory stock (as per the Hybrid Architecture we chose). 

To fix this and make adding products effortless, we will add a `price` field directly to Sanity Studio. When you publish a product in Sanity, the website will automatically detect it and create the necessary database records in Supabase behind the scenes.

## User Review Required

> [!IMPORTANT]
> **Data Flow Change**
> You will now enter the **Price** directly in Sanity Studio when creating a product. The website will automatically sync this price to Supabase the first time the product is loaded.

## Open Questions

None at this time.

## Proposed Changes

### Sanity Schema
We will update the Sanity product schema to include a `price` field so you can set the price in the same place you upload the image.

#### [MODIFY] [product.ts](file:///f:/halahello_website/sanity/schemaTypes/product.ts)
- Add a `price` field of type `number`.

#### [MODIFY] [queries.ts](file:///f:/halahello_website/sanity/lib/queries.ts)
- Update `PRODUCTS_QUERY` to also fetch the `price` field.

### Next.js API & Frontend

#### [NEW] [route.ts](file:///f:/halahello_website/app/api/products/sync/route.ts)
- Create a new API route `/api/products/sync` that accepts products from Sanity.
- If the product doesn't exist in Supabase, it will auto-create the `ProductSync` record using the price provided in Sanity.

#### [MODIFY] [page.tsx](file:///f:/halahello_website/app/%5Blocale%5D/page.tsx)
- Check if any Sanity products are missing from the `dbProducts` list.
- If missing, automatically call `/api/products/sync` to create them in the database, then update the UI so the "Add" button appears instantly.
- Fallback to displaying the Sanity price if the database fetch is still syncing.

## Verification Plan

### Manual Verification
1. Open Sanity Studio.
2. Edit the "hijab rose" product and set a price (e.g., 55000).
3. Refresh the homepage.
4. Verify that the "Add" button and the price appear immediately without needing manual database entry.
