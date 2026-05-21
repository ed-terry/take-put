const fs = require('fs');
const path = require('path');
const { getState, setState } = require('../utils/clipboard');
const { fileExists, isDirectory, getFileSize, formatBytes, getFileName } = require('../utils/fileHelpers');
const { success, error, verbose, warning } = require('../utils/logger');

async function takeCommand(filePath, options) {
  try {
    // Validate input
    if (!filePath || filePath.trim() === '') {
      error('Please provide a valid file or folder path');
      process.exit(1);
    }

    // Normalize path
    const normalizedPath = path.resolve(filePath);

    if (!fileExists(normalizedPath)) {
      error(`File or folder not found: ${filePath}`);
      process.exit(1);
    }

    const isDir = isDirectory(normalizedPath);
    const fileName = getFileName(normalizedPath);
    const fileSize = getFileSize(normalizedPath);

    // Determine mode (default is 'move/cut', unless --copy flag is provided)
    const mode = options.copy ? 'copy' : 'move';

    // Save state
    setState({
      taken: normalizedPath,
      mode: mode,
      originalPath: normalizedPath,
      isDirectory: isDir,
      fileName: fileName,
      timestamp: new Date().toISOString()
    });

    if (options.verbose) {
      verbose(`Mode: ${mode}`);
      verbose(`Type: ${isDir ? 'Folder' : 'File'}`);
      verbose(`Size: ${formatBytes(fileSize)}`);
      verbose(`Path: ${normalizedPath}`);
    }

    const itemType = isDir ? 'Folder' : 'File';
    const action = mode === 'copy' ? 'copied' : 'taken';
    success(`${itemType} '${fileName}' ${action} successfully! (${formatBytes(fileSize)})`);

    if (mode === 'move') {
      warning('This will be moved when you issue the put command');
    }

  } catch (err) {
    error(`Failed to take file: ${err.message}`);
    process.exit(1);
  }
}

module.exports = { takeCommand };
