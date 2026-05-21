const fs = require('fs');
const path = require('path');
const { getState, clearState, CLIPBOARD_DIR } = require('../utils/clipboard');
const { fileExists } = require('../utils/fileHelpers');
const { success, error, verbose, warning } = require('../utils/logger');

function removeDirRecursive(dir) {
  if (fs.existsSync(dir)) {
    fs.readdirSync(dir).forEach(file => {
      const filePath = path.join(dir, file);
      if (fs.statSync(filePath).isDirectory()) {
        removeDirRecursive(filePath);
      } else {
        fs.unlinkSync(filePath);
      }
    });
    fs.rmdirSync(dir);
  }
}

async function clearCommand(options) {
  try {
    const state = getState();

    if (!state.taken) {
      warning('Nothing in clipboard');
      return;
    }

    // Only remove the original if it was a 'move' operation
    if (state.mode === 'move' && fileExists(state.taken)) {
      if (options.verbose) {
        verbose(`Removing: ${state.taken}`);
      }
      
      if (fs.statSync(state.taken).isDirectory()) {
        removeDirRecursive(state.taken);
      } else {
        fs.unlinkSync(state.taken);
      }
    }

    clearState();
    success('Clipboard cleared!');

    if (options.verbose) {
      verbose('State file has been removed');
    }

  } catch (err) {
    error(`Failed to clear clipboard: ${err.message}`);
    process.exit(1);
  }
}

module.exports = { clearCommand };
