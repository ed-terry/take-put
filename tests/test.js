const { takeCommand } = require('../src/commands/take');
const { putCommand } = require('../src/commands/put');
const { statusCommand } = require('../src/commands/status');
const { clearCommand } = require('../src/commands/clear');
const fs = require('fs');
const path = require('path');
const os = require('os');

console.log('🧪 Running Take-Put CLI Tests...\n');

let testsPassed = 0;
let testsFailed = 0;

// Create test directory
const testDir = path.join(os.tmpdir(), 'take-put-test-' + Date.now());
if (!fs.existsSync(testDir)) {
  fs.mkdirSync(testDir, { recursive: true });
}

async function runTests() {
  try {
    // Test 1: Take a file
    console.log('Test 1: Taking a file...');
    const testFile = path.join(testDir, 'test.txt');
    fs.writeFileSync(testFile, 'test content');
    
    await takeCommand(testFile, { copy: true, verbose: false });
    testsPassed++;
    console.log('✓ Test 1 passed\n');

    // Test 2: Check status
    console.log('Test 2: Checking clipboard status...');
    await statusCommand({ verbose: false });
    testsPassed++;
    console.log('✓ Test 2 passed\n');

    // Test 3: Put the file
    console.log('Test 3: Putting the file...');
    const destDir = path.join(testDir, 'destination');
    fs.mkdirSync(destDir, { recursive: true });
    
    await putCommand(destDir, { verbose: false, overwrite: false });
    testsPassed++;
    console.log('✓ Test 3 passed\n');

    // Test 4: Clear clipboard
    console.log('Test 4: Clearing clipboard...');
    
    // Take another file first
    const testFile2 = path.join(testDir, 'test2.txt');
    fs.writeFileSync(testFile2, 'test content 2');
    await takeCommand(testFile2, { copy: true, verbose: false });
    
    await clearCommand({ verbose: false });
    testsPassed++;
    console.log('✓ Test 4 passed\n');

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log(`Tests Passed: ${testsPassed}`);
    console.log(`Tests Failed: ${testsFailed}`);
    console.log('='.repeat(50) + '\n');

    // Cleanup
    fs.rmSync(testDir, { recursive: true, force: true });

  } catch (err) {
    testsFailed++;
    console.error(`✗ Test failed: ${err.message}\n`);
  }
}

runTests();
