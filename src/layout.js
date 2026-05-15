/* ============================================================
   LAYOUT
   ============================================================ */
export const LAYOUT = {
  cardW: 168,
  cardH: 72,
  rowGap: 130, // vertical between gens
  topPad: 80,
  leftPad: 160, // for gen rail
  coupleGap: 36, // horizontal gap between two cards in a couple
  siblingGap: 12,
};

export const GEN_LABELS = [
  { num: 'I',   label: 'You' },
  { num: 'II',  label: 'Parents' },
  { num: 'III', label: 'Grandparents' },
  { num: 'IV',  label: 'Great-grandparents' },
  { num: 'V',   label: '2× Great-grandparents' },
];

// Build position lookup. Strategy: place gen-4 evenly. Each couple at gen-4 centers under a gen-3 person.
// Then gen-3 couples' midpoints define gen-2 person positions, etc.
// We compute x positions per id.
export const POS = {}; // id -> {x, y}

function computeLayout() {
  const { cardW, cardH, rowGap, topPad, leftPad, coupleGap } = LAYOUT;
  const rowY = g => topPad + g * rowGap + (4 - g) * 0; // top-down: gen 4 at top, gen 0 at bottom?
  // Actually: gen 0 at bottom (You), gen 4 at top. So y for gen g = topPad + (4 - g) * rowGap
  const y = g => topPad + (4 - g) * rowGap;

  // ----- Gen 4: order matters left-to-right
  const g4Order = [
    // Daly side
    'g4_mathew_daly', 'g4_mary_horgan',         // -> ggp_patrick_daly
    'g4_richard_barry', 'g4_mary_horrigan',     // -> ggp_mary_barry
    'g4_michael_curran', 'g4_ellen_brien',      // -> ggp_william_curran
    'g4_humphrey_mcc',   'g4_mary_hegarty',     // -> ggp_thomasine_mcc
    // Byron side has no gen-4; skip (we'll leave a gap above gen-3 Byron couple)
    'g4_joseph_barrett', 'g4_julia_crockett',   // -> ggp_george_barrett
    'g4_alexander_scott','g4_alice_flynn',      // -> ggp_margaret_scott
  ];
  // Group by couple
  const g4Couples = [
    ['g4_mathew_daly','g4_mary_horgan'],
    ['g4_richard_barry','g4_mary_horrigan'],
    ['g4_michael_curran','g4_ellen_brien'],
    ['g4_humphrey_mcc','g4_mary_hegarty'],
    null, // Byron gap
    null, // Byron gap
    ['g4_joseph_barrett','g4_julia_crockett'],
    ['g4_alexander_scott','g4_alice_flynn'],
  ];

  const coupleW = cardW * 2 + coupleGap;
  const interCoupleGap = 36;
  let cursorX = leftPad;
  // Place each couple slot, including the empty Byron slots
  const slotCenters = []; // x center for each gen-3 person (in same order as g4Couples)
  for (let i = 0; i < g4Couples.length; i++) {
    const couple = g4Couples[i];
    const slotX = cursorX;
    const centerX = slotX + coupleW / 2;
    slotCenters.push(centerX);
    if (couple) {
      POS[couple[0]] = { x: slotX, y: y(4) };
      POS[couple[1]] = { x: slotX + cardW + coupleGap, y: y(4) };
    }
    cursorX += coupleW + interCoupleGap;
  }

  // ----- Gen 3: each gen-3 person centered on their parents' couple slot
  // Order: ggp_patrick_daly, ggp_mary_barry, ggp_william_curran, ggp_thomasine_mcc,
  //        ggp_frederick_byron, ggp_florence_ritchie, ggp_george_barrett, ggp_margaret_scott
  const g3Order = [
    'ggp_patrick_daly', 'ggp_mary_barry',
    'ggp_william_curran', 'ggp_thomasine_mcc',
    'ggp_frederick_byron', 'ggp_florence_ritchie',
    'ggp_george_barrett', 'ggp_margaret_scott',
  ];
  for (let i = 0; i < 8; i++) {
    const id = g3Order[i];
    const cx = slotCenters[i];
    POS[id] = { x: cx - cardW / 2, y: y(3) };
  }

  // ----- Gen 2: each grandparent centered between their two gen-3 parents
  // Pairs of gen-3 → gen-2 grandparent:
  const g2Map = [
    { gp: 'gp_michael_daly',  ps: ['ggp_patrick_daly', 'ggp_mary_barry'] },
    { gp: 'gp_mary_curran',   ps: ['ggp_william_curran', 'ggp_thomasine_mcc'] },
    { gp: 'gp_james_byron',   ps: ['ggp_frederick_byron', 'ggp_florence_ritchie'] },
    { gp: 'gp_nora_barrett',  ps: ['ggp_george_barrett', 'ggp_margaret_scott'] },
  ];
  g2Map.forEach(({gp, ps}) => {
    const cxA = POS[ps[0]].x + cardW/2;
    const cxB = POS[ps[1]].x + cardW/2;
    const cx = (cxA + cxB) / 2;
    POS[gp] = { x: cx - cardW/2, y: y(2) };
  });

  // ----- Gen 1: John between Michael+Mary Curran; Joan between James+Nora
  const g1Map = [
    { p: 'john_daly',  parents: ['gp_michael_daly', 'gp_mary_curran'] },
    { p: 'joan_byron', parents: ['gp_james_byron', 'gp_nora_barrett'] },
  ];
  g1Map.forEach(({p, parents}) => {
    const cxA = POS[parents[0]].x + cardW/2;
    const cxB = POS[parents[1]].x + cardW/2;
    const cx = (cxA + cxB) / 2;
    POS[p] = { x: cx - cardW/2, y: y(1) };
  });

  // ----- Gen 0: Joanne + Kieran couple, centered on John+Joan midpoint
  const johnCX = POS['john_daly'].x + cardW/2;
  const joanCX = POS['joan_byron'].x + cardW/2;
  const parentMidX = (johnCX + joanCX) / 2;
  // place Joanne+Kieran as a couple centered around parentMidX
  POS['joanne'] = { x: parentMidX - cardW - coupleGap/2, y: y(0) };
  POS['kieran'] = { x: parentMidX + coupleGap/2,         y: y(0) };

  // ----- Siblings placed in a row below Joanne row (right of Kieran)
  // Actually let's put them in a tidy block at the right, same gen-0 row,
  // but using compact cards so they fit. We'll use a separate cluster placement
  // computed by render. We DO need positions for connector parents though.
  // The siblings will be drawn as a "siblings" cluster; we'll lay them out in render.

  // We'll also compute uncles/aunts cluster positions in render — they don't need
  // individual POS entries since they're chips inside cluster boxes.
}

computeLayout();
