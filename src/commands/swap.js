const fs = require('fs');
const path = require('path');
const { getState, setState } = require('../utils/clipboard');
const { fileExists, isDirectory, getFileName, getFileSize, formatBytes } = require('../utils/fileHelpers');
const { success, error, verbose, warning } = require('../utils/logger');

function copyFileOrFolder(src, dest) {
  if (fs.statSync(src).isDirectory()) {
    copyDirRecursive(src, dest);
  } else {
    fs.copyFileSync(src, dest);
  }
}

function copyDirRecursive(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const files = fs.readdirSync(src);
  files.forEach(file => {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);
    if (fs.statSync(srcPath).isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
}

function moveFileOrFolder(src, dest) {
  if (process.platform === 'win32') {
    if (fs.statSync(src).isDirectory()) {
      copyDirRecursive(src, dest);
      removeDirRecursive(src);
    } else {
      fs.copyFileSync(src, dest);
      fs.unlinkSync(src);
    }
  } else {
    fs.renameSync(src, dest);
  }
}

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

async function swapCommand(swapPath, options) {
  try {
    const state = getState();

    if (!state.taken || !fileExists(state.taken)) {
      error('Nothing in clipboard. Use "tp take <path>" first');
      process.exit(1);
    }

    // Determine swap path
    const targetPath = swapPath ? path.resolve(swapPath) : process.cwd();

    if (!fileExists(targetPath)) {
      error(`Path not found: ${targetPath}`);
      process.exit(1);
    }

    if (isDirectory(targetPath)) {
      error('Swap target must be a file, not a directory');
      process.exit(1);
    }

    const clipboardItem = state.taken;
    const swapItem = targetPath;
    const clipboardDir = path.dirname(clipboardItem);
    const swapDir = path.dirname(swapItem);

    if (options.verbose) {
      verbose(`Clipboard item: ${clipboardItem}`);
      verbose(`Swap item: ${swapItem}`);
      verbose(`Mode: ${state.mode}`);
    }

    // Create temporary files
    const tempClip = path.join(clipboardDir, `.tmp_clip_${Date.now()}`);
    const tempSwap = path.join(swapDir, `.tmp_swap_${Date.now()}`);

    // Move clipboard item to temp
    if (fs.statSync(clipboardItem).isDirectory()) {
      copyDirRecursive(clipboardItem, tempClip);
    } else {
      fs.copyFileSync(clipboardItem, tempClip);
    }

    if (options.verbose) {
      verbose(`Backed up clipboard item to temp: ${tempClip}`);
    }

    // Move swap item to temp
    if (fs.statSync(swapItem).isDirectory()) {
      copyDirRecursive(swapItem, tempSwap);
    } else {
      fs.copyFileSync(swapItem, tempSwap);
    }

    if (options.verbose) {
      verbose(`Backed up swap item to temp: ${tempSwap}`);
    }

    // Remove originals
    if (fs.statSync(clipboardItem).isDirectory()) {
      removeDirRecursive(clipboardItem);
    } else {
      fs.unlinkSync(clipboardItem);
    }

    if (fs.statSync(swapItem).isDirectory()) {
      removeDirRecursive(swapItem);
    } else {
      fs.unlinkSync(swapItem);
    }

    // Move temp back to original locations (swapped)
    if (fs.statSync(tempClip).isDirectory()) {
      copyDirRecursive(tempClip, swapItem);
      removeDirRecursive(tempClip);
    } else {
      fs.copyFileSync(tempClip, swapItem);
      fs.unlinkSync(tempClip);
    }

    if (fs.statSync(tempSwap).isDirectory()) {
      copyDirRecursive(tempSwap, clipboardItem);
      removeDirRecursive(tempSwap);
    } else {
      fs.copyFileSync(tempSwap, clipboardItem);
      fs.unlinkSync(tempSwap);
    }

    // Update state with swapped item
    const swapFileName = getFileName(swapItem);
    const swapSize = getFileSize(swapItem);
    
    setState({
      taken: swapItem,
      mode: state.mode,
      originalPath: state.originalPath,
      isDirectory: isDirectory(swapItem),
      fileName: swapFileName,
      timestamp: new Date().toISOString()
    });

    success(`Swapped successfully!`);
    success(`Clipboard now contains: '${swapFileName}' (${formatBytes(swapSize)})`);

  } catch (err) {
    error(`Failed to swap files: ${err.message}`);
    process.exit(1);
  }
}

module.exports = { swapCommand };
