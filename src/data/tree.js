/* ============================================================
   DATA MODEL
   ============================================================ */
export const LINES = {
  daly:    { label: 'Daly · Barry',       cssClass: 'line-daly' },
  curran:  { label: 'Curran · McCarthy',  cssClass: 'line-curran' },
  byron:   { label: 'Byron',              cssClass: 'line-byron' },
  barrett: { label: 'Barrett · Scott',    cssClass: 'line-barrett' },
  joanne:  { label: 'Joanne',             cssClass: 'line-joanne' },
  kieran:  { label: 'Cummins',            cssClass: 'line-kieran' },
};

// Biographical notes (extracted from Daly History research document)
export const BIOS = {
  gp_michael_daly: [
    "Michael was born in Cork to Patrick Daly, a general labourer, and Mary Barry. The family lived at House 17, Walshes Avenue, Blackpool — a modest 3-room, 2nd Class dwelling on a terrace-lined lane off Thomas Davis Street. By 1926 the family had moved to Ballyvolane, where Michael worked as a labourer at <strong>Gouldings Fertilizers</strong>, Ireland's largest chemical fertilizer manufacturer at the time. The work was physically brutal — producing superphosphates and sulphuric acid in conditions where workers wore handkerchiefs over their faces to block toxic fumes, for wages of roughly 20–25 shillings a week.",
    "On <strong>4 September 1919</strong>, aged 18, Michael enlisted in the <strong>2nd Battalion, Royal Irish Regiment (British Army)</strong>. His service was cut short when the regiment was disbanded on 31 July 1922 following the Anglo-Irish Treaty. He received an honourable discharge under code <em>SNLR Para 3Q2</em> (Services No Longer Required — Disbandment), with a character rating of <em>Very Good</em>.",
    "He married <strong>Mary Curran</strong> on <strong>17 September 1941</strong>, during \"The Emergency\" (Ireland's WWII neutrality period). The couple moved to <strong>109 Knockpogue Avenue, Farranree</strong> — a modern terraced house designed by Cork City Architect Eamon O'Byrne in 1956 as part of a major social housing expansion. After years in cramped cottages in Blackpool and Ballyvolane, having indoor plumbing, a separate kitchen, and a private garden was transformative. Michael lived at Knockpogue Avenue until his death in 1957. He was buried in <strong>Rathcooney Cemetery</strong>."
  ],
  gp_mary_curran: [
    "Mary was born in Cork to William Curran, a dock labourer at Suttons Coal Merchants, and Thomasine McCarthy. In 1926 the family lived at <strong>2 Shandon View Cottages</strong>, a terrace of artisan dwellings just off Watercourse Road in Blackpool, with panoramic views of the iconic Shandon Bells. The cottage was a 3-room, 2nd Class dwelling — slightly less cramped than many neighbouring families' homes.",
    "As a young woman in her teens and twenties during the 1930s, Mary almost certainly worked at the <strong>Sunbeam Wolsey factory</strong> — the largest employer in the Blackpool/Watercourse Road area — as a hosiery or textile operative. When she married Michael Daly in 1941, she would have had to leave her permanent role under the <em>Marriage Bar</em>, which required women to resign from factory or civil service positions upon marriage.",
    "After Michael's death in 1957, Mary remained at <strong>109 Knockpogue Avenue</strong> for over 30 years, becoming a central figure in the family and the Farranree community. She died on <strong>6 March 1990</strong>, aged 76, and was buried in <strong>Rathcooney Cemetery</strong> in the family plot.",
    "<em>A photograph of Mary survives from her Sunbeam factory years.</em>"
  ],
  gunc_matthew_daly: [
    "Matthew was five years older than his brother Michael and may well have been the one who inspired Michael to enlist. He grew up alongside Michael at Walshes Avenue, Blackpool, and is recorded in the 1911 Census as a 14-year-old scholar in the Daly household.",
    "At the height of the Great War recruitment drive, Matthew enlisted in the <strong>Royal Marine Light Infantry (RMLI)</strong> on <strong>1 December 1914</strong>, aged 18. As a recruit from Cork, he was assigned to the <strong>Plymouth Division</strong> and trained at the RMLI Depot in Deal, Kent. He was later drafted into the <strong>Royal Marine Brigade</strong> (part of the 63rd Royal Naval Division), serving as infantry rather than aboard ships — a common deployment for Royal Marines in WWI.",
    "His service record, held at <strong>The National Archives, Kew</strong> (reference ADM 159/161/17749), shows a character of <em>V. Good</em>, ability <em>Satisfactory</em>, and discharge in April 1920 — medically invalided, then transferred to the Royal Fleet Reserve (Class B).",
    "For a Cork man serving in the British military during the War of Independence, maintaining a \"Very Good\" character rating was a mark of steady, disciplined temperament."
  ],
  gp_nora_barrett: [
    "Nora was born in Cork to <strong>George Barrett</strong>, a sawyer at E.H. Harte Sawmills, and <strong>Margaret Scott</strong>. In 1926 the family lived at <strong>62 Kearney's Lane</strong>, just off Blarney Street near the North Cathedral — a classic narrow Cork lane of artisan cottages. The Barrett family occupied just 2 rooms, typical of these \"one-up, one-down\" terrace homes with no internal plumbing.",
    "Her father George worked at <strong>E.H. Harte &amp; Sons Ltd</strong>, a major timber yard at Wandesford Quay (near Clarke's Bridge), processing raw timber imported from Canada and the Baltic. It was a physically demanding job earning roughly 25–35 shillings per week — a precarious living wage in 1920s Cork.",
    "Nora married <strong>James Byron</strong> on <strong>17 March 1944</strong> (St. Patrick's Day). The couple settled at <strong>106 Connolly Road, Ballyphehane</strong> — one of the foundational streets of Cork Corporation's post-war social housing scheme, built from 1948 onwards to rehouse families from overcrowded city-centre tenements. The road was named in honour of James Connolly, executed leader of the 1916 Rising.",
    "Nora died on <strong>14 February 1974</strong>, aged 49."
  ],
  gp_james_byron: [
    "James was born in <strong>Prescot, Lancashire</strong> to <strong>Frederick Byron</strong> (a general labourer at B.I. &amp; H. Cables, originally from St Helens, Lancs) and <strong>Florence Ritchie</strong> (from Prescot). In 1921 the family was recorded at <strong>49 South Avenue, Prescot</strong> — a newly built residential street of brick-built Edwardian terraced homes.",
    "The family's move to Ireland is not precisely dated, but James grew up in Cork and married <strong>Nora Barrett</strong> on 17 March 1944. The couple settled in Ballyphehane. James died in 1963, aged around 47.",
    "James's Lancashire origins give the Daly family its notable English connection — his father Frederick was from St Helens, and his mother Florence from Prescot itself, making James the first in his direct line to grow up in Ireland."
  ],
  ggp_frederick_byron: [
    "Frederick was born in St Helens, Lancashire and worked as a <strong>general labourer at B.I. &amp; H. Cables</strong> — a major cable manufacturing company. By 1921 he was living at 49 South Avenue, Prescot with his wife Florence and five-year-old son James. He is the origin of the English/Lancashire strand in Joanne's family tree."
  ],
  ggp_george_barrett: [
    "George worked as a sawyer and labourer at <strong>E.H. Harte &amp; Sons Ltd</strong>, a timber yard at Wandesford Quay, Cork. He lived with his wife Margaret (née Scott) and their children at <strong>62 Kearney's Lane</strong>, Blackpool, Cork. The family are recorded in the 1926 Census with eight people in two rooms.",
    "George's work involved processing raw timber imported from Canada and the Baltic into finished lumber for Cork's construction trade."
  ],
};

