import { describe, test, expect } from 'vitest';
import { parseCommand } from '../src/command-parser.js';

describe('parseCommand', () => {
  test('parses TRAINEE ADD correctly', () => {
    expect(parseCommand('TRAINEE ADD John Doe')).toEqual({
      command: 'TRAINEE',
      subcommand: 'ADD',
      args: ['John', 'Doe'],
    });
  });

  test('returns QUIT command for q', () => {
    expect(parseCommand('q')).toEqual({ command: 'QUIT' });
  });

  test('returns null for empty input', () => {
    expect(parseCommand('   ')).toBeNull();
  });
});
