import { PEOPLE } from '../data/tree.js';

/** Joanne, her brothers, and Kieran (gen 0). */
export function getBloodSiblings() {
  return PEOPLE.filter((p) => p.role === 'sibling' || p.role === 'self').sort((a, b) =>
    a.name.localeCompare(b.name)
  );
}

/**
 * @param {string | null} activePersona
 * @param {{ role?: string } | null} viewer
 */
export function getGen0ViewMode(activePersona, viewer) {
  if (!activePersona || !viewer) return 'default';
  if (viewer.role === 'self') return 'joanne';
  if (viewer.role === 'spouse') return 'kieran';
  if (viewer.role === 'sibling') return 'sibling';
  return 'default';
}

/**
 * People to show in the siblings chip list (excludes active persona — shown as "You" on mobile).
 * @param {string} mode
 * @param {string | null} activePersona
 */
/**
 * @param {string} mode
 * @param {string | null} activePersona
 * @param {{ includePersonaLead?: boolean }} [opts]
 */
export function getGen0SiblingChipPeople(mode, activePersona, opts = {}) {
  const { includePersonaLead = false } = opts;
  const blood = getBloodSiblings();
  if (mode === 'default') {
    return PEOPLE.filter((p) => p.role === 'sibling');
  }
  if (mode === 'joanne' || mode === 'kieran') {
    return blood.filter((p) => p.role === 'sibling');
  }
  if (mode === 'sibling' && activePersona) {
    if (includePersonaLead) {
      const lead = blood.find((p) => p.id === activePersona);
      const rest = blood.filter((p) => p.id !== activePersona);
      return lead ? [lead, ...rest] : rest;
    }
    return blood.filter((p) => p.id !== activePersona);
  }
  return blood;
}

export function getGen0SiblingClusterTitle(mode) {
  switch (mode) {
    case 'sibling':
    case 'joanne':
    case 'kieran':
      return 'Siblings';
    default:
      return "Joanne's brothers";
  }
}

export function getGen0MobileFamilyLabel(mode) {
  switch (mode) {
    case 'sibling':
      return 'Sister &amp; husband';
    case 'kieran':
      return 'You &amp; Joanne';
    case 'joanne':
      return 'You &amp; Kieran';
    default:
      return 'Joanne &amp; family';
  }
}

export function showGen0PersonaLead(mode) {
  return mode === 'sibling';
}
