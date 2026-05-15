import { PEOPLE, COUPLES, PARENT_OF, BY_ID } from '../data/tree.js';

/** @type {Map<string, string[]>} */
const childrenOf = new Map();

for (const [childId, parentIds] of Object.entries(PARENT_OF)) {
  for (const pid of parentIds) {
    if (!childrenOf.has(pid)) childrenOf.set(pid, []);
    childrenOf.get(pid).push(childId);
  }
}

const spouseOf = new Map();
for (const [a, b] of COUPLES) {
  spouseOf.set(a, b);
  spouseOf.set(b, a);
}

/** @param {string} id */
export function getPerson(id) {
  return BY_ID[id] ?? null;
}

/** @param {string} id */
export function getParents(id) {
  return PARENT_OF[id] ? [...PARENT_OF[id]] : [];
}

/** @param {string} id */
export function getChildren(id) {
  return childrenOf.get(id) ? [...childrenOf.get(id)] : [];
}

/** @param {string} id */
export function getSpouse(id) {
  const s = spouseOf.get(id);
  return s ?? null;
}

/** Siblings via shared parents and/or parentOf (uncles ↔ parents). */
export function getSiblings(id) {
  const set = new Set();
  const person = getPerson(id);
  const parents = getParents(id);

  if (parents.length) {
    for (const parent of parents) {
      for (const child of getChildren(parent)) {
        if (child !== id) set.add(child);
      }
    }
  }

  // Uncles/aunts list parentOf = sibling of that parent
  for (const p of PEOPLE) {
    if (p.parentOf === id) set.add(p.id);
  }
  if (person?.parentOf) {
    const anchorId = person.parentOf;
    set.add(anchorId);
    for (const p of PEOPLE) {
      if (p.parentOf === anchorId) set.add(p.id);
    }
    for (const sib of getSiblings(anchorId)) {
      if (sib !== id) set.add(sib);
    }
  }

  set.delete(id);
  return [...set];
}

/** Uncles/aunts: siblings of a parent (via parentOf metadata or shared grandparents) */
export function getParentSiblingIds(parentId) {
  const p = getPerson(parentId);
  if (!p) return [];
  return PEOPLE.filter(
    (x) =>
      (x.role === 'uncle' || x.role === 'aunt') && x.parentOf === parentId
  ).map((x) => x.id);
}

/** BFS ancestors with depth */
export function ancestorDepths(id) {
  /** @type {Map<string, number>} */
  const depths = new Map([[id, 0]]);
  const queue = [id];
  while (queue.length) {
    const cur = queue.shift();
    const d = depths.get(cur);
    for (const p of getParents(cur)) {
      if (!depths.has(p)) {
        depths.set(p, d + 1);
        queue.push(p);
      }
    }
  }
  return depths;
}

/** Lowest common ancestor id and distances, or null */
export function findLca(a, b) {
  if (a === b) return { lca: a, distA: 0, distB: 0 };
  const depthsA = ancestorDepths(a);
  const depthsB = ancestorDepths(b);
  let best = null;
  let bestSum = Infinity;
  for (const [anc, da] of depthsA) {
    if (!depthsB.has(anc)) continue;
    const db = depthsB.get(anc);
    const sum = da + db;
    if (sum < bestSum) {
      bestSum = sum;
      best = { lca: anc, distA: da, distB: db };
    }
  }
  return best;
}

export function areSpouses(a, b) {
  return getSpouse(a) === b;
}

export { childrenOf, PEOPLE, COUPLES, PARENT_OF, BY_ID };
