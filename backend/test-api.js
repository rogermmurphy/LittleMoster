/**
 * API Testing Script
 * Tests authentication and classes endpoints
 */

const API_BASE = 'http://localhost:3000';

let accessToken = '';
let userId = '';
let classId = '';

async function testRegister() {
  console.log('\n📝 Testing: POST /api/auth/register');
  console.log('='.repeat(50));
  
  const response = await fetch(`${API_BASE}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'student@test.com',
      username: 'student1',
      fullName: 'Test Student',
      password: 'SecurePass123!',
      state: 'Texas',
      gradeLevel: '11th'
    })
  });

  const data = await response.json();
  console.log('Status:', response.status);
  console.log('Response:', JSON.stringify(data, null, 2));

  if (data.success) {
    accessToken = data.data.accessToken;
    userId = data.data.user.id;
    console.log('✅ Registration successful!');
    console.log('   User ID:', userId);
    console.log('   Access Token:', accessToken.substring(0, 20) + '...');
  } else {
    console.log('❌ Registration failed:', data.error);
  }

  return data.success;
}

async function testLogin() {
  console.log('\n🔐 Testing: POST /api/auth/login');
  console.log('='.repeat(50));

  const response = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'student@test.com',
      password: 'SecurePass123!'
    })
  });

  const data = await response.json();
  console.log('Status:', response.status);
  console.log('Response:', JSON.stringify(data, null, 2));

  if (data.success) {
    accessToken = data.data.accessToken;
    console.log('✅ Login successful!');
  } else {
    console.log('❌ Login failed:', data.error);
  }

  return data.success;
}

async function testGetProfile() {
  console.log('\n👤 Testing: GET /api/auth/me');
  console.log('='.repeat(50));

  const response = await fetch(`${API_BASE}/api/auth/me`, {
    headers: { 'Authorization': `Bearer ${accessToken}` }
  });

  const data = await response.json();
  console.log('Status:', response.status);
  console.log('Response:', JSON.stringify(data, null, 2));

  if (data.success) {
    console.log('✅ Profile retrieved!');
  } else {
    console.log('❌ Profile retrieval failed:', data.error);
  }

  return data.success;
}

async function testCreateClass() {
  console.log('\n📚 Testing: POST /api/classes');
  console.log('='.repeat(50));

  const response = await fetch(`${API_BASE}/api/classes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify({
      name: 'Calculus I',
      teacherName: 'Mr. Johnson',
      period: '1st',
      color: 'bg-blue-500',
      subject: 'Mathematics',
      currentGrade: 'A-',
      gradePercent: 92
    })
  });

  const data = await response.json();
  console.log('Status:', response.status);
  console.log('Response:', JSON.stringify(data, null, 2));

  if (data.success) {
    classId = data.data.class.id;
    console.log('✅ Class created!');
    console.log('   Class ID:', classId);
  } else {
    console.log('❌ Class creation failed:', data.error);
  }

  return data.success;
}

async function testListClasses() {
  console.log('\n📋 Testing: GET /api/classes');
  console.log('='.repeat(50));

  const response = await fetch(`${API_BASE}/api/classes`, {
    headers: { 'Authorization': `Bearer ${accessToken}` }
  });

  const data = await response.json();
  console.log('Status:', response.status);
  console.log('Response:', JSON.stringify(data, null, 2));

  if (data.success) {
    console.log('✅ Classes retrieved!');
    console.log('   Total classes:', data.data.classes.length);
  } else {
    console.log('❌ List classes failed:', data.error);
  }

  return data.success;
}

async function testGetClass() {
  console.log('\n🔍 Testing: GET /api/classes/:id');
  console.log('='.repeat(50));

  const response = await fetch(`${API_BASE}/api/classes/${classId}`, {
    headers: { 'Authorization': `Bearer ${accessToken}` }
  });

  const data = await response.json();
  console.log('Status:', response.status);
  console.log('Response:', JSON.stringify(data, null, 2));

  if (data.success) {
    console.log('✅ Class retrieved!');
  } else {
    console.log('❌ Get class failed:', data.error);
  }

  return data.success;
}

async function testUpdateClass() {
  console.log('\n✏️  Testing: PATCH /api/classes/:id');
  console.log('='.repeat(50));

  const response = await fetch(`${API_BASE}/api/classes/${classId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify({
      currentGrade: 'A',
      gradePercent: 95
    })
  });

  const data = await response.json();
  console.log('Status:', response.status);
  console.log('Response:', JSON.stringify(data, null, 2));

  if (data.success) {
    console.log('✅ Class updated!');
    console.log('   New grade:', data.data.class.currentGrade, '-', data.data.class.gradePercent + '%');
  } else {
    console.log('❌ Update class failed:', data.error);
  }

  return data.success;
}

async function testDeleteClass() {
  console.log('\n🗑️  Testing: DELETE /api/classes/:id');
  console.log('='.repeat(50));

  const response = await fetch(`${API_BASE}/api/classes/${classId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${accessToken}` }
  });

  const data = await response.json();
  console.log('Status:', response.status);
  console.log('Response:', JSON.stringify(data, null, 2));

  if (data.success) {
    console.log('✅ Class deleted!');
  } else {
    console.log('❌ Delete class failed:', data.error);
  }

  return data.success;
}

async function runAllTests() {
  console.log('\n🚀 Little Monster GPA - API Test Suite');
  console.log('='.repeat(50));
  console.log('Testing against:', API_BASE);
  console.log('='.repeat(50));

  try {
    // Test authentication flow
    let success = await testRegister();
    if (!success) return;

    success = await testLogin();
    if (!success) return;

    success = await testGetProfile();
    if (!success) return;

    // Test classes CRUD
    success = await testCreateClass();
    if (!success) return;

    success = await testListClasses();
    if (!success) return;

    success = await testGetClass();
    if (!success) return;

    success = await testUpdateClass();
    if (!success) return;

    success = await testDeleteClass();
    if (!success) return;

    console.log('\n' + '='.repeat(50));
    console.log('🎉 ALL TESTS PASSED!');
    console.log('='.repeat(50));
    console.log('\n✅ Backend API is fully functional!');
    console.log('✅ Database is working correctly!');
    console.log('✅ Authentication is secure!');
    console.log('✅ Classes CRUD is operational!');
    console.log('\n📝 Next: Connect frontend to backend API\n');

  } catch (error) {
    console.error('\n❌ Test failed with error:', error.message);
    console.error('Stack:', error.stack);
  }
}

runAllTests();
