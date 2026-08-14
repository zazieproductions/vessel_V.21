export type ThemeId =
  | 'vessel'
  | 'ultraviolet'
  | 'infrared'
  | 'cyanvoid'
  | 'petroleum'
  | 'cathedral'
  | 'bruise';

export interface Theme {
  id: ThemeId;
  name: string;
  codename: string;
  bg: string;
  fg: string;
  accent: string;
  accent2: string;
  warn: string;
  paper: string;
  metal: string;
  void: string;
  scan: string;
  glow: string;
}

export const THEMES: Theme[] = [
  {
    id: 'vessel',
    name: 'VESSEL / LIME',
    codename: 'RADIOACTIVE ARCHIVE',
    bg: '#050508',
    fg: '#c8ff3d',
    accent: '#c8ff3d',
    accent2: '#7af0ff',
    warn: '#ff2a1a',
    paper: '#e8dcc4',
    metal: '#c5c7cc',
    void: '#0a1620',
    scan: 'rgba(200,255,61,0.07)',
    glow: 'rgba(200,255,61,0.45)',
  },
  {
    id: 'ultraviolet',
    name: 'NODE / ULTRAVIOLET',
    codename: 'PINK CATHEDRAL',
    bg: '#0a0410',
    fg: '#ff2bd6',
    accent: '#ff2bd6',
    accent2: '#b388ff',
    warn: '#c8ff3d',
    paper: '#f0d4e8',
    metal: '#d8cce8',
    void: '#160818',
    scan: 'rgba(255,43,214,0.08)',
    glow: 'rgba(255,43,214,0.4)',
  },
  {
    id: 'infrared',
    name: 'HEAT / INFRARED',
    codename: 'BURNING PLATE',
    bg: '#0c0604',
    fg: '#ff2a1a',
    accent: '#ff2a1a',
    accent2: '#e8dcc4',
    warn: '#c8ff3d',
    paper: '#e8dcc4',
    metal: '#d0b8a0',
    void: '#180808',
    scan: 'rgba(255,42,26,0.08)',
    glow: 'rgba(255,42,26,0.42)',
  },
  {
    id: 'cyanvoid',
    name: 'DEPTH / CYAN',
    codename: 'SUBMERGED TERMINAL',
    bg: '#02080c',
    fg: '#7af0ff',
    accent: '#7af0ff',
    accent2: '#c5c7cc',
    warn: '#ff2bd6',
    paper: '#d4e8e8',
    metal: '#c5c7cc',
    void: '#041218',
    scan: 'rgba(122,240,255,0.08)',
    glow: 'rgba(122,240,255,0.42)',
  },
  {
    id: 'petroleum',
    name: 'OIL / PETROLEUM',
    codename: 'SLICK ATLAS',
    bg: '#061018',
    fg: '#e8dcc4',
    accent: '#4a6a78',
    accent2: '#7af0ff',
    warn: '#ff2a1a',
    paper: '#e8dcc4',
    metal: '#8aa0a8',
    void: '#020810',
    scan: 'rgba(232,220,196,0.06)',
    glow: 'rgba(74,106,120,0.5)',
  },
  {
    id: 'cathedral',
    name: 'NAVE / SILVER',
    codename: 'GLITCH CATHEDRAL',
    bg: '#08080c',
    fg: '#c5c7cc',
    accent: '#c5c7cc',
    accent2: '#7af0ff',
    warn: '#ff2a1a',
    paper: '#e8dcc4',
    metal: '#e8e8ee',
    void: '#101018',
    scan: 'rgba(197,199,204,0.07)',
    glow: 'rgba(197,199,204,0.35)',
  },
  {
    id: 'bruise',
    name: 'HAEM / PURPLE',
    codename: 'CONTUSION INDEX',
    bg: '#0a0610',
    fg: '#7a4a88',
    accent: '#b388ff',
    accent2: '#ff2bd6',
    warn: '#c8ff3d',
    paper: '#e0d0d8',
    metal: '#b8a8c0',
    void: '#120814',
    scan: 'rgba(179,136,255,0.08)',
    glow: 'rgba(179,136,255,0.4)',
  },
];

export function themeById(id: ThemeId): Theme {
  return THEMES.find((t) => t.id === id) ?? THEMES[0];
}

export function nextThemeId(id: ThemeId): ThemeId {
  const i = THEMES.findIndex((t) => t.id === id);
  return THEMES[(i + 1) % THEMES.length].id;
}

export function applyTheme(theme: Theme) {
  const r = document.documentElement;
  r.style.setProperty('--bg', theme.bg);
  r.style.setProperty('--fg', theme.fg);
  r.style.setProperty('--accent', theme.accent);
  r.style.setProperty('--accent2', theme.accent2);
  r.style.setProperty('--warn', theme.warn);
  r.style.setProperty('--paper', theme.paper);
  r.style.setProperty('--metal', theme.metal);
  r.style.setProperty('--void', theme.void);
  r.style.setProperty('--scan', theme.scan);
  r.style.setProperty('--glow', theme.glow);
  r.dataset.theme = theme.id;
}
