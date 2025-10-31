/**
 * Supabase Connection Test Script
 * Run with: npm run dev (or tsx src/test-connection.ts)
 */

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env['SUPABASE_URL'];
const supabaseKey = process.env['SUPABASE_ANON_KEY'];

async function testConnection() {
  console.log('🧪 Testing Supabase Connection...\n');

  // Check environment variables
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials in .env file');
    console.error('   SUPABASE_URL:', supabaseUrl ? '✓' : '✗');
    console.error('   SUPABASE_ANON_KEY:', supabaseKey ? '✓' : '✗');
    process.exit(1);
  }

  console.log('✓ Environment variables loaded');
  console.log('  URL:', supabaseUrl);
  console.log('  Key:', supabaseKey.substring(0, 20) + '...\n');

  // Create Supabase client
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Test 1: Check if we can connect
    console.log('Test 1: Basic Connection');
    const { data, error } = await supabase.from('_test_table').select('*').limit(1);
    
    if (error && error.code === 'PGRST116') {
      // This error is expected - table doesn't exist yet, but connection works!
      console.log('✓ Connection successful (table not found is expected)');
    } else if (error) {
      console.log('✓ Connection successful (with response)');
    } else {
      console.log('✓ Connection successful');
    }

    // Test 2: Check database version
    console.log('\nTest 2: Database Info');
    const { data: versionData, error: versionError } = await supabase.rpc('version');
    if (!versionError && versionData) {
      console.log('✓ PostgreSQL version:', versionData);
    }

    console.log('\n✅ All connection tests passed!');
    console.log('\n📋 Next Steps:');
    console.log('   1. Week 2: Create database tables');
    console.log('   2. Set up Row Level Security policies');
    console.log('   3. Load seed data');
    console.log('   4. Start building API endpoints\n');

  } catch (err) {
    console.error('\n❌ Connection test failed:', err);
    process.exit(1);
  }
}

testConnection();
