import { PEOPLE, BY_ID } from '../data/tree.js';
import {
  getPerson,
  getParents,
  getChildren,
  getSpouse,
  getSiblings,
  getParentSiblingIds,
  findLca,
} from './graph.js';

/** @type {Set<string>} */
const FEMALE_IDS = new Set([
  'joanne',
  'joan_byron',
  'gp_mary_curran',
  'gp_nora_barrett',
  'ggp_mary_barry',
  'ggp_thomasine_mcc',
  'ggp_florence_ritchie',
  'ggp_margaret_scott',
  'g4_mary_horgan',
  'g4_mary_horrigan',
  'g4_ellen_brien',
  'g4_mary_hegarty',
  'g4_julia_crockett',
  'g4_alice_flynn',
  'aunt_marie',
  'aunt_alice',
  'aunt_peg',
  'aunt_kaye',
  'aunt_carmel',
]);

const LINE_LABELS = {
  daly: 'Daly',
  curran: 'Curran',
  byron: 'Byron',
  barrett: 'Barrett',
};

function firstName(id) {
  const p = BY_ID[id];
  return p?.name?.split(' ')[0] ?? 'them';
}

/** @returns {'m' | 'f' | null} */
function inferGender(id) {
  const p = getPerson(id);
  if (!p) return null;
  if (FEMALE_IDS.has(id)) return 'f';
  if (p.role === 'aunt') return 'f';
  if (p.role === 'uncle' || p.role === 'great-uncle') return 'm';
  if (id === 'kieran') return 'm';
  return 'm';
}

function lineSuffix(target) {
  const label = LINE_LABELS[target.line];
  return label ? ` (${label} line)` : '';
}

/** Shortest path viewer → target following parent links only. */
function bloodPathUp(from, to, visited = new Set()) {
  if (from === to) return [from];
  if (visited.has(from)) return null;
  visited.add(from);
  for (const pid of getParents(from)) {
    const sub = bloodPathUp(pid, to, visited);
    if (sub) return [from, ...sub];
  }
  return null;
}

/** Shortest path viewer → target following child links only. */
function bloodPathDown(from, to, visited = new Set()) {
  if (from === to) return [from];
  if (visited.has(from)) return null;
  visited.add(from);
  for (const cid of getChildren(from)) {
    const sub = bloodPathDown(cid, to, visited);
    if (sub) return [from, ...sub];
  }
  return null;
}

/** @returns {'paternal' | 'maternal' | null} */
function bloodSideAt(anchorId, path) {
  if (!path || path.length < 2) return null;
  const parents = getParents(anchorId);
  if (path[1] === parents[0]) return 'paternal';
  if (path[1] === parents[1]) return 'maternal';
  return null;
}

/** @returns {'wife' | 'husband'} */
function spouseWord(viewerId) {
  const sid = getSpouse(viewerId);
  if (!sid) return 'wife';
  if (sid === 'kieran') return 'husband';
  if (viewerId === 'joanne') return 'husband';
  return 'wife';
}

/**
 * @param {number} generationsUp
 * @param {'paternal' | 'maternal' | null} side
 * @param {'m' | 'f' | null} gender
 */
function ancestorRolePhrase(generationsUp, side, gender) {
  const sidePrefix = side === 'paternal' ? 'paternal ' : side === 'maternal' ? 'maternal ' : '';
  if (generationsUp === 1) {
    if (gender === 'm') return `${sidePrefix}father`.trim();
    if (gender === 'f') return `${sidePrefix}mother`.trim();
    return 'parent';
  }
  if (generationsUp === 2) {
    if (gender === 'm') return `${sidePrefix}grandfather`.trim();
    if (gender === 'f') return `${sidePrefix}grandmother`.trim();
    return `${sidePrefix}grandparent`.trim();
  }
  const greatStem =
    generationsUp === 3 ? 'great-grand' : `${generationsUp - 2}× great-grand`;
  if (gender === 'm') return `${sidePrefix}${greatStem}father`.trim();
  if (gender === 'f') return `${sidePrefix}${greatStem}mother`.trim();
  return `${sidePrefix}${greatStem}parent`.trim();
}

function describeBloodAncestor(viewerId, targetId) {
  const path = bloodPathUp(viewerId, targetId);
  if (!path) return null;
  const generationsUp = path.length - 1;
  const side = bloodSideAt(viewerId, path);
  const target = getPerson(targetId);
  const role = ancestorRolePhrase(generationsUp, side, inferGender(targetId));
  return `Your ${role} ${firstName(targetId)}${target ? lineSuffix(target) : ''}.`;
}

