# Halahello — Implementation Task Tracker

## Phase 1 — Database Schema Extensions
- [x] Extend `OrderStatus` enum (PENDING → CONFIRMED → PREPARING → READY_FOR_SHIPPING → SHIPPED → DELIVERED + CANCELLED | FAILED_PAYMENT | REFUNDED)
- [x] Rename `PROCESSING` → `CONFIRMED` with data migration
- [x] Add `whatsappPhone`, `whatsappVerified` to `User`
- [x] Add `Address` model
- [x] Add `PhoneVerification` model
- [x] Add `customization`, `snapshotTitle`, `snapshotImageUrl` to `OrderItem`
- [x] Add `Coupon` model
- [x] Add `CouponUsage` model
- [x] Add `Wishlist` model
- [x] Run `prisma migrate dev` and verify (Manual SQL execution provided)

## Phase 2 — Sanity CMS Schema Extensions
- [x] Extend `product.ts` schema (gallery, slug, variants, specs, customizationFields, etc.)
- [x] Create `promotion.ts` schema
- [x] Create `homepageBanner.ts` schema
- [x] Create `testimonial.ts` schema
- [x] Create `siteSettings.ts` schema
- [x] Create `faq.ts` schema
- [x] Create `shippingSettings.ts` schema
- [x] Register all new schemas in `schemaTypes/index.ts`

## Phase 3 — Sanity Queries Extension
- [x] Extend `SanityProduct` TypeScript interface
- [x] Add new TypeScript interfaces (SanityPromotion, SanityHomepageBanner, etc.)
- [x] Add `getProductBySlug`, `getFeaturedProducts`, `getRelatedProducts`
- [x] Add `getActivePromotions`, `getFeaturedPromotions`, `getHomepageBanners`
- [x] Add `getTestimonials`, `getFAQs`, `getSiteSettings`, `getShippingSettings`

## Phase 4 — WhatsApp OTP Authentication
- [x] Create `lib/services/whatsapp.service.ts`
- [x] Create `app/api/auth/whatsapp/send-otp/route.ts`
- [x] Extend `auth.ts` with WhatsApp credentials provider
- [x] Extend `auth.config.ts` session/JWT callbacks
- [x] Create `app/[locale]/(auth)/login/page.tsx`
- [x] Extend `middleware.ts` (protect /account, /checkout)

## Phase 5 — Product Details Page
- [x] Create `app/[locale]/products/[slug]/page.tsx`
- [x] Create `components/product/ProductGallery.tsx`
- [x] Create `components/product/ProductInfo.tsx`
- [x] Create `components/product/CustomizationForm.tsx`
- [x] Integrate Sanity queries

## Phase 6 — Product Customization (Cart + Checkout + DB)
- [x] Extend `types/cart.ts` with `customization` field
- [x] Extend `lib/stores/cart.store.ts`
- [x] Update cart page to show customization chips
- [x] Update checkout order route to save customization + snapshots
- [x] Update order repository for customization

## Phase 7 — Customer Dashboard
- [x] Create `app/[locale]/account/layout.tsx`
- [x] Create `app/[locale]/account/page.tsx` (Profile)
- [x] Create `app/[locale]/account/orders/page.tsx`
- [x] Create `app/[locale]/account/orders/[id]/page.tsx`
- [x] Create `app/[locale]/account/addresses/page.tsx`
- [x] Create `app/[locale]/account/settings/page.tsx`
- [x] Create `app/api/account/profile/route.ts`
- [x] Create `app/api/account/addresses/route.ts`
- [x] Create `app/api/account/addresses/[id]/route.ts`
- [x] Create `app/api/orders/route.ts`
- [x] Create `app/api/orders/[id]/route.ts`
- [x] Add `getOrdersByUserId`, `getOrderDetailById` to order repository
- [x] Create `lib/repositories/address.repository.ts`

## Phase 8 — Offers & Promotions System
- [x] Create `app/[locale]/offers/page.tsx`
- [x] Create `app/api/promotions/route.ts`
- [x] Create `app/api/promotions/validate-coupon/route.ts`
- [x] Add coupon input to cart/checkout


## Phase 9 — Sanity CMS Integration (Order & Coupon Management)

### Sanity Schemas
- [x] Create `sanity/schemaTypes/order.ts` — read-only order view, admin-editable status
- [x] Create `sanity/schemaTypes/coupon.ts` — fully editable coupon document
- [x] Register both schemas in `sanity/schemaTypes/index.ts`
- [x] Add Orders + Coupons sections to `sanity/structure.ts`

### Sanity Write Client
- [x] Export `writeClient` (token-authenticated, server-only) from `sanity/lib/client.ts`

