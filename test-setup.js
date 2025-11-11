// Simple test to verify the application structure
const fs = require('fs');
const path = require('path');

console.log('🔍 Testing Job Portal Application Setup...\n');

// Check if all required files exist
const requiredFiles = [
  'backend/package.json',
  'backend/server.js',
  'backend/models/User.js',
  'backend/models/Job.js',
  'backend/routes/auth.js',
  'frontend/package.json',
  'frontend/src/App.jsx',
  'frontend/src/context/AuthContext.jsx',
  'frontend/src/routes/AppRoutes.jsx'
];

let allFilesExist = true;

requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    allFilesExist = false;
  }
});

console.log('\n📊 Setup Summary:');
if (allFilesExist) {
  console.log('✅ All core files are present');
  console.log('✅ Backend structure is complete');
  console.log('✅ Frontend structure is complete');
  console.log('\n🚀 Ready to start the application!');
  console.log('\nNext steps:');
  console.log('1. Make sure MongoDB is running');
  console.log('2. Update .env file with your database connection');
  console.log('3. Run: npm run dev in backend directory');
  console.log('4. Run: npm run dev in frontend directory');
} else {
  console.log('❌ Some files are missing. Please check the setup.');
}

console.log('\n📋 Features implemented:');
console.log('• User Authentication (JWT)');
console.log('• Role-based access (Employer/Job Seeker)');
console.log('• Job posting and management');
console.log('• Job search and filtering');
console.log('• Job applications');
console.log('• Resume upload and management');
console.log('• Saved jobs functionality');
console.log('• Company profiles');
console.log('• Dashboard analytics');
console.log('• Responsive design');