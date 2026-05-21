const chalk = require('chalk');

function success(message) {
  console.log(chalk.green(`✓ ${message}`));
}

function error(message) {
  console.error(chalk.red(`✗ ${message}`));
}

function warning(message) {
  console.warn(chalk.yellow(`⚠ ${message}`));
}

function info(message) {
  console.log(chalk.blue(`ℹ ${message}`));
}

function verbose(message) {
  console.log(chalk.gray(`→ ${message}`));
}

function header(message) {
  console.log(chalk.bold.cyan(`\n╔ ${message}`));
}

function divider() {
  console.log(chalk.gray('─'.repeat(60)));
}

module.exports = {
  success,
  error,
  warning,
  info,
  verbose,
  header,
  divider
};
