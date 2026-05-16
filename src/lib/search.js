import { LINES } from '../data/tree.js';

const SEARCH_GEN_LABELS = [
  "Joanne's generation",
  'Parents',
  'Grandparents',
  'Great-grandparents',
  '2× great-grandparents',
];

/** Short subtitle for search result rows (line + generation + dates). */
export function searchResultMeta(p) {
  const lineLabel = LINES[p.line]?.label ?? p.line;
  const genLabel = SEARCH_GEN_LABELS[p.gen] ?? `Generation ${p.gen}`;
  const parts = [lineLabel, genLabel];
  if (p.role === 'great-uncle') parts.push('Great-uncle');
  else if (p.role === 'sibling') parts.push("Joanne's brother");
  else if (p.role === 'parent') parts.push("Joanne's parent");
  else if (p.role === 'uncle') parts.push('Uncle');
  else if (p.role === 'aunt') parts.push('Aunt');
  if (p.dob) parts.push(`b. ${p.dob}`);
  return parts.join(' · ');
}
