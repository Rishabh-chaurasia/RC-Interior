import { useCallback, useEffect, useState } from 'react';

/*
  Colour themes. Each one is a set of CSS tokens in styles.css (:root[data-theme="…"]);
  `swatch` = [page, accent] for the theme button, `meta` = the browser chrome colour.
  index.html applies the saved theme before first paint, so there is no flash.
*/
export const THEMES = [
  { id: 'ivory', label: 'Ivory', swatch: ['#f2ede5', '#cddc2f'], meta: '#faf7f1' },
  { id: 'espresso', label: 'Espresso', swatch: ['#1f1915', '#cddc2f'], meta: '#1f1915' },
  { id: 'sage', label: 'Sage', swatch: ['#e3e9df', '#4f7d3a'], meta: '#e3e9df' },
  { id: 'terracotta', label: 'Terracotta', swatch: ['#f1e3d8', '#b0532e'], meta: '#f1e3d8' },
];
const KEY = 'rc-theme';

export function currentTheme() {
  const id = document.documentElement.dataset.theme;
  return THEMES.find(t => t.id === id) || THEMES[0];
}

function apply(theme) {
  const root = document.documentElement;
  root.classList.add('theme-switching');
  if (theme.id === THEMES[0].id) delete root.dataset.theme; else root.dataset.theme = theme.id;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme.meta);
  try { localStorage.setItem(KEY, theme.id); } catch { /* private mode: the choice just isn't remembered */ }
  clearTimeout(apply.t);
  apply.t = setTimeout(() => root.classList.remove('theme-switching'), 600);
  dispatchEvent(new CustomEvent('themechange', { detail: theme }));
}

/** The active theme and a function that moves to the next one. */
export function useTheme() {
  const [theme, setTheme] = useState(currentTheme);
  useEffect(() => {
    const on = e => setTheme(e.detail);
    addEventListener('themechange', on);
    return () => removeEventListener('themechange', on);
  }, []);
  const next = useCallback(() => {
    const i = THEMES.findIndex(t => t.id === currentTheme().id);
    apply(THEMES[(i + 1) % THEMES.length]);
  }, []);
  return [theme, next];
}

/** Reads a CSS custom property, re-reading it whenever the theme changes. */
export function useThemeToken(name) {
  const read = () => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const [value, setValue] = useState(read);
  useEffect(() => {
    // after the theme attribute changes, so the new value is in place
    const on = () => requestAnimationFrame(() => setValue(read()));
    addEventListener('themechange', on);
    return () => removeEventListener('themechange', on);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return value;
}
