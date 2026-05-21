const fs = require('fs');
const path = require('path');
const { getState, setState, clearState } = require('../utils/clipboard');
const { fileExists, getFileName } = require('../utils/fileHelpers');
const { success, error, verbose, warning, info } = require('../utils/logger');

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
    // Windows: use a different approach
    if (fs.statSync(src).isDirectory()) {
      copyDirRecursive(src, dest);
      removeDirRecursive(src);
    } else {
      fs.copyFileSync(src, dest);
      fs.unlinkSync(src);
    }
  } else {
    // Unix-like systems
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

async function putCommand(destination, options) {
  try {
    const state = getState();

    if (!state.taken || !fileExists(state.taken)) {
      error('Nothing in clipboard. Use "tp take <path>" first');
      process.exit(1);
    }

    // Determine destination
    const targetDir = destination ? path.resolve(destination) : process.cwd();

    if (!fileExists(targetDir)) {
      error(`Destination directory not found: ${targetDir}`);
      process.exit(1);
    }

    if (!fs.statSync(targetDir).isDirectory()) {
      error(`Destination is not a directory: ${targetDir}`);
      process.exit(1);
    }

    const fileName = getFileName(state.taken);
    const finalDestPath = path.join(targetDir, fileName);

    if (options.verbose) {
      verbose(`Source: ${state.taken}`);
      verbose(`Destination: ${finalDestPath}`);
      verbose(`Mode: ${state.mode}`);
    }

    // Check if file already exists
    if (fileExists(finalDestPath) && !options.overwrite) {
      warning(`File/folder already exists at: ${finalDestPath}`);
      error('Use --overwrite flag to replace it');
      process.exit(1);
    }

    // Remove existing file if overwrite is enabled
    if (fileExists(finalDestPath) && options.overwrite) {
      if (fs.statSync(finalDestPath).isDirectory()) {
        removeDirRecursive(finalDestPath);
      } else {
        fs.unlinkSync(finalDestPath);
      }
      if (options.verbose) {
        verbose(`Removed existing file/folder: ${finalDestPath}`);
      }
    }

    // Execute the operation
    if (state.mode === 'copy') {
      copyFileOrFolder(state.taken, finalDestPath);
      success(`${state.isDirectory ? 'Folder' : 'File'} '${fileName}' pasted successfully!`);
      if (options.verbose) {
        verbose('Original file/folder remains in: ' + state.taken);
      }
    } else if (state.mode === 'move') {
      moveFileOrFolder(state.taken, finalDestPath);
      success(`${state.isDirectory ? 'Folder' : 'File'} '${fileName}' moved successfully!`);
      if (options.verbose) {
        verbose('Original file/folder has been removed');
      }
      clearState();
    }

  } catch (err) {
    error(`Failed to put file: ${err.message}`);
    process.exit(1);
  }
}

module.exports = { putCommand };