// gen 0 = Joanne's gen, gen 1 = parents, ... gen 4 = 2x great-grandparents
export const PEOPLE = [
  // -- Gen 0: Joanne, Kieran, siblings
  { id: 'joanne',  name: 'Joanne Daly',     dob: '27 Jul 1976', birthplace: 'Cork, Ireland', line: 'joanne', gen: 0, role: 'self', relation: 'You — the centre of this tree.' },
  { id: 'kieran',  name: 'Kieran Cummins',  dob: '19 Sep 1973', birthplace: 'Tipperary, Ireland', line: 'kieran', gen: 0, role: 'spouse', relation: "Joanne's husband." },
  { id: 'paul',    name: 'Paul Daly',       dob: '1977', birthplace: 'Cork, Ireland', line: 'daly', gen: 0, role: 'sibling', relation: "Joanne's brother." },
  { id: 'andrew',  name: 'Andrew Daly',     dob: '1979', birthplace: 'Cork, Ireland', line: 'daly', gen: 0, role: 'sibling', relation: "Joanne's brother." },
  { id: 'matthew', name: 'Matthew Daly',    dob: '1987', birthplace: 'Cork, Ireland', line: 'daly', gen: 0, role: 'sibling', relation: "Joanne's brother." },
  { id: 'evan',    name: 'Evan Daly',       dob: '1991', birthplace: 'Cork, Ireland', line: 'daly', gen: 0, role: 'sibling', relation: "Joanne's brother." },

  // -- Gen 1: Parents
  { id: 'john_daly',  name: 'John Daly',  dob: '15 Nov 1950', birthplace: 'Cork, Ireland', line: 'daly',  gen: 1, role: 'parent', relation: "Joanne's father." },
  { id: 'joan_byron', name: 'Joan Byron', dob: '21 Mar 1955', birthplace: 'Cork, Ireland', line: 'byron', gen: 1, role: 'parent', relation: "Joanne's mother." },

  // -- Gen 1 siblings (uncles & aunts)
  { id: 'unc_patrick',  name: 'Patrick Daly',  line: 'daly', gen: 1, role: 'uncle', relation: "Joanne's paternal uncle — John Daly's brother.", parentOf: 'john_daly' },
  { id: 'unc_william',  name: 'William Daly',  line: 'daly', gen: 1, role: 'uncle', relation: "Joanne's paternal uncle — John Daly's brother.", parentOf: 'john_daly' },
  { id: 'unc_michael',  name: 'Michael Daly',  line: 'daly', gen: 1, role: 'uncle', relation: "Joanne's paternal uncle — John Daly's brother.", parentOf: 'john_daly' },
  { id: 'unc_b_michael',name: 'Michael Byron', line: 'byron', gen: 1, role: 'uncle', relation: "Joanne's maternal uncle — Joan Byron's brother.", parentOf: 'joan_byron' },
  { id: 'unc_b_tony',   name: 'Tony Byron',    line: 'byron', gen: 1, role: 'uncle', relation: "Joanne's maternal uncle — Joan Byron's brother.", parentOf: 'joan_byron' },
  { id: 'unc_b_john',   name: 'John Byron',    line: 'byron', gen: 1, role: 'uncle', relation: "Joanne's maternal uncle — Joan Byron's brother.", parentOf: 'joan_byron' },
  { id: 'aunt_marie',   name: 'Marie Byron',   line: 'byron', gen: 1, role: 'aunt',  relation: "Joanne's maternal aunt — Joan Byron's sister.", parentOf: 'joan_byron' },
  { id: 'aunt_alice',   name: 'Alice Byron',   line: 'byron', gen: 1, role: 'aunt',  relation: "Joanne's maternal aunt — Joan Byron's sister.", parentOf: 'joan_byron' },
  { id: 'aunt_peg',     name: 'Margaret (Peg) Byron', line: 'byron', gen: 1, role: 'aunt', relation: "Joanne's maternal aunt — Joan Byron's sister.", parentOf: 'joan_byron' },
  { id: 'aunt_kaye',    name: 'Kaye Byron',    line: 'byron', gen: 1, role: 'aunt',  relation: "Joanne's maternal aunt — Joan Byron's sister.", parentOf: 'joan_byron' },
  { id: 'aunt_carmel',  name: 'Carmel Byron',  line: 'byron', gen: 1, role: 'aunt',  relation: "Joanne's maternal aunt — Joan Byron's sister.", parentOf: 'joan_byron' },

  // -- Gen 2: Grandparents
  { id: 'gp_michael_daly',  name: 'Michael Daly',  dob: '2 May 1901', birthplace: 'Cork, Ireland', dod: '1957, Cork', line: 'daly',    gen: 2, role: 'grandparent', relation: "Joanne's paternal grandfather." },
  { id: 'gp_mary_curran',   name: 'Mary Curran',   dob: '28 Nov 1913', birthplace: 'Cork, Ireland', dod: '6 Mar 1990, Cork', line: 'curran',  gen: 2, role: 'grandparent', relation: "Joanne's paternal grandmother." },
  { id: 'gp_james_byron',   name: 'James Byron',   dob: 'Jun 1916', birthplace: 'Prescot, Lancashire, England', dod: '1963, Cork', line: 'byron',   gen: 2, role: 'grandparent', relation: "Joanne's maternal grandfather." },
  { id: 'gp_nora_barrett',  name: 'Nora Barrett',  dob: '10 Jun 1924', birthplace: 'Cork, Ireland', dod: '14 Feb 1974, Cork', line: 'barrett', gen: 2, role: 'grandparent', relation: "Joanne's maternal grandmother." },
  // Great-uncle on the Daly side (Michael's elder brother)
  { id: 'gunc_matthew_daly',name: 'Matthew Daly', dob: '9 Jun 1896', birthplace: 'Cork, Ireland', dod: 'after 1920', line: 'daly', gen: 2, role: 'great-uncle', relation: "Joanne's great-uncle — Michael Daly's elder brother.", parentOf: 'gp_michael_daly' },

  // -- Gen 3: Great-grandparents
  { id: 'ggp_patrick_daly',     name: 'Patrick Daly',         dob: '1865', line: 'daly',    gen: 3, role: 'great-grandparent', relation: "Joanne's paternal great-grandfather (Daly line)." },
  { id: 'ggp_mary_barry',       name: 'Mary Barry',           dob: '1876', line: 'daly',    gen: 3, role: 'great-grandparent', relation: "Joanne's paternal great-grandmother (Daly line)." },
  { id: 'ggp_william_curran',   name: 'William Curran',       dob: '1884', line: 'curran',  gen: 3, role: 'great-grandparent', relation: "Joanne's paternal great-grandfather (Curran line)." },
  { id: 'ggp_thomasine_mcc',    name: 'Thomasine McCarthy',   dob: '1884', line: 'curran',  gen: 3, role: 'great-grandparent', relation: "Joanne's paternal great-grandmother (McCarthy line)." },
  { id: 'ggp_frederick_byron',  name: 'Frederick Byron',      dob: 'c. 1895', birthplace: 'St Helens, Lancashire, England', line: 'byron', gen: 3, role: 'great-grandparent', relation: "Joanne's maternal great-grandfather (Byron line)." },
  { id: 'ggp_florence_ritchie', name: 'Florence Ritchie',     line: 'byron',   gen: 3, role: 'great-grandparent', relation: "Joanne's maternal great-grandmother (Ritchie/Byron line)." },
  { id: 'ggp_george_barrett',   name: 'George Barrett',       dob: '2 May 1882', birthplace: 'Cork, Ireland', line: 'barrett', gen: 3, role: 'great-grandparent', relation: "Joanne's maternal great-grandfather (Barrett line)." },
  { id: 'ggp_margaret_scott',   name: 'Margaret Scott',       dob: '1887', line: 'barrett', gen: 3, role: 'great-grandparent', relation: "Joanne's maternal great-grandmother (Scott line)." },

  // -- Gen 4: 2× great-grandparents
  { id: 'g4_mathew_daly',    name: 'Mathew Daly',     line: 'daly',    gen: 4, role: '2x-great-grandparent', relation: "Joanne's 2× great-grandfather (Daly line)." },
  { id: 'g4_mary_horgan',    name: 'Mary Horgan',     line: 'daly',    gen: 4, role: '2x-great-grandparent', relation: "Joanne's 2× great-grandmother (Daly line)." },
  { id: 'g4_richard_barry',  name: 'Richard Barry',   line: 'daly',    gen: 4, role: '2x-great-grandparent', relation: "Joanne's 2× great-grandfather (Barry line)." },
  { id: 'g4_mary_horrigan',  name: 'Mary Horrigan',   line: 'daly',    gen: 4, role: '2x-great-grandparent', relation: "Joanne's 2× great-grandmother (Barry line)." },
  { id: 'g4_michael_curran', name: 'Michael Curran',  line: 'curran',  gen: 4, role: '2x-great-grandparent', relation: "Joanne's 2× great-grandfather (Curran line)." },
  { id: 'g4_ellen_brien',    name: 'Ellen Brien',     line: 'curran',  gen: 4, role: '2x-great-grandparent', relation: "Joanne's 2× great-grandmother (Curran line)." },
  { id: 'g4_humphrey_mcc',   name: 'Humphrey McCarthy', line: 'curran', gen: 4, role: '2x-great-grandparent', relation: "Joanne's 2× great-grandfather (McCarthy line)." },
  { id: 'g4_mary_hegarty',   name: 'Mary Hegarty',    line: 'curran',  gen: 4, role: '2x-great-grandparent', relation: "Joanne's 2× great-grandmother (McCarthy line)." },
  { id: 'g4_joseph_barrett', name: 'Joseph Barrett',  line: 'barrett', gen: 4, role: '2x-great-grandparent', relation: "Joanne's 2× great-grandfather (Barrett line)." },
  { id: 'g4_julia_crockett', name: 'Julia Crockett',  line: 'barrett', gen: 4, role: '2x-great-grandparent', relation: "Joanne's 2× great-grandmother (Barrett line)." },
  { id: 'g4_alexander_scott',name: 'Alexander Scott', dob: '1865', dod: 'Youghal, Cork', line: 'barrett', gen: 4, role: '2x-great-grandparent', relation: "Joanne's 2× great-grandfather (Scott line)." },
  { id: 'g4_alice_flynn',    name: 'Alice Flynn',     dob: '1857', dod: '1923', line: 'barrett', gen: 4, role: '2x-great-grandparent', relation: "Joanne's 2× great-grandmother (Scott line)." },
];