function describeBloodDescendant(viewerId, targetId) {
  const path = bloodPathDown(viewerId, targetId);
  if (!path) return null;
  const generationsDown = path.length - 1;
  const target = getPerson(targetId);
  const name = firstName(targetId);

  if (generationsDown === 1) {
    if (targetId === 'joanne') return 'Your daughter Joanne.';
    if (target?.role === 'sibling') return `Your son ${name}.`;
    if (target?.role === 'spouse') {
      return inferGender(targetId) === 'm'
        ? `Your son-in-law ${name}.`
        : `Your daughter-in-law ${name}.`;
    }
    return `Your child ${name}.`;
  }
  if (generationsDown === 2) {
    if (targetId === 'joanne') return 'Your granddaughter Joanne.';
    return `Your grandchild ${name}.`;
  }
  if (generationsDown === 3) {
    if (targetId === 'joanne') return 'Your great-granddaughter Joanne.';
    return `Your great-grandchild ${name}.`;
  }
  return `Your descendant ${name} (${generationsDown} generations below you).`;
}

/** Ancestor of the viewer's spouse (in-laws and spouse's forebears). */
function describeSpouseLine(viewerId, targetId) {
  const spouseId = getSpouse(viewerId);
  if (!spouseId) return null;
  const spouse = getPerson(spouseId);
  if (!spouse) return null;

  const spParents = getParents(spouseId);
  if (spParents.includes(targetId)) {
    const gender = inferGender(targetId);
    if (gender === 'm') return `Your father-in-law ${firstName(targetId)}.`;
    if (gender === 'f') return `Your mother-in-law ${firstName(targetId)}.`;
    return `Your parent-in-law ${firstName(targetId)}.`;
  }

  const path = bloodPathUp(spouseId, targetId);
  if (!path) return null;

  const generationsUp = path.length - 1;
  const side = bloodSideAt(spouseId, path);
  const role = ancestorRolePhrase(generationsUp, side, inferGender(targetId));
  const target = getPerson(targetId);
  const sName = firstName(spouseId);
  const word = spouseWord(viewerId);

  return `Your ${word} ${sName}'s ${role} ${firstName(targetId)}${target ? lineSuffix(target) : ''}.`;
}

/** Uncle/aunt or great-uncle relative to viewer's parent or grandparent. */
function describeParentSibling(viewerId, targetId) {
  const target = getPerson(targetId);
  if (!target) return null;

  for (const parentId of getParents(viewerId)) {
    if (getParentSiblingIds(parentId).includes(targetId)) {
      if (target.role === 'uncle') return `Your uncle ${firstName(targetId)}.`;
      if (target.role === 'aunt') return `Your aunt ${firstName(targetId)}.`;
    }
    // e.g. Matthew Daly: sibling of viewer's grandparent (parentOf = viewer's parent id)
    const grandparentPeers = PEOPLE.filter(
      (x) => x.parentOf === parentId && x.role === 'great-uncle'
    );
    if (grandparentPeers.some((x) => x.id === targetId)) {
      return `Your great-uncle ${firstName(targetId)}.`;
    }
  }

  return null;
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

  const bloodUp = describeBloodAncestor(viewerId, targetId);
  if (bloodUp) return bloodUp;

  const bloodDown = describeBloodDescendant(viewerId, targetId);
  if (bloodDown) return bloodDown;

  const spouseLine = describeSpouseLine(viewerId, targetId);
  if (spouseLine) return spouseLine;

  if (getParents(viewerId).includes(targetId)) {
    return describeBloodAncestor(viewerId, targetId) ?? `Your parent ${firstName(targetId)}.`;
  }

  if (getParents(targetId).includes(viewerId)) {
    return describeBloodDescendant(viewerId, targetId) ?? `Your child ${firstName(targetId)}.`;
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

  const parentSib = describeParentSibling(viewerId, targetId);
  if (parentSib) return parentSib;

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
      const up = describeBloodAncestor(viewerId, targetId);
      if (up) return up;
    }
    if (distA === 2 && distB === 2) return `Your cousin ${firstName(targetId)}.`;
    if (distB > distA) {
      const gap = distB - distA;
      if (gap >= 2) {
        const up = describeBloodAncestor(viewerId, targetId);
        if (up) return up;
        const viaSpouse = describeSpouseLine(viewerId, targetId);
        if (viaSpouse) return viaSpouse;
      }
    }
    if (distA > distB) {
      const gap = distA - distB;
      if (gap >= 2) {
        const down = describeBloodDescendant(viewerId, targetId);
        if (down) return down;
      }
    }
  }

  const spouseId = getSpouse(viewerId);
  if (spouseId && getSiblings(spouseId).includes(targetId)) {
    if (target.role === 'uncle') return `Your uncle-in-law ${firstName(targetId)}.`;
    if (target.role === 'aunt') return `Your aunt-in-law ${firstName(targetId)}.`;
    return `Your ${spouseWord(viewerId)}'s sibling ${firstName(targetId)}.`;
  }

  if (spouseId) {
    for (const childId of getChildren(viewerId)) {
      if (getSpouse(childId) === targetId) {
        return `Your ${spouseWord(viewerId) === 'husband' ? 'daughter' : 'son'}-in-law ${firstName(targetId)}.`;
      }
    }
  }

  return 'Related by family.';
}
