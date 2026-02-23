import { describe, test, expect, vi, beforeEach } from 'vitest';

vi.mock('node:fs', () => {
  return {
    default: {
      readFileSync: vi.fn(),
      writeFileSync: vi.fn(),
    },
    readFileSync: vi.fn(),
    writeFileSync: vi.fn(),
  };
});

import fs from 'node:fs';
import { loadTraineeData } from '../src/storage.js';

describe('storage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('loadTraineeData parses JSON from file', () => {
    fs.readFileSync.mockReturnValue(
      JSON.stringify([{ id: 1, firstName: 'A', lastName: 'B' }])
    );

    const result = loadTraineeData();

    expect(fs.readFileSync).toHaveBeenCalled();
    expect(result).toEqual([{ id: 1, firstName: 'A', lastName: 'B' }]);
  });
});
