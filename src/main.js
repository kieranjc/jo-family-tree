import './styles.css';
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
import {
  getGen0ViewMode,
  getGen0SiblingChipPeople,
  getGen0SiblingClusterTitle,
  getGen0MobileFamilyLabel,
  showGen0PersonaLead,
} from './lib/gen0View.js';
import { searchResultMeta } from './lib/search.js';

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
    sub.textContent = name ? `Viewing as ${name}` : '';
    sub.hidden = !name;
  }
  if (sel) sel.value = activePersona || '';
}

function setPersona(id) {
  activePersona = id || null;
  if (activePersona) savePersona(activePersona);
  else savePersona(null);
  syncPersonaToUrl(activePersona);
  closePanel();
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

/* ============================================================
   RENDER
   ============================================================ */
const stage = document.getElementById('stage');
const canvas = document.getElementById('canvas');
const svg = document.getElementById('connectors');

function fmtName(p) { return p.name; }
function lifespan(p) {
  if (!p.dob && !p.dod) return '';
  const dob = p.dob || '?';
  const dod = p.dod || (p.gen === 0 || p.gen === 1 ? '' : '');
  if (p.dod) return `${dob} – ${p.dod}`;
  if (p.dob) return `b. ${p.dob}`;
  return '';
}

function chipHTML(p) {
  const you = activePersona && p.id === activePersona ? ' you' : '';
  const bio = BIOS[p.id] ? ' has-bio-chip' : '';
  const line = p.line === 'joanne' ? 'daly' : p.line;
  return `<div class="chip line-${line}${you}${bio}" data-id="${p.id}">${p.name.split(' ')[0]}${p.dob ? ` <span class="chip-sub">${p.dob}</span>` : ''}</div>`;
}

function mchipHTML(p) {
  const you = activePersona && p.id === activePersona ? ' you' : '';
  const bio = BIOS[p.id] ? ' has-bio' : '';
  const line = p.line === 'joanne' ? 'daly' : p.line;
  return `<div class="mchip line-${line}${you}${bio}" data-id="${p.id}">${p.name} <span class="sub">${p.dob || ''}</span></div>`;
}

function cardHTML(p, opts = {}) {
  const cls = ['card', `line-${p.line}`];
  if (p.dod) cls.push('deceased');
  if (activePersona && p.id === activePersona) cls.push('you');
  if (opts.compact) cls.push('compact');
  if (BIOS[p.id]) cls.push('has-bio');
  const meta = [];
  if (p.dob) meta.push(p.dob);
  if (p.birthplace) meta.push(p.birthplace);
  if (p.dod) meta.push(`d. ${p.dod}`);
  return `
    <div class="${cls.join(' ')}" data-id="${p.id}" style="left:${POS[p.id].x}px;top:${POS[p.id].y}px">
      <div class="name">${p.name}</div>
      <div class="meta">${meta.length ? meta.join('<span class="dash">·</span>') : '<em style="opacity:.5">no record</em>'}</div>
    </div>`;
}

// Render the desktop tree
function renderDesktop() {
  // Generation rail labels
  let railHTML = '';
  const genLabels = getGenLabelsForMode(activePersona, getViewer());
  for (let g = 0; g < 5; g++) {
    const y = LAYOUT.topPad + (4 - g) * LAYOUT.rowGap + LAYOUT.cardH/2;
    railHTML += `<div class="gen-label" style="top:${y}px"><span class="num">${genLabels[g].num}</span>${genLabels[g].label}</div>`;
    railHTML += `<div class="gen-line" style="top:${y}px"></div>`;
  }
  const railDiv = document.createElement('div');
  railDiv.className = 'gen-rail';
  railDiv.innerHTML = railHTML;
  canvas.appendChild(railDiv);

  // Cards for everyone with a POS
  let cards = '';
  PEOPLE.forEach(p => {
    if (POS[p.id]) cards += cardHTML(p);
  });

  const gen0Mode = getGen0ViewMode(activePersona, getViewer());
  const sibChips = getGen0SiblingChipPeople(gen0Mode, activePersona, { includePersonaLead: true });
  const kieranPos = POS['kieran'];
  const sibsBox = {
    x: kieranPos.x + LAYOUT.cardW + 30,
    y: kieranPos.y - 8,
    w: Math.max(230, sibChips.length * 52),
  };
  let sibsHTML = `
    <div class="siblings line-daly" data-cluster="siblings" style="left:${sibsBox.x}px;top:${sibsBox.y}px;width:${sibsBox.w}px">
      <div class="title">${getGen0SiblingClusterTitle(gen0Mode)}</div>
      <div class="chips">
        ${sibChips.map((s) => chipHTML(s)).join('')}
      </div>
    </div>`;


  // Uncles cluster (paternal — Daly) above/beside John Daly
  const dalyUncles = PEOPLE.filter(p => (p.role === 'uncle' || p.role === 'aunt') && p.parentOf === 'john_daly');
  const johnPos = POS['john_daly'];
  const dalyBox = {
    x: johnPos.x - 270,
    y: johnPos.y + 4,
    w: 250,
  };
  let dalyUnclesHTML = `
    <div class="siblings line-daly" style="left:${dalyBox.x}px;top:${dalyBox.y}px;width:${dalyBox.w}px">
      <div class="title">Paternal uncles &amp; aunts</div>
      <div class="chips">
        ${dalyUncles.map(s => `<div class="chip line-daly" data-id="${s.id}">${s.name.replace(' Daly','')}</div>`).join('')}
      </div>
    </div>`;

  // Byron aunts & uncles — beside Joan Byron
  const byronAunts = PEOPLE.filter(p => (p.role === 'uncle' || p.role === 'aunt') && p.parentOf === 'joan_byron');
  const joanPos = POS['joan_byron'];
  const byronBox = {
    x: joanPos.x + LAYOUT.cardW + 28,
    y: joanPos.y + 4,
    w: 280,
  };
  let byronAuntsHTML = `
    <div class="siblings line-byron" style="left:${byronBox.x}px;top:${byronBox.y}px;width:${byronBox.w}px">
      <div class="title">Maternal aunts &amp; uncles</div>
      <div class="chips">
        ${byronAunts.map(s => `<div class="chip line-byron" data-id="${s.id}">${s.name.replace(' Byron','')}</div>`).join('')}
      </div>
    </div>`;

  // Great-uncle (Matthew Daly) — Michael Daly's elder brother
  const gUncles = PEOPLE.filter(p => p.role === 'great-uncle' && p.parentOf === 'gp_michael_daly');
  const michaelPos = POS['gp_michael_daly'];
  const gUncleBox = {
    x: michaelPos.x - 200,
    y: michaelPos.y + 4,
    w: 180,
  };
  let gUnclesHTML = '';
  if (gUncles.length) {
    gUnclesHTML = `
      <div class="siblings line-daly" style="left:${gUncleBox.x}px;top:${gUncleBox.y}px;width:${gUncleBox.w}px">
        <div class="title">Great-uncle</div>
        <div class="chips">
          ${gUncles.map(s => {
            const bioCls = BIOS[s.id] ? ' has-bio-chip' : '';
            return `<div class="chip line-daly${bioCls}" data-id="${s.id}">${s.name.replace(' Daly','')}</div>`;
          }).join('')}
        </div>
      </div>`;
  }

  // Inject into canvas (after svg)
  const wrap = document.createElement('div');
  wrap.innerHTML = cards + sibsHTML + dalyUnclesHTML + byronAuntsHTML + gUnclesHTML;
  while (wrap.firstChild) canvas.appendChild(wrap.firstChild);

  drawConnectors();
  computeCanvasBounds();
  fitToScreen(true);
}

function drawConnectors() {
  // Determine bounding box first to set svg size
  let maxX = 0, maxY = 0;
  PEOPLE.forEach(p => {
    if (POS[p.id]) {
      maxX = Math.max(maxX, POS[p.id].x + LAYOUT.cardW);
      maxY = Math.max(maxY, POS[p.id].y + LAYOUT.cardH);
    }
  });
  maxX += 320; // siblings cluster
  maxY += 80;
  svg.setAttribute('width', maxX);
  svg.setAttribute('height', maxY);
  svg.setAttribute('viewBox', `0 0 ${maxX} ${maxY}`);

  let paths = '';
  // Couple connectors (dashed, horizontal)
  COUPLES.forEach(([a, b]) => {
    if (!POS[a] || !POS[b]) return;
    const aP = POS[a], bP = POS[b];
    const y = aP.y + LAYOUT.cardH/2;
    const x1 = aP.x + LAYOUT.cardW;
    const x2 = bP.x;
    paths += `<path class="couple" d="M ${x1} ${y} L ${x2} ${y}"/>`;
    // Marriage marker (rendered as DOM div below)
  });

  // Parent → child connectors (curved, solid)
  // Strategy: from couple midpoint at top of child's parent row, curve down to child's top
  Object.entries(PARENT_OF).forEach(([childId, parents]) => {
    if (!POS[childId]) return;
    const [pa, pb] = parents;
    if (!POS[pa] || !POS[pb]) return;
    const child = POS[childId];
    const a = POS[pa], b = POS[pb];
    const startX = (a.x + b.x + LAYOUT.cardW * 2) / 2; // midpoint between cards
    const startY = a.y + LAYOUT.cardH; // bottom of parent row
    const endX = child.x + LAYOUT.cardW / 2;
    const endY = child.y;
    const midY = (startY + endY) / 2;
    paths += `<path class="parent" d="M ${startX} ${startY} C ${startX} ${midY}, ${endX} ${midY}, ${endX} ${endY}"/>`;
  });

  // Siblings of Joanne all share John+Joan parents → already covered in PARENT_OF
  // But Joanne's siblings — we don't draw individual cards for them; they're chips.
  // So we draw a single bracket from John+Joan midpoint down to the siblings cluster top.
  const sibsClusterEl = null; // we'll get coords after DOM placement

  svg.innerHTML = paths;

  // Marriage markers (small dots between couple cards) as DOM (so they sit above svg)
  // Clear existing
  canvas.querySelectorAll('.marriage-marker').forEach(el => el.remove());
  COUPLES.forEach(([a, b]) => {
    if (!POS[a] || !POS[b]) return;
    const aP = POS[a], bP = POS[b];
    const midX = (aP.x + LAYOUT.cardW + bP.x) / 2;
    const midY = aP.y + LAYOUT.cardH/2;
    const dot = document.createElement('div');
    dot.className = 'marriage-marker';
    dot.style.left = `${midX}px`;
    dot.style.top = `${midY}px`;
    canvas.appendChild(dot);
  });
}

let CANVAS_BOUNDS = { w: 2000, h: 1000 };
function computeCanvasBounds() {
  let maxX = 0, maxY = 0;
  canvas.querySelectorAll('.card, .siblings').forEach(el => {
    const x = parseFloat(el.style.left) + el.offsetWidth;
    const y = parseFloat(el.style.top) + el.offsetHeight;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
  });
  CANVAS_BOUNDS = { w: maxX + 60, h: maxY + 60 };
}

/* ============================================================
   ZOOM + PAN
   ============================================================ */
let view = { x: 0, y: 0, scale: 1 };
function applyView() {
  canvas.style.transform = `translate(${view.x}px, ${view.y}px) scale(${view.scale})`;
}
function fitToScreen(initial = false) {
  const sw = stage.clientWidth, sh = stage.clientHeight;
  const scaleX = sw / CANVAS_BOUNDS.w;
  const scaleY = sh / CANVAS_BOUNDS.h;
  let s = Math.min(scaleX, scaleY, 1);
  s = Math.max(s, 0.35);
  view.scale = s;
  view.x = (sw - CANVAS_BOUNDS.w * s) / 2;
  view.y = (sh - CANVAS_BOUNDS.h * s) / 2;
  applyView();
  if (initial) {
    const hint = document.getElementById('panHint');
    hint.classList.add('show');
    setTimeout(() => hint.classList.remove('show'), 2800);
  }
}
function zoomBy(factor, cx, cy) {
  const sw = stage.clientWidth, sh = stage.clientHeight;
  if (cx === undefined) { cx = sw / 2; cy = sh / 2; }
  const newScale = Math.min(2.4, Math.max(0.25, view.scale * factor));
  // zoom about pointer
  const wx = (cx - view.x) / view.scale;
  const wy = (cy - view.y) / view.scale;
  view.scale = newScale;
  view.x = cx - wx * newScale;
  view.y = cy - wy * newScale;
  applyView();
}

// Mouse pan
let dragging = false, dragStart = null;
stage.addEventListener('mousedown', (e) => {
  if (e.target.closest('.card') || e.target.closest('.chip')) return;
  dragging = true;
  stage.classList.add('grabbing');
  dragStart = { x: e.clientX - view.x, y: e.clientY - view.y };
});
window.addEventListener('mousemove', (e) => {
  if (!dragging) return;
  view.x = e.clientX - dragStart.x;
  view.y = e.clientY - dragStart.y;
  applyView();
});
window.addEventListener('mouseup', () => {
  dragging = false;
  stage.classList.remove('grabbing');
});

// Wheel zoom
stage.addEventListener('wheel', (e) => {
  e.preventDefault();
  const rect = stage.getBoundingClientRect();
  const cx = e.clientX - rect.left, cy = e.clientY - rect.top;
  const factor = e.deltaY < 0 ? 1.12 : 1/1.12;
  zoomBy(factor, cx, cy);
}, { passive: false });

// Touch pinch + pan
let touchState = null;
stage.addEventListener('touchstart', (e) => {
  if (e.touches.length === 1) {
    touchState = { mode: 'pan', startX: e.touches[0].clientX - view.x, startY: e.touches[0].clientY - view.y };
  } else if (e.touches.length === 2) {
    const [t1, t2] = e.touches;
    const dx = t2.clientX - t1.clientX, dy = t2.clientY - t1.clientY;
    const dist = Math.hypot(dx, dy);
    const cx = (t1.clientX + t2.clientX)/2, cy = (t1.clientY + t2.clientY)/2;
    touchState = { mode: 'pinch', startDist: dist, startScale: view.scale, cx, cy };
  }
}, { passive: true });
stage.addEventListener('touchmove', (e) => {
  if (!touchState) return;
  if (touchState.mode === 'pan' && e.touches.length === 1) {
    view.x = e.touches[0].clientX - touchState.startX;
    view.y = e.touches[0].clientY - touchState.startY;
    applyView();
  } else if (touchState.mode === 'pinch' && e.touches.length === 2) {
    const [t1, t2] = e.touches;
    const dx = t2.clientX - t1.clientX, dy = t2.clientY - t1.clientY;
    const dist = Math.hypot(dx, dy);
    const factor = dist / touchState.startDist;
    const targetScale = Math.min(2.4, Math.max(0.25, touchState.startScale * factor));
    const rect = stage.getBoundingClientRect();
    const cx = touchState.cx - rect.left, cy = touchState.cy - rect.top;
    const wx = (cx - view.x) / view.scale;
    const wy = (cy - view.y) / view.scale;
    view.scale = targetScale;
    view.x = cx - wx * targetScale;
    view.y = cy - wy * targetScale;
    applyView();
  }
}, { passive: true });
stage.addEventListener('touchend', () => { touchState = null; }, { passive: true });

// Toolbar
document.getElementById('zoomIn').addEventListener('click', () => zoomBy(1.2));
document.getElementById('zoomOut').addEventListener('click', () => zoomBy(1/1.2));
document.getElementById('zoomReset').addEventListener('click', () => fitToScreen());
window.addEventListener('resize', () => {
  if (window.innerWidth > 800) fitToScreen();
});

/* ============================================================
   SELECTION + PANEL
   ============================================================ */
const panel = document.getElementById('panel');
const scrim = document.getElementById('scrim');
function openPerson(id) {
  const p = BY_ID[id];
  if (!p) return;
  // Visual focus
  document.querySelectorAll('.card.focused').forEach(el => el.classList.remove('focused'));
  const cardEl = document.querySelector(`.card[data-id="${id}"]`);
  if (cardEl) cardEl.classList.add('focused');

  // Fill panel
  const line = LINES[p.line];
  panel.className = `panel show ${line.cssClass}`;
  const tag = document.getElementById('panelLineTag');
  tag.textContent = line.label;
  document.getElementById('panelName').textContent = p.name;
  const body = document.getElementById('panelBody');
  // Fields
  const fields = [];
  if (p.dob || p.dod) {
    let lspan = '';
    if (p.dob) lspan += `<span class="yr">b. ${p.dob}</span>`;
    if (p.dob && p.dod) lspan += `<span class="sep">—</span>`;
    if (p.dod) lspan += `<span class="yr">d. ${p.dod}</span>`;
    fields.push(`<div class="field"><div class="label">Lifespan</div><div class="val"><span class="lifespan">${lspan}</span></div></div>`);
  } else {
    fields.push(`<div class="field"><div class="label">Lifespan</div><div class="val muted">Dates unrecorded</div></div>`);
  }
  if (p.birthplace) {
    fields.push(`<div class="field"><div class="label">Birthplace</div><div class="val">${p.birthplace}</div></div>`);
  } else {
    fields.push(`<div class="field"><div class="label">Birthplace</div><div class="val muted">Unknown</div></div>`);
  }
  const bioField = BIOS[p.id]
    ? (() => {
        const paras = BIOS[p.id].map(t => `<p>${t}</p>`).join('');
        return `<div class="field bio"><div class="label">Biography</div><div class="val bio-body">${paras}</div></div>`;
      })()
    : '';
  const isMobile = window.innerWidth <= 800;
  if (isMobile && bioField) fields.push(bioField);

  fields.push(`<div class="field"><div class="label">Family line</div><div class="val">${line.label}</div></div>`);
  fields.push(`<div class="field relation"><div class="label">${relationLabel()}</div><div class="val">${relationText(p)}</div></div>`);

  if (!isMobile && bioField) fields.push(bioField);

  // Spouse
  const couple = COUPLES.find(c => c.includes(p.id));
  if (couple) {
    const otherId = couple[0] === p.id ? couple[1] : couple[0];
    const o = BY_ID[otherId];
    fields.push(`<div class="field"><div class="label">Married to</div><div class="val"><a href="#" class="link" data-id="${otherId}" style="color:var(--ink);text-decoration:underline;text-decoration-color:var(--rule);text-underline-offset:3px">${o.name}</a></div></div>`);
  }
  // Parents
  if (PARENT_OF[p.id]) {
    const ps = PARENT_OF[p.id].map(id => `<a href="#" class="link" data-id="${id}" style="color:var(--ink);text-decoration:underline;text-decoration-color:var(--rule);text-underline-offset:3px">${BY_ID[id].name}</a>`).join(' &amp; ');
    fields.push(`<div class="field"><div class="label">Parents</div><div class="val">${ps}</div></div>`);
  }

  body.innerHTML = fields.join('');
  body.scrollTop = 0;
  body.querySelectorAll('.link').forEach(a => {
    a.addEventListener('click', (e) => { e.preventDefault(); openPerson(a.dataset.id); });
  });
  scrim.classList.add('show');
  panel.setAttribute('aria-hidden', 'false');
  if (window.innerWidth <= 800) document.body.classList.add('panel-open');
}
function closePanel() {
  panel.classList.remove('show');
  scrim.classList.remove('show');
  panel.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('panel-open');
  document.querySelectorAll('.card.focused').forEach(el => el.classList.remove('focused'));
}
document.getElementById('panelClose').addEventListener('click', closePanel);
scrim.addEventListener('click', closePanel);
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  if (panel.classList.contains('show')) {
    closePanel();
    return;
  }
  if (topbarEl?.classList.contains('search-open')) {
    collapseMobileSearch();
    return;
  }
  if (topbarEl?.classList.contains('persona-open')) {
    collapseMobilePersona();
    return;
  }
});

