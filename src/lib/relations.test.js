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

  it('John → George Barrett (wife’s line, not his maternal)', () => {
    const text = relationFor('john_daly', 'ggp_george_barrett');
    expect(text).toMatch(/wife Joan/i);
    expect(text).toMatch(/maternal grandfather George/i);
    expect(text).not.toMatch(/^Your maternal great-grandfather/i);
  });

  it('Joan → George Barrett (her maternal grandfather)', () => {
    expect(relationFor('joan_byron', 'ggp_george_barrett')).toMatch(
      /Your maternal grandfather George/i
    );
  });

  it('John → Matthew Daly (great-uncle)', () => {
    expect(relationFor('john_daly', 'gunc_matthew_daly')).toMatch(/great-uncle Matthew/i);
  });

  it('Kieran → John (father-in-law)', () => {
    expect(relationFor('kieran', 'john_daly')).toMatch(/father-in-law John/i);
  });
});

describe('persona allowlist', () => {
  it('includes Joanne, Kieran, parents, and siblings only', () => {
    expect(PERSONA_ALLOWLIST).toHaveLength(8);
    expect(PERSONA_ALLOWLIST).toContain('joanne');
    expect(PERSONA_ALLOWLIST).toContain('kieran');
    expect(PERSONA_ALLOWLIST).toContain('john_daly');
    expect(PERSONA_ALLOWLIST).toContain('joan_byron');
    expect(PERSONA_ALLOWLIST).not.toContain('unc_patrick');
    expect(PERSONA_ALLOWLIST).not.toContain('gp_michael_daly');
  });
});
