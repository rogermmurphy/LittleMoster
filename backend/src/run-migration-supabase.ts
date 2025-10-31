/**
 * Run database migration using Supabase Client
 * Zero Tolerance Testing: Deploy → Test → Remediate
 */

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

const supabaseUrl = process.env['SUPABASE_URL'];
const supabaseServiceKey = process.env['SUPABASE_SERVICE_ROLE_KEY'];

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials');
  console.error('   Required: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

console.log('🚀 Running database migration via Supabase Client...\n');
console.log('📍 Project URL:', supabaseUrl);

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function executeSQLStatement(sql: string, description: string): Promise<void> {
  try {
    const { data, error } = await supabase.rpc('exec_sql', { query: sql });
    
    if (error) {
      console.error(`❌ Failed: ${description}`);
      console.error('   Error:', error.message);
      throw error;
    }
    
    console.log(`✅ ${description}`);
  } catch (err: any) {
    console.error(`❌ Failed: ${description}`);
    throw err;
  }
}

async function runMigration() {
  try {
    console.log('🔗 Connecting to Supabase...\n');
    
    // Read migration file
    const migrationPath = join(__dirname, '../database/migrations/001_initial_schema.sql');
    const fullSQL = readFileSync(migrationPath, 'utf-8');

    console.log('📄 Migration file loaded (001_initial_schema.sql)');
    console.log('📊 Executing migration in steps...\n');

    // Split into logical sections and execute
    const statements = [
      {
        name: '1. Enable UUID extension',
        sql: 'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";'
      },
      {
        name: '2-17. Create 16 tables',
        sql: fullSQL.split('-- ============================================================================')[1] + 
             fullSQL.split('-- ============================================================================')[2] + 
             fullSQL.split('-- ============================================================================')[3]
      }
    ];

    // Execute full SQL at once (Supabase can handle it)
    console.log('📤 Uploading full migration SQL...');
    
    const { error } = await supabase.rpc('exec_sql', { query: fullSQL });
    
    if (error) {
      console.error('\n❌ Migration failed:', error.message);
      console.error('\n🔧 Troubleshooting:');
      console.error('   • Check if exec_sql function exists in your Supabase project');
      console.error('   • Verify SUPABASE_SERVICE_ROLE_KEY has admin permissions');
      console.error('   • Try running SQL manually in Supabase SQL Editor\n');
      process.exit(1);
    }

    console.log('\n✅ Migration completed successfully!\n');
    
    // Verify tables were created
    console.log('🔍 Verifying tables...');
    const { data: tables, error: tableError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .order('table_name');

    if (tableError) {
      console.log('⚠️  Could not verify tables (but migration may have succeeded)');
    } else if (tables) {
      console.log(`\n📋 ${tables.length} tables found:`);
      tables.forEach((row: any, index: number) => {
        console.log(`  ${String(index + 1).padStart(2, ' ')}. ${row.table_name}`);
      });
    }

    console.log('\n🎉 Database is ready for use!');
    console.log('\n📝 Next steps:');
    console.log('   1. Test INSERT operations');
    console.log('   2. Verify relationships');
    console.log('   3. Build authentication API\n');

  } catch (err: any) {
    console.error('\n❌ Fatal error:', err.message);
    console.error('\n💡 Alternative: Run SQL manually in Supabase SQL Editor');
    console.error('   URL: https://supabase.com/dashboard/project/itqymuvrqciabsnaitnw/sql/new\n');
    process.exit(1);
  }
}

runMigration();
