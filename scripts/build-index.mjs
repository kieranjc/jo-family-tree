import fs from 'fs';

const html = fs.readFileSync('index.legacy.html', 'utf8');
const bodyMatch = html.match(/<body>([\s\S]*)<\/body>/);
if (!bodyMatch) throw new Error('no body');
let body = bodyMatch[1];
body = body.replace(/<script>[\s\S]*<\/script>/, '');

const topbarOld = `  <motion class="topbar">
    <div class="brand">
      <span class="eyebrow">Family Tree · Five Generations</span>
      <h1>Joanne Daly &amp; Kindred</h1>
    </div>
    <div class="search">`;

const topbarOld2 = `  <div class="topbar">
    <motion class="brand">
      <span class="eyebrow">Family Tree · Five Generations</span>
      <h1>Joanne Daly &amp; Kindred</h1>
    </div>
    <div class="search">`;

const topbarNew = `  <div class="topbar">
    <div class="topbar-leading">
      <div class="brand">
        <span class="eyebrow">Family Tree · Five Generations</span>
        <h1>Daly</h1>
        <p class="persona-subtitle" id="personaSubtitle" hidden></p>
      </div>
      <div class="topbar-actions">
        <button type="button" class="persona-toggle" id="personaToggle" aria-expanded="false" aria-controls="personaWrap" aria-haspopup="listbox" aria-label="Choose viewer">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M5 20v-1a7 7 0 0114 0v1"/></svg>
        </button>
        <button type="button" class="search-toggle" id="searchToggle" aria-expanded="false" aria-controls="searchInput" aria-label="Open search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
        </button>
      </div>
    </div>
    <div class="persona-wrap" id="personaWrap">
      <label class="persona-label" for="personaSelect">View as</label>
      <select id="personaSelect" class="persona-select" aria-label="Choose whose perspective to view the tree"></select>
    </div>
    <div class="search">`;

const exact = `  <div class="topbar">
    <div class="brand">
      <span class="eyebrow">Family Tree · Five Generations</span>
      <h1>Joanne Daly &amp; Kindred</h1>
    </div>
    <div class="search">`;

if (!body.includes(exact)) throw new Error('topbar not found');
body = body.replace(exact, topbarNew);

const out = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
  <title>Daly Family Tree</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;1,9..144,500&display=swap" rel="stylesheet">
</head>
<body>
${body.trim()}
<script type="module" src="/src/main.js"></script>
</body>
</html>
`;

fs.writeFileSync('index.html', out);
console.log('ok', out.length);
