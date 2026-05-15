import { describe, it, expect } from 'vitest';
import { relationFor } from './relations.js';
import { PERSONA_ALLOWLIST } from './persona.js';

describe('relationFor', () => {
  it('self', () => {
    expect(relationFor('john_daly', 'john_daly')).toContain('centre');
  });

  it('John → Joanne', () => {
    expect(relationFor('john_daly', 'joanne')).toMatch(/daughter Joanne/i);
  });

  it('Paul → Joanne', () => {
    expect(relationFor('paul', 'joanne')).toMatch(/sister Joanne/i);
  });

  it('Patrick → John (brothers)', () => {
    expect(relationFor('unc_patrick', 'john_daly')).toMatch(/brother/i);
  });

  it('Joanne → John', () => {
    expect(relationFor('joanne', 'john_daly')).toMatch(/father/i);
  });

  it('John → Michael (father)', () => {
    expect(relationFor('john_daly', 'gp_michael_daly')).toMatch(/father/i);
  });
});

describe('persona allowlist', () => {
  it('has 19 personas including Joanne and Kieran', () => {
    expect(PERSONA_ALLOWLIST).toHaveLength(19);
    expect(PERSONA_ALLOWLIST).toContain('joanne');
    expect(PERSONA_ALLOWLIST).toContain('kieran');
    expect(PERSONA_ALLOWLIST).not.toContain('gp_michael_daly');
  });
});
