-- ============================================================
-- Phase 1: Database Schema Extensions
-- Migration: phase1_schema_extensions
-- Run this manually in Supabase SQL Editor if prisma migrate
-- is blocked by network (pooler-only connection).
-- ============================================================

-- 1. Extend OrderStatus enum
--    Rename PROCESSING → CONFIRMED and add new statuses
ALTER TYPE "OrderStatus" RENAME VALUE 'PROCESSING' TO 'CONFIRMED';
ALTER TYPE "OrderStatus" ADD VALUE IF NOT EXISTS 'PREPARING';
ALTER TYPE "OrderStatus" ADD VALUE IF NOT EXISTS 'READY_FOR_SHIPPING';
ALTER TYPE "OrderStatus" ADD VALUE IF NOT EXISTS 'FAILED_PAYMENT';
ALTER TYPE "OrderStatus" ADD VALUE IF NOT EXISTS 'REFUNDED';

-- 2. Add AddressLabel enum
DO $$ BEGIN
  CREATE TYPE "AddressLabel" AS ENUM ('HOME', 'WORK', 'OTHER');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 3. Add DiscountType enum
DO $$ BEGIN
  CREATE TYPE "DiscountType" AS ENUM ('PERCENTAGE', 'FIXED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 4. Extend User table
ALTER TABLE "User"
  ADD COLUMN IF NOT EXISTS "whatsappPhone"    TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS "whatsappVerified" BOOLEAN NOT NULL DEFAULT FALSE;

-- 5. Create PhoneVerification table
CREATE TABLE IF NOT EXISTS "PhoneVerification" (
  "id"        TEXT        NOT NULL,
  "phone"     TEXT        NOT NULL,
  "code"      TEXT        NOT NULL,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "used"      BOOLEAN     NOT NULL DEFAULT FALSE,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "PhoneVerification_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "PhoneVerification_phone_idx" ON "PhoneVerification"("phone");

-- 6. Extend Order table
ALTER TABLE "Order"
  ADD COLUMN IF NOT EXISTS "couponId"       TEXT,
  ADD COLUMN IF NOT EXISTS "discountAmount" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- Add indexes to Order
CREATE INDEX IF NOT EXISTS "Order_userId_idx"    ON "Order"("userId");
CREATE INDEX IF NOT EXISTS "Order_status_idx"    ON "Order"("status");
CREATE INDEX IF NOT EXISTS "Order_createdAt_idx" ON "Order"("createdAt");

-- 7. Extend OrderItem table
ALTER TABLE "OrderItem"
  ADD COLUMN IF NOT EXISTS "snapshotTitle"    TEXT,
  ADD COLUMN IF NOT EXISTS "snapshotImageUrl" TEXT,
  ADD COLUMN IF NOT EXISTS "customization"    JSONB;

-- 8. Create Address table
CREATE TABLE IF NOT EXISTS "Address" (
  "id"           TEXT          NOT NULL,
  "userId"       TEXT          NOT NULL,
  "label"        "AddressLabel" NOT NULL DEFAULT 'HOME',
  "fullName"     TEXT          NOT NULL,
  "phone"        TEXT          NOT NULL,
  "addressLine1" TEXT          NOT NULL,
  "addressLine2" TEXT,
  "city"         TEXT          NOT NULL,
  "country"      TEXT          NOT NULL DEFAULT 'Syria',
  "isDefault"    BOOLEAN       NOT NULL DEFAULT FALSE,
  "createdAt"    TIMESTAMP(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"    TIMESTAMP(3)  NOT NULL,

  CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "Address_userId_idx" ON "Address"("userId");
ALTER TABLE "Address"
  ADD CONSTRAINT "Address_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE;

-- 9. Create Coupon table
CREATE TABLE IF NOT EXISTS "Coupon" (
  "id"             TEXT          NOT NULL,
  "code"           TEXT          NOT NULL,
  "description"    TEXT,
  "discountType"   "DiscountType" NOT NULL,
  "discountValue"  DOUBLE PRECISION NOT NULL,
  "minOrderAmount" DOUBLE PRECISION,
  "maxUses"        INTEGER,
  "usedCount"      INTEGER       NOT NULL DEFAULT 0,
  "expiresAt"      TIMESTAMP(3),
  "isActive"       BOOLEAN       NOT NULL DEFAULT TRUE,
  "createdAt"      TIMESTAMP(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"      TIMESTAMP(3)  NOT NULL,

  CONSTRAINT "Coupon_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "Coupon_code_key" ON "Coupon"("code");

-- 10. Create CouponUsage table
CREATE TABLE IF NOT EXISTS "CouponUsage" (
  "id"        TEXT         NOT NULL,
  "couponId"  TEXT         NOT NULL,
  "userId"    TEXT,
  "orderId"   TEXT         NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "CouponUsage_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "CouponUsage_couponId_orderId_key" ON "CouponUsage"("couponId", "orderId");
CREATE INDEX IF NOT EXISTS "CouponUsage_couponId_idx" ON "CouponUsage"("couponId");
CREATE INDEX IF NOT EXISTS "CouponUsage_userId_idx"   ON "CouponUsage"("userId");
ALTER TABLE "CouponUsage"
  ADD CONSTRAINT "CouponUsage_couponId_fkey"
    FOREIGN KEY ("couponId") REFERENCES "Coupon"("id") ON DELETE CASCADE,
  ADD CONSTRAINT "CouponUsage_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL,
  ADD CONSTRAINT "CouponUsage_orderId_fkey"
    FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE;

-- Link Order → Coupon FK (now that Coupon table exists)
ALTER TABLE "Order"
  ADD CONSTRAINT "Order_couponId_fkey"
    FOREIGN KEY ("couponId") REFERENCES "Coupon"("id") ON DELETE SET NULL;

-- 11. Create Wishlist table
CREATE TABLE IF NOT EXISTS "Wishlist" (
  "id"              TEXT         NOT NULL,
  "userId"          TEXT         NOT NULL,
  "sanityProductId" TEXT         NOT NULL,
  "createdAt"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "Wishlist_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "Wishlist_userId_sanityProductId_key" ON "Wishlist"("userId", "sanityProductId");
CREATE INDEX IF NOT EXISTS "Wishlist_userId_idx" ON "Wishlist"("userId");
ALTER TABLE "Wishlist"
  ADD CONSTRAINT "Wishlist_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE;
