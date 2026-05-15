import { PEOPLE, BY_ID } from '../data/tree.js';
import {
  getPerson,
  getParents,
  getChildren,
  getSpouse,
  getSiblings,
  findLca,
} from './graph.js';

function firstName(id) {
  const p = BY_ID[id];
  return p?.name?.split(' ')[0] ?? 'them';
}

/**
 * @param {string} viewerId
 * @param {string} targetId
 * @returns {string}
 */
export function relationFor(viewerId, targetId) {
  if (viewerId === targetId) return 'You — the centre of this tree.';

  const target = getPerson(targetId);
  const viewer = getPerson(viewerId);
  if (!target || !viewer) return '—';

  if (getSpouse(viewerId) === targetId) {
    return target.id === 'kieran' ? 'Your husband.' : 'Your wife.';
  }

  if (getParents(viewerId).includes(targetId)) {
    const genDiff = target.gen - viewer.gen;
    if (genDiff === 2) {
      if (targetId === 'gp_michael_daly') return 'Your paternal grandfather.';
      if (targetId === 'gp_mary_curran') return 'Your paternal grandmother.';
      if (targetId === 'gp_james_byron') return 'Your maternal grandfather.';
      if (targetId === 'gp_nora_barrett') return 'Your maternal grandmother.';
      return `Your grandparent ${firstName(targetId)}.`;
    }
    if (genDiff === 1 || targetId === 'john_daly' || targetId === 'joan_byron') {
      if (targetId === 'john_daly') return 'Your father.';
      if (targetId === 'joan_byron') return 'Your mother.';
      if (targetId === 'gp_michael_daly') return 'Your father.';
      if (targetId === 'gp_mary_curran') return 'Your mother.';
      if (targetId === 'gp_james_byron') return 'Your father.';
      if (targetId === 'gp_nora_barrett') return 'Your mother.';
    }
    return `Your parent ${firstName(targetId)}.`;
  }

  if (getParents(targetId).includes(viewerId)) {
    if (targetId === 'joanne') return 'Your daughter Joanne.';
    if (target.role === 'sibling') return `Your son ${firstName(targetId)}.`;
    return `Your child ${firstName(targetId)}.`;
  }

  if (getSiblings(viewerId).includes(targetId)) {
    if (targetId === 'joanne') return 'Your sister Joanne.';
    return `Your brother ${firstName(targetId)}.`;
  }

  for (const sib of getSiblings(viewerId)) {
    if (getChildren(sib).includes(targetId)) {
      if (targetId === 'joanne') return 'Your niece Joanne.';
      return `Your nephew ${firstName(targetId)}.`;
    }
  }

  for (const p of getParents(viewerId)) {
    const ua = PEOPLE.filter(
      (x) => (x.role === 'uncle' || x.role === 'aunt') && x.parentOf === p
    );
    if (ua.some((u) => u.id === targetId)) {
      if (target.role === 'uncle') return `Your uncle ${firstName(targetId)}.`;
      return `Your aunt ${firstName(targetId)}.`;
    }
  }

  if (
    PEOPLE.some(
      (x) => x.id === viewerId && x.parentOf && getParents(targetId).includes(x.parentOf)
    )
  ) {
    if (targetId === 'joanne') return 'Your niece Joanne.';
    return `Your niece ${firstName(targetId)}.`;
  }

  const lca = findLca(viewerId, targetId);
  if (lca) {
    const { distA, distB } = lca;
    if (distA === 2 && distB === 1) {
      if (targetId === 'joanne') return 'Your granddaughter Joanne.';
      return `Your grandchild ${firstName(targetId)}.`;
    }
    if (distA === 1 && distB === 2) {
      if (targetId === 'gp_michael_daly') return 'Your paternal grandfather.';
      if (targetId === 'gp_mary_curran') return 'Your paternal grandmother.';
      if (targetId === 'gp_james_byron') return 'Your maternal grandfather.';
      if (targetId === 'gp_nora_barrett') return 'Your maternal grandmother.';
      return `Your grandparent ${firstName(targetId)}.`;
    }
    if (distA === 2 && distB === 2) return `Your cousin ${firstName(targetId)}.`;
    if (distB > distA) {
      const gap = distB - distA;
      if (gap === 1) return `Your grandparent ${firstName(targetId)}.`;
      if (gap === 2) return `Your great-grandparent ${firstName(targetId)}.`;
      if (gap >= 3) return `Your 2× great-grandparent ${firstName(targetId)}.`;
    }
    if (distA > distB) {
      const gap = distA - distB;
      if (gap === 1) {
        if (targetId === 'joanne') return 'Your granddaughter Joanne.';
        return `Your grandchild ${firstName(targetId)}.`;
      }
    }
  }

  if (target.relation) {
    return target.relation
      .replace(/^Joanne's /, 'Your ')
      .replace(/\bJoanne's\b/g, 'your')
      .replace(/\bJoanne\b/g, 'your niece Joanne');
  }
  return 'Related by family.';
}
