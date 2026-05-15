import { PEOPLE, BY_ID } from '../data/tree.js';

export const JOANNE_ANCHOR = 'joanne';
export const STORAGE_KEY = 'daly-tree-persona';
export const COOKIE_NAME = 'daly-tree-persona';

export const PERSONA_IDS = PEOPLE.filter(
  (p) =>
    p.gen === 1 ||
    p.role === 'sibling' ||
    p.role === 'self' ||
    p.role === 'spouse'
).map((p) => p.id);

export const PERSONA_ALLOWLIST = [...PERSONA_IDS];

export function isValidPersona(id) {
  return id != null && PERSONA_ALLOWLIST.includes(id);
}

/** @returns {string | null} */
export function loadPersonaFromStorage() {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v && isValidPersona(v)) return v;
  } catch {
    /* ignore */
  }
  const fromCookie = readCookie();
  if (fromCookie && isValidPersona(fromCookie)) return fromCookie;
  return null;
}

function readCookie() {
  const m = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : null;
}

export function savePersona(id) {
  if (id === null) {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    document.cookie = `${COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Lax`;
    return;
  }
  if (!isValidPersona(id)) return;
  try {
    localStorage.setItem(STORAGE_KEY, id);
  } catch {
    /* ignore */
  }
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(id)}; Path=/; Max-Age=31536000; SameSite=Lax`;
}

/** @returns {string | null} */
export function loadPersonaFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const p = params.get('persona');
  if (p && isValidPersona(p)) return p;
  return null;
}

export function syncPersonaToUrl(id) {
  const url = new URL(window.location.href);
  if (id) url.searchParams.set('persona', id);
  else url.searchParams.delete('persona');
  history.replaceState(null, '', url);
}

/** @returns {string | null} */
export function resolveInitialPersona() {
  const fromUrl = loadPersonaFromUrl();
  if (fromUrl) {
    savePersona(fromUrl);
    return fromUrl;
  }
  return loadPersonaFromStorage();
}

export function getPersonaGroups() {
  return [
    {
      label: 'Standard view',
      options: [{ id: '', name: 'Daly family tree (default)' }],
    },
    {
      label: 'Joanne & Kieran',
      options: PEOPLE.filter((p) => p.role === 'self' || p.role === 'spouse').map((p) => ({
        id: p.id,
        name: p.name,
      })),
    },
    {
      label: 'Parents & aunts/uncles',
      options: PEOPLE.filter((p) => p.gen === 1)
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((p) => ({ id: p.id, name: p.name })),
    },
    {
      label: "Joanne's brothers",
      options: PEOPLE.filter((p) => p.role === 'sibling')
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((p) => ({ id: p.id, name: p.name })),
    },
  ];
}

export function personaDisplayName(id) {
  if (!id) return null;
  return BY_ID[id]?.name ?? id;
}
