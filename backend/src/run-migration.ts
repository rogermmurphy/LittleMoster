/**
 * Run database migration on Supabase
 * Zero Tolerance Testing: Deploy → Test → Remediate
 */

import 'dotenv/config';
import { Client } from 'pg';
import { readFileSync } from 'fs';
import { join } from 'path';

const databaseUrl = process.env['DATABASE_URL'];

if (!databaseUrl) {
  console.error('❌ Missing DATABASE_URL in environment');
  process.exit(1);
}

async function runMigration() {
  const client = new Client({
    connectionString: databaseUrl,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('🚀 Running database migration...\n');
    console.log('🔗 Connecting to Supabase PostgreSQL...');
    
    await client.connect();
    console.log('✅ Connected to database\n');

    // Read migration file
    const migrationPath = join(__dirname, '../database/migrations/001_initial_schema.sql');
    const sql = readFileSync(migrationPath, 'utf-8');

    console.log('📄 Migration file loaded (001_initial_schema.sql)');
    console.log('📊 Creating 16 tables with RLS policies, triggers, and indexes...\n');

    // Execute migration
    await client.query(sql);

    console.log('✅ Migration completed successfully!\n');
    
    // Verify tables were created
    console.log('🔍 Verifying tables...');
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);

    console.log(`\n📋 ${result.rows.length} tables created:`);
    result.rows.forEach((row, index) => {
      console.log(`  ${String(index + 1).padStart(2, ' ')}. ${row.table_name}`);
    });

    console.log('\n🎉 Database is ready for use!');
    console.log('\n📝 Next steps:');
    console.log('   1. Test INSERT operations');
    console.log('   2. Verify relationships');
    console.log('   3. Build authentication API\n');

  } catch (err: any) {
    console.error('\n❌ Migration failed:', err.message);
    console.error('\n🔧 Troubleshooting:');
    console.error('   • Check DATABASE_URL in backend/.env');
    console.error('   • Verify Supabase project is accessible');
    console.error('   • Check SQL syntax in migration file\n');
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigration();
