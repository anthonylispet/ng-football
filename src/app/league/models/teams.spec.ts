import { describe, expect, it } from 'vitest';
import { getPlayerCodeFromEmail } from './teams';

describe('getPlayerCodeFromEmail', () => {
  it('maps both Pierre email variants to the same player', () => {
    expect(getPlayerCodeFromEmail('pierre.simon7041@gmail.com')).toBe('P');
    expect(getPlayerCodeFromEmail('pierresimon7041@gmail.com')).toBe('P');
  });

  it('normalizes casing and surrounding whitespace', () => {
    expect(getPlayerCodeFromEmail('  PierreSimon7041@gmail.com ')).toBe('P');
  });

  it('rejects an unknown email', () => {
    expect(getPlayerCodeFromEmail('unknown@example.com')).toBeNull();
  });
});
