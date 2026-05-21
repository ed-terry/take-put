const fs = require('fs');
const path = require('path');
const os = require('os');

const CLIPBOARD_DIR = path.join(os.homedir(), '.take-put');
const STATE_FILE = path.join(CLIPBOARD_DIR, 'state.json');

// Ensure clipboard directory exists
function ensureClipboardDir() {
  if (!fs.existsSync(CLIPBOARD_DIR)) {
    fs.mkdirSync(CLIPBOARD_DIR, { recursive: true });
  }
}

// Get current state
function getState() {
  ensureClipboardDir();
  if (fs.existsSync(STATE_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
    } catch (e) {
      return { taken: null, mode: null, originalPath: null };
    }
  }
  return { taken: null, mode: null, originalPath: null };
}

// Save state
function setState(state) {
  ensureClipboardDir();
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

// Clear state
function clearState() {
  if (fs.existsSync(STATE_FILE)) {
    fs.unlinkSync(STATE_FILE);
  }
}

// Get clipboard path
function getClipboardPath() {
  const state = getState();
  return state.taken;
}

// Get clipboard info
function getClipboardInfo() {
  const state = getState();
  return state;
}

// Ensure path safety (prevent directory traversal attacks)
function isPathSafe(targetPath) {
  const resolvedPath = path.resolve(targetPath);
  return resolvedPath.startsWith(path.resolve(os.homedir())) || 
         resolvedPath.startsWith(path.resolve('/')) ||
         /^[A-Z]:\\/.test(resolvedPath);
}

module.exports = {
  CLIPBOARD_DIR,
  STATE_FILE,
  ensureClipboardDir,
  getState,
  setState,
  clearState,
  getClipboardPath,
  getClipboardInfo,
  isPathSafe
};
