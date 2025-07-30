const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, 'dist');

try {
  if (fs.existsSync(distPath)) {
    fs.rmSync(distPath, { recursive: true, force: true });
    console.log('Dist directory cleaned successfully');
  } else {
    console.log('Dist directory does not exist, nothing to clean');
  }
} catch (error) {
  console.log('Error cleaning dist directory:', error.message);
  // Don't fail the build if cleaning fails
  process.exit(0);
} 