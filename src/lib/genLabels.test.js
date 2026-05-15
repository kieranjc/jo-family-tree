import { describe, it, expect } from 'vitest';
import { getPersonaGenLabels } from './genLabels.js';

describe('getPersonaGenLabels', () => {
  it('Matthew (gen 0): row 1 is Parents, not Children', () => {
    const labels = getPersonaGenLabels(0);
    expect(labels[0].label).toBe('You');
    expect(labels[1].label).toBe('Parents');
    expect(labels[2].label).toBe('Grandparents');
  });

  it('John (gen 1): row 0 is Children', () => {
    const labels = getPersonaGenLabels(1);
    expect(labels[0].label).toBe('Children');
    expect(labels[1].label).toBe('You');
    expect(labels[2].label).toBe('Parents');
  });
});
