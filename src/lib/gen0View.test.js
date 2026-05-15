import { describe, it, expect } from 'vitest';
import {
  getGen0ViewMode,
  getGen0SiblingChipPeople,
  getGen0SiblingClusterTitle,
  showGen0PersonaLead,
} from './gen0View.js';

describe('gen0View', () => {
  it('sibling mode lists all siblings except persona in mobile chips', () => {
    expect(getGen0ViewMode('paul', { role: 'sibling' })).toBe('sibling');
    const chips = getGen0SiblingChipPeople('sibling', 'paul');
    expect(chips.map((p) => p.id).sort()).toEqual(['andrew', 'evan', 'joanne', 'matthew']);
    expect(getGen0SiblingClusterTitle('sibling')).toBe('Siblings');
    expect(showGen0PersonaLead('sibling')).toBe(true);
  });

  it('desktop sibling mode puts persona first in chips', () => {
    const chips = getGen0SiblingChipPeople('sibling', 'paul', { includePersonaLead: true });
    expect(chips[0].id).toBe('paul');
    expect(chips.map((p) => p.id)).toContain('joanne');
  });

  it('joanne mode uses Siblings title and brothers only in chips', () => {
    expect(getGen0ViewMode('joanne', { role: 'self' })).toBe('joanne');
    const chips = getGen0SiblingChipPeople('joanne', 'joanne');
    expect(chips.every((p) => p.role === 'sibling')).toBe(true);
    expect(getGen0SiblingClusterTitle('joanne')).toBe('Siblings');
  });
});