// Delegate clicks for cards & chips
function attachCardClicks(root) {
  root.addEventListener('click', (e) => {
    const cardEl = e.target.closest('.card');
    if (cardEl) { openPerson(cardEl.dataset.id); return; }
    const chipEl = e.target.closest('.chip, .mchip');
    if (chipEl && chipEl.dataset.id) { openPerson(chipEl.dataset.id); return; }
    const mcardEl = e.target.closest('.mcard');
    if (mcardEl) { openPerson(mcardEl.dataset.id); return; }
  });
}

/* ============================================================
   MOBILE RENDER
   ============================================================ */
function mobileHeaderOffset() {
  const topbar = document.querySelector('header.app');
  return topbar ? topbar.getBoundingClientRect().height + 10 : 72;
}

function openMobileGenSection(section, { scroll = true } = {}) {
  const mv = document.getElementById('mobileView');
  if (!mv || !section) return;
  mv.querySelectorAll('.gen-section').forEach(sec => {
    sec.classList.toggle('collapsed', sec !== section);
  });
  if (scroll) {
    requestAnimationFrame(() => {
      const top = section.getBoundingClientRect().top + window.scrollY - mobileHeaderOffset();
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    });
  }
}

function renderMobile() {
  const mv = document.getElementById('mobileView');
  // Build sections per generation
  const sections = [];

  // Gen 0: You
  sections.push({
    ...mobileGenMeta(0),
    content: () => {
      const gen0Mode = getGen0ViewMode(activePersona, getViewer());
      const chipPeople = getGen0SiblingChipPeople(gen0Mode, activePersona);
      let html = '';
      if (showGen0PersonaLead(gen0Mode) && activePersona) {
        html += `<div class="mlabel">You</div>`;
        html += renderMCard(activePersona);
      }
      html += `<div class="mlabel${showGen0PersonaLead(gen0Mode) ? ' style="margin-top:14px"' : ''}">${getGen0MobileFamilyLabel(gen0Mode)}</div>`;
      html += `<div class="mcouple">
        ${renderMCard('joanne')}
        ${renderMCard('kieran')}
        <div class="between">— married —</div>
      </div>`;
      if (chipPeople.length) {
        html += `<div class="mlabel" style="margin-top:14px">${getGen0SiblingClusterTitle(gen0Mode)}</div>`;
        html += `<div class="mchips">${chipPeople.map((s) => mchipHTML(s)).join('')}</div>`;
      }
      return html;
    }
  });
  // Gen 1: Parents
  sections.push({
    ...mobileGenMeta(1),
    content: () => {
      let html = `<div class="mcouple">
        ${renderMCard('john_daly')}
        ${renderMCard('joan_byron')}
        <div class="between">— married —</div>
      </div>`;
      const dalyU = PEOPLE.filter(p => p.parentOf === 'john_daly');
      const byronU = PEOPLE.filter(p => p.parentOf === 'joan_byron');
      html += `<div class="mlabel" style="margin-top:14px">Paternal uncles</div>`;
      html += `<div class="mchips">${dalyU.map(s => `<div class="mchip line-daly" data-id="${s.id}">${s.name}</div>`).join('')}</div>`;
      html += `<div class="mlabel" style="margin-top:14px">Maternal aunts &amp; uncles</div>`;
      html += `<div class="mchips">${byronU.map(s => `<div class="mchip line-byron" data-id="${s.id}">${s.name.replace(' Byron','')}</div>`).join('')}</div>`;
      return html;
    }
  });
  // Gen 2: Grandparents
  sections.push({
    ...mobileGenMeta(2),
    content: () => {
      const gUncles = PEOPLE.filter(p => p.role === 'great-uncle' && p.parentOf === 'gp_michael_daly');
      const gUncleHTML = gUncles.length ? `
        <div class="mlabel" style="margin-top:14px">Paternal great-uncle</div>
        <div class="mchips">${gUncles.map(s => `<div class="mchip line-daly${BIOS[s.id] ? ' has-bio' : ''}" data-id="${s.id}">${s.name} <span class="sub">${s.dob||''}</span></div>`).join('')}</div>
      ` : '';
      return `
        <div class="mlabel">Paternal</div>
        <div class="mcouple">${renderMCard('gp_michael_daly')}${renderMCard('gp_mary_curran')}<div class="between">— married —</div></div>
        <div class="mlabel" style="margin-top:14px">Maternal</div>
        <div class="mcouple">${renderMCard('gp_james_byron')}${renderMCard('gp_nora_barrett')}<div class="between">— married —</div></div>
        ${gUncleHTML}
      `;
    }
  });
  // Gen 3: Great-grandparents
  sections.push({
    ...mobileGenMeta(3),
    content: () => {
      return `
        <div class="mlabel">Daly line</div>
        <div class="mcouple">${renderMCard('ggp_patrick_daly')}${renderMCard('ggp_mary_barry')}<div class="between">— married —</div></div>
        <div class="mlabel" style="margin-top:14px">Curran · McCarthy line</div>
        <div class="mcouple">${renderMCard('ggp_william_curran')}${renderMCard('ggp_thomasine_mcc')}<div class="between">— married —</div></div>
        <div class="mlabel" style="margin-top:14px">Byron line</div>
        <div class="mcouple">${renderMCard('ggp_frederick_byron')}${renderMCard('ggp_florence_ritchie')}<div class="between">— married —</div></div>
        <div class="mlabel" style="margin-top:14px">Barrett · Scott line</div>
        <div class="mcouple">${renderMCard('ggp_george_barrett')}${renderMCard('ggp_margaret_scott')}<div class="between">— married —</div></div>
      `;
    }
  });
  // Gen 4
  sections.push({
    ...mobileGenMeta(4),
    content: () => {
      return `
        <div class="mlabel">Daly line</div>
        <div class="mcouple">${renderMCard('g4_mathew_daly')}${renderMCard('g4_mary_horgan')}<div class="between">— married —</div></div>
        <div class="mlabel" style="margin-top:14px">Barry line</div>
        <div class="mcouple">${renderMCard('g4_richard_barry')}${renderMCard('g4_mary_horrigan')}<div class="between">— married —</div></div>
        <div class="mlabel" style="margin-top:14px">Curran line</div>
        <div class="mcouple">${renderMCard('g4_michael_curran')}${renderMCard('g4_ellen_brien')}<div class="between">— married —</div></div>
        <div class="mlabel" style="margin-top:14px">McCarthy line</div>
        <div class="mcouple">${renderMCard('g4_humphrey_mcc')}${renderMCard('g4_mary_hegarty')}<div class="between">— married —</div></div>
        <div class="mlabel" style="margin-top:14px">Barrett line</div>
        <div class="mcouple">${renderMCard('g4_joseph_barrett')}${renderMCard('g4_julia_crockett')}<div class="between">— married —</div></div>
        <div class="mlabel" style="margin-top:14px">Scott line</div>
        <div class="mcouple">${renderMCard('g4_alexander_scott')}${renderMCard('g4_alice_flynn')}<div class="between">— married —</div></div>
      `;
    }
  });

  let html = '';
  sections.forEach((s, i) => {
    const collapsed = i === 0 ? '' : 'collapsed';
    html += `
      <div class="gen-section ${collapsed}" data-gen-section="${i}">
        <button class="gen-toggle" type="button">
          <span class="gtitle">
            <span class="gnum">Generation ${s.gnum}</span>
            <span class="gname">${s.gname}</span>
          </span>
          <span class="caret" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg></span>
        </button>
        <div class="gen-body">${s.content()}</div>
      </div>`;
  });
  mv.innerHTML = html;

  mv.querySelectorAll('.gen-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const section = btn.closest('.gen-section');
      const isOpen = !section.classList.contains('collapsed');
      if (isOpen) {
        section.classList.add('collapsed');
      } else {
        openMobileGenSection(section);
      }
    });
  });
}

