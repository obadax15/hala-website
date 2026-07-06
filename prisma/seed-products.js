/**
 * Seed script: inserts demo products into the ProductSync table.
 * Run with: node prisma/seed-products.js
 *
 * Product sanityId convention: "hijab-{slug}" or "plexi-{slug}"
 * These bridge the static image assets with the backend pricing/stock data.
 */

const { Client } = require('pg');

const products = [
  // Hijab collection
  { sanityId: 'hijab-rose-silk', price: 85, stock: 12 },
  { sanityId: 'hijab-moon-drape', price: 92, stock: 8 },
  { sanityId: 'hijab-golden-hour', price: 78, stock: 15 },
  { sanityId: 'hijab-desert-bloom', price: 88, stock: 6 },
  // Plexi collection
  { sanityId: 'plexi-wedding-arch', price: 320, stock: 3 },
  { sanityId: 'plexi-name-frame', price: 145, stock: 10 },
  { sanityId: 'plexi-floral-box', price: 195, stock: 5 },
  { sanityId: 'plexi-gift-set', price: 255, stock: 7 },
  { sanityId: 'plexi-mirror-sign', price: 175, stock: 4 },
  { sanityId: 'plexi-shadow-box', price: 220, stock: 3 },
];

async function seed() {
  const client = new Client({
    connectionString:
      process.env.DATABASE_URL ||
      'postgresql://postgres.wqzqcgtxjxrkoqgdnsbh:obadaraw221@aws-0-eu-central-1.pooler.supabase.com:6543/postgres',
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log('🔌 Connecting to Supabase...');
    await client.connect();
    console.log('✅ Connected!\n');

    let inserted = 0;
    let skipped = 0;

    for (const product of products) {
      // Use upsert (INSERT ... ON CONFLICT DO NOTHING to avoid duplicates)
      const result = await client.query(
        `INSERT INTO "ProductSync" (id, "sanityId", price, stock, "isActive", "createdAt", "updatedAt")
         VALUES (
           gen_random_uuid()::text,
           $1, $2, $3, true,
           NOW(), NOW()
         )
         ON CONFLICT ("sanityId") DO UPDATE
           SET price = EXCLUDED.price,
               stock = EXCLUDED.stock,
               "updatedAt" = NOW()
         RETURNING "sanityId", price, stock`,
        [product.sanityId, product.price, product.stock]
      );

      if (result.rows.length > 0) {
        console.log(`  ✔ ${result.rows[0].sanityId} — $${result.rows[0].price} (stock: ${result.rows[0].stock})`);
        inserted++;
      }
    }

    console.log(`\n🌱 Seeding complete: ${inserted} products upserted, ${skipped} skipped.`);
  } catch (err) {
    console.error('❌ Error seeding products:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

seed();
