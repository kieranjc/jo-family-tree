import { GEN_LABELS } from '../layout.js';

const RELATIVE = {
  0: { num: 'I', label: 'You' },
  1: { num: 'II', label: 'Parents' },
  2: { num: 'III', label: 'Grandparents' },
  3: { num: 'IV', label: 'Great-grandparents' },
  4: { num: 'V', label: '2× Great-grandparents' },
  [-1]: { num: 'II', label: 'Children' },
  [-2]: { num: 'III', label: 'Grandchildren' },
  [-3]: { num: 'IV', label: 'Great-grandchildren' },
};

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];

/** Default Daly tree: fixed labels, gen 0 not "You" */
export function getDefaultGenLabels() {
  return GEN_LABELS.map((g, i) => {
    if (i === 0) return { num: g.num, label: 'Family' };
    return { ...g };
  });
}

/** Persona mode: labels relative to viewer generation */
export function getPersonaGenLabels(viewerGen) {
  const labels = [];
  for (let g = 0; g < 5; g++) {
    const diff = viewerGen - g;
    const rel = RELATIVE[diff];
    if (rel) {
      labels.push({ ...rel });
    } else if (diff > 4) {
      labels.push({ num: ROMAN[g] ?? '·', label: `${diff} generations above you` });
    } else if (diff < -3) {
      labels.push({ num: ROMAN[g] ?? '·', label: `${-diff} generations below you` });
    } else {
      labels.push({ num: GEN_LABELS[g].num, label: GEN_LABELS[g].label });
    }
  }
  return labels;
}

/**
 * @param {string | null} activePersona
 * @param {{ gen: number } | null} viewer
 */
export function getGenLabelsForMode(activePersona, viewer) {
  if (!activePersona || !viewer) return getDefaultGenLabels();
  return getPersonaGenLabels(viewer.gen);
}