function renderMCard(id) {
  const p = BY_ID[id];
  if (!p) return '';
  const meta = [];
  if (p.dob) meta.push(`b. ${p.dob}`);
  if (p.dod) meta.push(`d. ${p.dod}`);
  if (p.birthplace) meta.push(p.birthplace);
  const bioCls = BIOS[p.id] ? ' has-bio' : '';
  const youCls = activePersona && id === activePersona ? ' you' : '';
  return `
    <div class="mcard line-${p.line}${bioCls}${youCls}" data-id="${p.id}">
      <div class="name">${p.name}</div>
      <div class="meta">${meta.join(' · ') || 'no record'}</div>
    </div>`;
}

/* ============================================================
   SEARCH
   ============================================================ */
const searchInput = document.getElementById('searchInput');
const searchCount = document.getElementById('searchCount');
const searchResults = document.getElementById('searchResults');
const searchToggle = document.getElementById('searchToggle');

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function clearSearchHighlights() {
  document.querySelectorAll(
    '.card.match, .card.dimmed, .mcard.match, .chip.match, .chip.dimmed, .mchip.match'
  ).forEach((el) => {
    el.classList.remove('match', 'dimmed');
  });
}

function applySearchHighlights(matches) {
  const matchIds = new Set(matches.map((m) => m.id));
  document.querySelectorAll('.card').forEach((el) => {
    const id = el.dataset.id;
    if (matchIds.has(id)) el.classList.add('match');
    else el.classList.add('dimmed');
  });
  document.querySelectorAll('.chip').forEach((el) => {
    const id = el.dataset.id;
    if (!id) return;
    if (matchIds.has(id)) el.classList.add('match');
    else el.classList.add('dimmed');
  });
  document.querySelectorAll('.mcard, .mchip').forEach((el) => {
    const id = el.dataset.id;
    if (id && matchIds.has(id)) el.classList.add('match');
  });
}

