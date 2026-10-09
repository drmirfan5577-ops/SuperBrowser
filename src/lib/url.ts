import { SEARCH_ENGINES } from '@/constants/apps';
import type { SearchEngineId } from '@/types';

export function getHost(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

export function isImageIcon(icon: string) {
  return /^(https?:|data:image\/)/.test(icon);
}

export function faviconFor(url: string) {
  const host = getHost(url);
  return host ? `https://www.google.com/s2/favicons?domain=${host}&sz=128` : '';
}

const DOMAIN_RE = /^(localhost|[\w-]+(\.[\w-]+)+)(:\d+)?(\/.*)?$/i;

/** Turns whatever the user typed into a URL: full URLs stay, bare domains get https, everything else is searched. */
export function resolveInput(input: string, engine: SearchEngineId): { url: string; title: string } {
  const trimmed = input.trim();
  if (/^https?:\/\//i.test(trimmed)) return { url: trimmed, title: getHost(trimmed) || trimmed };
  if (DOMAIN_RE.test(trimmed) && !trimmed.includes(' ')) {
    const url = `https://${trimmed}`;
    return { url, title: getHost(url) || trimmed };
  }
  const e = SEARCH_ENGINES[engine];
  return { url: e.prefix + encodeURIComponent(trimmed), title: `${e.label}: ${trimmed}` };
}

export function normalizeUrl(input: string) {
  const t = input.trim();
  return /^https?:\/\//i.test(t) ? t : `https://${t}`;
}

export async function sha256(text: string) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}
