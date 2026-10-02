import { useCallback, useEffect, useState } from 'react';

/*
  Colour themes. Each one is a set of CSS tokens in styles.css (:root[data-theme="…"]);
  `swatch` = [page, accent] for the theme picker, `meta` = the browser chrome colour.
  index.html applies the saved theme before first paint (keep its id → colour map in sync).
*/
export const THEMES = [
  { id: 'ivory', label: 'Ivory', swatch: ['#f2ede5', '#cddc2f'], meta: '#faf7f1' },
  { id: 'stone', label: 'Stone', swatch: ['#e9e8e5', '#8c6a4a'], meta: '#e9e8e5' },
  { id: 'sage', label: 'Sage', swatch: ['#e3e9df', '#4f7d3a'], meta: '#e3e9df' },
  { id: 'blush', label: 'Blush', swatch: ['#f3e4e1', '#a5555c'], meta: '#f3e4e1' },
  { id: 'terracotta', label: 'Terracotta', swatch: ['#f1e3d8', '#b0532e'], meta: '#f1e3d8' },
  { id: 'espresso', label: 'Espresso', swatch: ['#1f1915', '#cddc2f'], meta: '#1f1915', dark: true },
  { id: 'charcoal', label: 'Charcoal', swatch: ['#1c1d1f', '#c9a27a'], meta: '#1c1d1f', dark: true },
  { id: 'midnight', label: 'Midnight', swatch: ['#141b26', '#d4a373'], meta: '#141b26', dark: true },
  { id: 'forest', label: 'Forest', swatch: ['#17211b', '#cddc2f'], meta: '#17211b', dark: true },
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

/** The active theme and a setter that takes a theme id. */
export function useTheme() {
  const [theme, setTheme] = useState(currentTheme);
  useEffect(() => {
    const on = e => setTheme(e.detail);
    addEventListener('themechange', on);
    return () => removeEventListener('themechange', on);
  }, []);
  const choose = useCallback(id => {
    const t = THEMES.find(x => x.id === id);
    if (t && t.id !== currentTheme().id) apply(t);
  }, []);
  return [theme, choose];
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