function hideSearchResults() {
  if (!searchResults) return;
  searchResults.hidden = true;
  searchResults.innerHTML = '';
  searchInput?.setAttribute('aria-expanded', 'false');
}

function renderSearchResults(matches, activeId = null) {
  if (!searchResults) return;
  searchResults.innerHTML = '';
  if (!searchInput.value.trim()) {
    hideSearchResults();
    return;
  }
  searchInput.setAttribute('aria-expanded', 'true');
  searchResults.hidden = false;

  if (matches.length === 0) {
    const empty = document.createElement('li');
    empty.className = 'search-result-empty';
    empty.textContent = 'No matches';
    searchResults.appendChild(empty);
    return;
  }

  for (const p of matches) {
    const li = document.createElement('li');
    li.className = `search-result line-${p.line}${p.id === activeId ? ' active' : ''}`;
    li.setAttribute('role', 'option');
    li.dataset.id = p.id;
    li.innerHTML = `<span class="search-result-name">${escapeHtml(p.name)}</span><span class="search-result-meta">${escapeHtml(searchResultMeta(p))}</span>`;
    li.addEventListener('click', (e) => {
      e.preventDefault();
      focusSearchMatch(p.id);
    });
    searchResults.appendChild(li);
  }
}

function focusSearchMatch(id) {
  const q = searchInput.value.trim().toLowerCase();
  const matches = q ? PEOPLE.filter((p) => p.name.toLowerCase().includes(q)) : [];
  clearSearchHighlights();
  if (matches.length) applySearchHighlights(matches);
  renderSearchResults(matches, id);

  if (window.innerWidth > 800) {
    const pos = POS[id];
    if (pos) {
      const sw = stage.clientWidth;
      const sh = stage.clientHeight;
      view.x = sw / 2 - (pos.x + LAYOUT.cardW / 2) * view.scale;
      view.y = sh / 2 - (pos.y + LAYOUT.cardH / 2) * view.scale;
      applyView();
      return;
    }
    const chip = document.querySelector(`.chip[data-id="${id}"]`);
    if (chip) {
      const chipRect = chip.getBoundingClientRect();
      const stageRect = stage.getBoundingClientRect();
      const px =
        (chipRect.left + chipRect.width / 2 - stageRect.left - view.x) / view.scale;
      const py =
        (chipRect.top + chipRect.height / 2 - stageRect.top - view.y) / view.scale;
      const sw = stage.clientWidth;
      const sh = stage.clientHeight;
      view.x = sw / 2 - px * view.scale;
      view.y = sh / 2 - py * view.scale;
      applyView();
    }
    return;
  }

  const target = document.querySelector(`.mcard[data-id="${id}"], .mchip[data-id="${id}"]`);
  if (!target) return;
  const section = target.closest('.gen-section');
  if (section) {
    openMobileGenSection(section);
    setTimeout(() => {
      const top = target.getBoundingClientRect().top + window.scrollY - mobileHeaderOffset();
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    }, 280);
  }
}
const personaToggle = document.getElementById('personaToggle');
const personaSelect = document.getElementById('personaSelect');
const topbarEl = document.querySelector('.topbar');