### Sanity Sync Service (Postgres → Sanity)
- [x] Create `lib/services/sanity-sync.service.ts`
  - [x] `syncOrderToSanity()` — idempotent upsert via `createOrReplace`
  - [x] `patchOrderStatusInSanity()` — lightweight status-only patch
  - [x] `syncCouponToSanity()` — idempotent upsert
  - [x] `syncCouponUsageToSanity()` — patches usedCount after checkout
  - [x] `deleteCouponFromSanity()` — removes coupon document

### Repository Extensions
- [x] Create `lib/repositories/coupon.repository.ts`
  - [x] `getAllCoupons`, `getCouponById`, `getCouponByCode`
  - [x] `createCoupon`, `updateCoupon`, `incrementCouponUsage`, `deleteCoupon`
- [x] Extend `lib/repositories/order.repository.ts`
  - [x] `updateOrderStatus()` — enforces state-machine transitions
  - [x] `isValidStatusTransition()` — exported pure helper
  - [x] `getOrderWithItemsById()` — full sync payload shape
  - [x] `getAllOrdersForAdmin()` — for backfill endpoint

### Webhook Handler (Sanity → Postgres)
- [x] Extend `app/api/webhooks/sanity/route.ts`
  - [x] `_type === 'product'` — existing sync preserved
  - [x] `_type === 'order'` — status update → Postgres (no back-sync)
  - [x] `_type === 'coupon'` — create/update/delete → Postgres (no back-sync)
  - [x] Invalid transition returns 422 (Sanity stops retrying)

### Call-site Sync Integration (Postgres → Sanity)
- [x] `app/api/checkout/order/route.ts` — sync after `createPendingOrder`
- [x] `app/api/webhooks/stripe/route.ts` — sync after confirm / fail / refund

### Coupon Admin API
- [x] Create `app/api/admin/coupons/route.ts` — GET list + POST create + sync
- [x] Create `app/api/admin/coupons/[id]/route.ts` — GET + PATCH + DELETE + sync

### Backfill
- [x] Create `app/api/admin/sync/backfill/route.ts` — one-time idempotent push

### Environment Docs
- [x] Update `.env.example` — `SANITY_API_TOKEN` + `SANITY_WEBHOOK_SECRET`

### Verification
- [x] `npx tsc --noEmit` — zero errors


## Phase 10 — Shared Components Library
- [x] Create `components/ui/` primitives (Button, Badge, Card, Input, Modal, Skeleton, Spinner, Toast, EmptyState, Divider, Avatar)
- [x] Create `components/product/` (ProductCard, VariantSelector, PriceDisplay, StockBadge, WishlistButton)
- [x] Create `components/order/` (OrderStatusBadge, OrderProgressBar, OrderCard, OrderTimeline)
- [x] Create `components/promotions/` (PromotionBanner, OfferCard, CouponInput, CountdownTimer, CopyButton)
- [x] Create `components/layout/` (Navbar, Footer, AccountNav, PageWrapper)
- [x] Wire Navbar + Footer + ToastProvider into `app/[locale]/layout.tsx`
- [x] Refactor `app/[locale]/account/layout.tsx` to use AccountNav
- [x] Refactor `app/[locale]/offers/page.tsx` to use shared components
- [x] `npx tsc --noEmit` — ✅ zero errors


## Phase 11 — UI/UX Polish & Design System
- [x] Extend `app/globals.css` (status colors, animations, print styles, dark mode tokens)
- [x] Update homepage with dynamic Sanity banners, offers section, testimonials
- [x] Apply premium hover effects, page transitions, micro-animations

## Phase 12 — Performance Optimization
- [x] Convert homepage to Server Component
- [x] Add `generateStaticParams` and `generateMetadata` to product pages
- [x] Add Suspense boundaries + Skeleton fallbacks
- [x] Lazy load heavy components
- [x] Optimize Sanity queries

## Phase 13 — Security Hardening
- [x] Create `lib/security.ts` — centralized CSRF origin validation, file upload validation, IP extraction
- [x] Add Zod validation to all API routes (contact, OTP, coupon validation updated to use Zod schemas)
- [x] Extend rate limiting to OTP, checkout, coupon validation, upload, contact endpoints
- [x] Add CSRF origin validation to all state-mutating routes (checkout, coupon, upload, contact, OTP, wishlist, profile, addresses, admin coupons)
- [x] Add file upload validation (MIME type allowlist + 5 MB size cap) via `validateUploadedFile()`
- [x] `npx tsc --noEmit` — ✅ zero errors

## Phase 14 — Environment Variables
- [x] Update `.env.example` with Phase 13 security variable documentation and rate limit notes

## Final Verification
- [ ] `npm run build` — zero errors
- [ ] `npm run lint` — zero ESLint errors
- [ ] `npm test` — all tests pass
- [ ] Manual QA checklist complete
