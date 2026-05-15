import fs from 'fs';

const header = `import './styles.css';
import { LINES, BIOS, PEOPLE, COUPLES, PARENT_OF, BY_ID } from './data/tree.js';
import { LAYOUT, POS } from './layout.js';
import { relationFor } from './lib/relations.js';
import {
  resolveInitialPersona,
  savePersona,
  syncPersonaToUrl,
  getPersonaGroups,
  personaDisplayName,
} from './lib/persona.js';
import { getGenLabelsForMode } from './lib/genLabels.js';

let activePersona = resolveInitialPersona();

function getViewer() {
  return activePersona ? BY_ID[activePersona] : null;
}

function relationText(p) {
  if (!activePersona) return p.relation || '—';
  return relationFor(activePersona, p.id);
}

function relationLabel() {
  return activePersona ? 'Your relationship' : 'Relation to Joanne';
}

function updateChrome() {
  const h1 = document.querySelector('.brand h1');
  const sub = document.getElementById('personaSubtitle');
  const sel = document.getElementById('personaSelect');
  if (h1) h1.textContent = 'Daly';
  if (sub) {
    const name = personaDisplayName(activePersona);
    sub.textContent = name ? \`Viewing as \${name}\` : '';
    sub.hidden = !name;
  }
  if (sel) sel.value = activePersona || '';
}

function setPersona(id) {
  activePersona = id || null;
  if (activePersona) savePersona(activePersona);
  else savePersona(null);
  syncPersonaToUrl(activePersona);
  updateChrome();
  rerenderAll();
}

function rerenderAll() {
  canvas.querySelectorAll('.gen-rail, .card, .cluster').forEach((el) => el.remove());
  svg.innerHTML = '';
  renderDesktop();
  const mv = document.getElementById('mobileView');
  if (mv) {
    mv.innerHTML = '';
    renderMobile();
  }
}

function setupPersonaPicker() {
  const sel = document.getElementById('personaSelect');
  if (!sel) return;
  sel.innerHTML = '';
  for (const group of getPersonaGroups()) {
    const og = document.createElement('optgroup');
    og.label = group.label;
    for (const opt of group.options) {
      const o = document.createElement('option');
      o.value = opt.id;
      o.textContent = opt.name;
      og.appendChild(o);
    }
    sel.appendChild(og);
  }
  sel.value = activePersona || '';
  sel.addEventListener('change', () => setPersona(sel.value || null));
  updateChrome();
}

function mobileGenMeta(g) {
  const labels = getGenLabelsForMode(activePersona, getViewer());
  return { gnum: labels[g].num, gname: labels[g].label };
}

`;

let app = fs.readFileSync('src/_app-raw.js', 'utf8');

app = app.replace(
  "  if (p.id === 'joanne') cls.push('you');",
  "  if (activePersona && p.id === activePersona) cls.push('you');"
);

const railFrom = `  for (let g = 0; g < 5; g++) {
    const y = LAYOUT.topPad + (4 - g) * LAYOUT.rowGap + LAYOUT.cardH/2;
    railHTML += \`<div class="gen-label" style="top:\${y}px"><span class="num">\${GEN_LABELS[g].num}</span>\${GEN_LABELS[g].label}</motion>\`;
    railHTML += \`<div class="gen-line" style="top:\${y}px"></div>\`;
  }`;

const railFromExact = `  for (let g = 0; g < 5; g++) {
    const y = LAYOUT.topPad + (4 - g) * LAYOUT.rowGap + LAYOUT.cardH/2;
    railHTML += \`<div class="gen-label" style="top:\${y}px"><span class="num">\${GEN_LABELS[g].num}</span>\${GEN_LABELS[g].label}</div>\`;
    railHTML += \`<div class="gen-line" style="top:\${y}px"></div>\`;
  }`;

const railTo = `  const genLabels = getGenLabelsForMode(activePersona, getViewer());
  for (let g = 0; g < 5; g++) {
    const y = LAYOUT.topPad + (4 - g) * LAYOUT.rowGap + LAYOUT.cardH/2;
    railHTML += \`<div class="gen-label" style="top:\${y}px"><span class="num">\${genLabels[g].num}</span>\${genLabels[g].label}</div>\`;
    railHTML += \`<motion class="gen-line" style="top:\${y}px"></div>\`;
  }`;

const railToFixed = `  const genLabels = getGenLabelsForMode(activePersona, getViewer());
  for (let g = 0; g < 5; g++) {
    const y = LAYOUT.topPad + (4 - g) * LAYOUT.rowGap + LAYOUT.cardH/2;
    railHTML += \`<div class="gen-label" style="top:\${y}px"><span class="num">\${genLabels[g].num}</span>\${genLabels[g].label}</div>\`;
    railHTML += \`<div class="gen-line" style="top:\${y}px"></div>\`;
  }`;

if (!app.includes(railFromExact)) throw new Error('rail block not found');
app = app.replace(railFromExact, railToFixed);

const relFrom = `  fields.push(\`<div class="field relation"><div class="label">Relation to Joanne</div><div class="val">\${p.relation || '—'}</motion></motion>\`);`;
const relFromExact = `  fields.push(\`<div class="field relation"><div class="label">Relation to Joanne</div><div class="val">\${p.relation || '—'}</motion></motion>\`);`;

const relFrom2 = `  fields.push(\`<div class="field relation"><div class="label">Relation to Joanne</div><div class="val">\${p.relation || '—'}</motion></div>\`);`;

const relExact = `  fields.push(\`<div class="field relation"><div class="label">Relation to Joanne</div><div class="val">\${p.relation || '—'}</div></div>\`);`;
const relTo = `  fields.push(\`<div class="field relation"><div class="label">\${relationLabel()}</div><div class="val">\${relationText(p)}</div></div>\`);`;
if (!app.includes(relExact)) throw new Error('relation field not found');
app = app.replace(relExact, relTo);

app = app.replace("    gnum: 'I', gname: 'You',", '    ...mobileGenMeta(0),');
app = app.replace("    gnum: 'II', gname: 'Parents',", '    ...mobileGenMeta(1),');
app = app.replace("    gnum: 'III', gname: 'Grandparents',", '    ...mobileGenMeta(2),');
app = app.replace("    gnum: 'IV', gname: 'Great-grandparents',", '    ...mobileGenMeta(3),');
app = app.replace("    gnum: 'V', gname: '2× Great-grandparents',", '    ...mobileGenMeta(4),');

const initFrom = `function init() {
  renderDesktop();
  renderMobile();
  attachCardClicks(canvas);
  attachCardClicks(document.getElementById('mobileView'));

  // Open Joanne by default after a brief moment
  setTimeout(() => {
    // Don't auto-open; just leave clean
  }, 400);
}
init();`;

const initTo = `function init() {
  setupPersonaPicker();
  renderDesktop();
  renderMobile();
  attachCardClicks(canvas);
  attachCardClicks(document.getElementById('mobileView'));
}
init();`;

app = app.replace(initFrom, initTo);

fs.writeFileSync('src/main.js', header + app);
console.log('ok');
