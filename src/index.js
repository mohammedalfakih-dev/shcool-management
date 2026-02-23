import promptSync from 'prompt-sync';
import chalk from 'chalk';

import { parseCommand } from './command-parser.js';
import { handleTraineeCommand } from './traineeCommands.js';
import { handleCourseCommand } from './courseCommands.js';

const prompt = promptSync();

console.log('School Management CLI');
console.log('Type QUIT or q to exit.\n');

while (true) {
  const userInput = prompt('> ');

  const parsed = parseCommand(userInput);

  if (!parsed) {
    console.log(chalk.red('ERROR: Invalid command'));
    continue;
  }

  if (parsed.command === 'QUIT') {
    console.log('Goodbye!');
    process.exit(0);
  }

  const { command, subcommand, args } = parsed;

  switch (command) {
    case 'TRAINEE':
      if (!subcommand) {
        console.log(chalk.red('ERROR: Missing subcommand'));
        break;
      }
      handleTraineeCommand(subcommand, args);
      break;

    case 'COURSE':
      if (!subcommand) {
        console.log(chalk.red('ERROR: Missing subcommand'));
        break;
      }
      handleCourseCommand(subcommand, args);
      break;

    default:
      console.log(chalk.red('ERROR: Invalid command'));
  }
}