// Couples — drawn with a dashed marriage connector
export const COUPLES = [
  ['joanne', 'kieran'],
  ['john_daly', 'joan_byron'],
  ['gp_michael_daly', 'gp_mary_curran'],
  ['gp_james_byron', 'gp_nora_barrett'],
  ['ggp_patrick_daly', 'ggp_mary_barry'],
  ['ggp_william_curran', 'ggp_thomasine_mcc'],
  ['ggp_frederick_byron', 'ggp_florence_ritchie'],
  ['ggp_george_barrett', 'ggp_margaret_scott'],
  ['g4_mathew_daly', 'g4_mary_horgan'],
  ['g4_richard_barry', 'g4_mary_horrigan'],
  ['g4_michael_curran', 'g4_ellen_brien'],
  ['g4_humphrey_mcc', 'g4_mary_hegarty'],
  ['g4_joseph_barrett', 'g4_julia_crockett'],
  ['g4_alexander_scott', 'g4_alice_flynn'],
];

// Parent→child relationships (solid curves)
// child : [parentA, parentB]
export const PARENT_OF = {
  // Joanne and her siblings → John + Joan
  joanne: ['john_daly', 'joan_byron'],
  paul:   ['john_daly', 'joan_byron'],
  andrew: ['john_daly', 'joan_byron'],
  matthew:['john_daly', 'joan_byron'],
  evan:   ['john_daly', 'joan_byron'],
  // John → Michael + Mary Curran
  john_daly:  ['gp_michael_daly', 'gp_mary_curran'],
  // Joan Byron → James + Nora
  joan_byron: ['gp_james_byron', 'gp_nora_barrett'],
  // Grandparents → great-grandparents
  gp_michael_daly: ['ggp_patrick_daly', 'ggp_mary_barry'],
  gp_mary_curran:  ['ggp_william_curran', 'ggp_thomasine_mcc'],
  gp_james_byron:  ['ggp_frederick_byron', 'ggp_florence_ritchie'],
  gp_nora_barrett: ['ggp_george_barrett', 'ggp_margaret_scott'],
  // Great-grandparents → 2× great-grandparents
  ggp_patrick_daly:    ['g4_mathew_daly', 'g4_mary_horgan'],
  ggp_mary_barry:      ['g4_richard_barry', 'g4_mary_horrigan'],
  ggp_william_curran:  ['g4_michael_curran', 'g4_ellen_brien'],
  ggp_thomasine_mcc:   ['g4_humphrey_mcc', 'g4_mary_hegarty'],
  ggp_george_barrett:  ['g4_joseph_barrett', 'g4_julia_crockett'],
  ggp_margaret_scott:  ['g4_alexander_scott', 'g4_alice_flynn'],
};

export const BY_ID = Object.fromEntries(PEOPLE.map(p => [p.id, p]));