function collapseMobileSearch() {
  if (!topbarEl) return;
  topbarEl.classList.remove('search-open');
  searchToggle?.setAttribute('aria-expanded', 'false');
  searchToggle?.setAttribute('aria-label', 'Open search');
}

function collapseMobilePersona() {
  if (!topbarEl) return;
  topbarEl.classList.remove('persona-open');
  personaToggle?.setAttribute('aria-expanded', 'false');
  personaToggle?.setAttribute('aria-label', 'Choose viewer');
}

function setupMobileToolbarToggles() {
  if (!topbarEl) return;

  if (searchToggle && searchInput) {
    searchToggle.addEventListener('click', () => {
      if (window.innerWidth > 800) return;
      const open = !topbarEl.classList.contains('search-open');
      if (open) collapseMobilePersona();
      topbarEl.classList.toggle('search-open', open);
      searchToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      searchToggle.setAttribute('aria-label', open ? 'Close search' : 'Open search');
      if (open) searchInput.focus();
      else searchInput.blur();
    });
  }

  if (personaToggle && personaSelect) {
    personaToggle.addEventListener('click', () => {
      if (window.innerWidth > 800) return;
      const open = !topbarEl.classList.contains('persona-open');
      if (open) collapseMobileSearch();
      topbarEl.classList.toggle('persona-open', open);
      personaToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      personaToggle.setAttribute('aria-label', open ? 'Close viewer menu' : 'Choose viewer');
      if (open) setTimeout(() => personaSelect.focus(), 0);
      else personaSelect.blur();
    });
  }

  window.addEventListener('resize', () => {
    if (window.innerWidth > 800) {
      collapseMobileSearch();
      collapseMobilePersona();
    }
  });
}
let searchTimer = null;
searchInput.addEventListener('input', () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(runSearch, 80);
});
function runSearch() {
  const q = searchInput.value.trim().toLowerCase();
  clearSearchHighlights();
  searchCount.textContent = '';
  if (!q) {
    hideSearchResults();
    return;
  }

  const matches = PEOPLE.filter((p) => p.name.toLowerCase().includes(q));
  searchCount.textContent = `${matches.length} match${matches.length === 1 ? '' : 'es'}`;
  renderSearchResults(matches);
  if (matches.length) applySearchHighlights(matches);
}

searchInput.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    searchInput.value = '';
    runSearch();
    searchInput.blur();
    return;
  }
  if (e.key === 'Enter' && searchResults && !searchResults.hidden) {
    const first = searchResults.querySelector('.search-result[data-id]');
    if (first) {
      e.preventDefault();
      focusSearchMatch(first.dataset.id);
    }
  }
});

document.addEventListener('click', (e) => {
  if (!e.target.closest('.search')) hideSearchResults();
});

/* ============================================================
   INIT
   ============================================================ */
function init() {
  setupPersonaPicker();
  setupMobileToolbarToggles();
  renderDesktop();
  renderMobile();
  attachCardClicks(canvas);
  attachCardClicks(document.getElementById('mobileView'));
}
init();