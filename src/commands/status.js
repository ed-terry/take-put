const { getState } = require('../utils/clipboard');
const { fileExists, formatBytes, getFileSize, isDirectory } = require('../utils/fileHelpers');
const { info, warning, verbose, divider, header } = require('../utils/logger');
const chalk = require('chalk');

async function statusCommand(options) {
  try {
    const state = getState();

    header('Clipboard Status');

    if (!state.taken || !fileExists(state.taken)) {
      warning('Clipboard is empty');
      console.log('Use "tp take <path>" to add a file or folder to the clipboard\n');
      return;
    }

    const fileSize = getFileSize(state.taken);
    const itemType = state.isDirectory ? 'Folder' : 'File';
    const modeText = state.mode === 'copy' ? chalk.blue('COPY') : chalk.yellow('MOVE');

    divider();
    console.log(`${chalk.bold('Item:')} ${state.fileName}`);
    console.log(`${chalk.bold('Type:')} ${itemType}`);
    console.log(`${chalk.bold('Mode:')} ${modeText}`);
    console.log(`${chalk.bold('Size:')} ${formatBytes(fileSize)}`);
    console.log(`${chalk.bold('Path:')} ${state.taken}`);
    console.log(`${chalk.bold('Added:')} ${new Date(state.timestamp).toLocaleString()}`);
    divider();

    if (options.verbose) {
      verbose(`Use "tp put [destination]" to paste this ${itemType.toLowerCase()}`);
      verbose(`Use "tp clear" to remove this item from clipboard`);
      if (state.mode === 'move') {
        verbose('This item will be moved (deleted from original location) when put');
      } else {
        verbose('This item will be copied (original will remain) when put');
      }
    }
    console.log();

  } catch (err) {
    console.error(`Failed to get status: ${err.message}`);
    process.exit(1);
  }
}

module.exports = { statusCommand };
