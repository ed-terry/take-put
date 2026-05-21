#!/usr/bin/env node

const { program } = require('commander');
const { takeCommand } = require('./commands/take');
const { putCommand } = require('./commands/put');
const { clearCommand } = require('./commands/clear');
const { statusCommand } = require('./commands/status');
const { swapCommand } = require('./commands/swap');

program
  .name('tp')
  .description('Take and Put - A cross-platform CLI file/folder clipboard manager')
  .version('1.0.0');

program
  .command('take <path>')
  .description('Take a file or folder (default: cuts the file)')
  .option('-c, --copy', 'Copy the file instead of cutting')
  .option('-m, --move', 'Move/cut the file (default behavior)')
  .option('-v, --verbose', 'Show detailed output')
  .action(takeCommand);

program
  .command('put [destination]')
  .description('Put the taken file or folder in the current or specified directory')
  .option('-v, --verbose', 'Show detailed output')
  .option('-o, --overwrite', 'Overwrite existing files without prompting')
  .action(putCommand);

program
  .command('clear')
  .description('Clear the clipboard and remove the temporary taken file/folder')
  .option('-v, --verbose', 'Show detailed output')
  .action(clearCommand);

program
  .command('status')
  .description('Show what is currently in the clipboard')
  .option('-v, --verbose', 'Show detailed output')
  .action(statusCommand);

program
  .command('swap [path]')
  .description('Swap the current clipboard with a file/folder (exchange positions)')
  .option('-v, --verbose', 'Show detailed output')
  .action(swapCommand);

program.on('command:*', function () {
  console.error(`\n  error: invalid command: ${program.args.join(' ')}`);
  console.error('  See --help for a list of available commands.\n');
  process.exit(1);
});

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
