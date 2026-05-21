const fs = require('fs');
const path = require('path');
const os = require('os');

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function getFileSize(filePath) {
  try {
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      return calculateDirSize(filePath);
    }
    return stats.size;
  } catch (e) {
    return 0;
  }
}

function calculateDirSize(dirPath) {
  let size = 0;
  const files = fs.readdirSync(dirPath);
  
  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      size += calculateDirSize(filePath);
    } else {
      size += stats.size;
    }
  });
  
  return size;
}

function isDirectory(filePath) {
  try {
    return fs.statSync(filePath).isDirectory();
  } catch (e) {
    return false;
  }
}

function fileExists(filePath) {
  return fs.existsSync(filePath);
}

function getFileName(filePath) {
  return path.basename(filePath);
}

function sanitizePath(filePath) {
  return path.resolve(filePath);
}

module.exports = {
  formatBytes,
  getFileSize,
  calculateDirSize,
  isDirectory,
  fileExists,
  getFileName,
  sanitizePath
};
