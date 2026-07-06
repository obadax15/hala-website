/**
 * Creates the initial admin user in Supabase.
 * Run: node prisma/seed-admin.js
 *
 * Credentials: admin@halahello.com / Halahello@2026!
 * CHANGE THE PASSWORD after first login!
 */

const { Client } = require('pg');
const crypto = require('crypto');

async function hashPassword(password) {
  // Simple SHA-256 hash for seeding — argon2 requires build tools
  // The app uses argon2 at login time, so we need the actual argon2 hash.
  // We'll use a known argon2 hash for the password "Halahello@2026!"
  // Generated offline: argon2id with default params
  // For production, generate this properly with: node -e "require('argon2').hash('yourpassword').then(console.log)"
  return '$argon2id$v=19$m=65536,t=3,p=4$placeholder_hash_see_note_below';
}

async function seedAdmin() {
  // We need to generate the argon2 hash first using the installed package
  let hash;
  try {
    const argon2 = require('argon2');
    hash = await argon2.hash('Halahello@2026!');
    console.log('✅ Argon2 hash generated');
  } catch (e) {
    console.error('❌ argon2 not available:', e.message);
    console.log('Run: node -e "require(\'argon2\').hash(\'YourPassword\').then(console.log)"');
    process.exit(1);
  }

  const client = new Client({
    connectionString:
      process.env.DATABASE_URL ||
      'postgresql://postgres.wqzqcgtxjxrkoqgdnsbh:obadaraw221@aws-0-eu-central-1.pooler.supabase.com:6543/postgres',
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    console.log('✅ Connected to Supabase\n');

    const id = crypto.randomUUID();
    const result = await client.query(
      `INSERT INTO "User" (id, name, email, "passwordHash", role, "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, 'ADMIN', NOW(), NOW())
       ON CONFLICT (email) DO UPDATE
         SET "passwordHash" = EXCLUDED."passwordHash",
             role = 'ADMIN',
             "updatedAt" = NOW()
       RETURNING id, email, role`,
      [id, 'Admin', 'admin@halahello.com', hash]
    );

    const admin = result.rows[0];
    console.log('🔑 Admin user created/updated:');
    console.log('   Email:', admin.email);
    console.log('   Role:', admin.role);
    console.log('   ID:', admin.id);
    console.log('\n📋 Login credentials:');
    console.log('   URL:      http://localhost:3000/en/admin/login');
    console.log('   Email:    admin@halahello.com');
    console.log('   Password: Halahello@2026!');
    console.log('\n⚠️  CHANGE PASSWORD AFTER FIRST LOGIN!');

  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

seedAdmin();
