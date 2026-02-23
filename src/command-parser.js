export function parseCommand(userInput) {
  if (!userInput || userInput.trim() === '') {
    return null;
  }

  const trimmed = userInput.trim();

  // Handle quit commands
  if (trimmed === 'QUIT' || trimmed === 'q') {
    return { command: 'QUIT' };
  }

  const parts = trimmed.split(' ');

  const command = parts[0];
  const subcommand = parts[1] || null;
  const args = parts.slice(2);

  return {
    command,
    subcommand,
    args,
  };
}
