# Production Deployment Checklist

This document tracks the manual configurations required when Halahello goes live to production.

## 1. Sanity Webhook Configuration
Since we are using a Webhook to sync product prices and inventory to Supabase, you must recreate the webhook in Sanity for the production environment.

**Steps:**
1. Go to your Sanity Project Dashboard ([manage.sanity.io](https://manage.sanity.io/)).
2. Navigate to **API** -> **Webhooks** -> **Add Webhook**.
3. **Name:** `Production Product Sync`
4. **URL:** `https://<YOUR-PRODUCTION-DOMAIN.com>/api/webhooks/sanity` *(Replace with your actual live domain)*
5. **Trigger on:** Select **Create**, **Update**, and **Delete**.
6. **Filter:** `_type == "product"`
7. **Secret:** Generate a strong random string (e.g., `prod-secret-halahello-9922`) and paste it here.
8. Click **Save**.

## 2. Production Environment Variables (Vercel)
You must add the exact same secret you created in Step 1 to your hosting provider (e.g., Vercel).

**Steps:**
1. Go to your Vercel Project Dashboard.
2. Navigate to **Settings** -> **Environment Variables**.
3. Add a new variable:
   - **Key:** `SANITY_WEBHOOK_SECRET`
   - **Value:** `<The exact secret string you put in Sanity>`
4. Trigger a new deployment so the server picks up the environment variable.

## 3. Sanity CORS Origins (For Sanity Studio)
If you plan to access Sanity Studio from your live domain (e.g., `https://<YOUR-PRODUCTION-DOMAIN.com>/studio`), you must whitelist it.

**Steps:**
1. Go to Sanity Project Dashboard -> **API** -> **CORS Origins**.
2. Click **Add CORS origin**.
3. **Origin:** `https://<YOUR-PRODUCTION-DOMAIN.com>`
4. Check **Allow credentials** (this is required so you can log in).
5. Click **Save**.

## 4. Initial Database Sync
Since the webhook only fires *when you click publish*, any products you added to Sanity *before* setting up the production webhook won't be in your production Supabase database yet.

**To sync existing products to production:**
1. After completing steps 1 & 2, log in to your Production Sanity Studio.
2. Open every existing product you want to sell.
3. Make a tiny invisible edit (like adding a space to the end of a word and removing it) and click **Publish**.
4. This will force Sanity to fire the webhook to your production server and sync the product to the live database!
