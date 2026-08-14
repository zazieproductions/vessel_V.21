import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { hexSeed } from '../lib/rng';
import { applyTheme, nextThemeId, themeById, type Theme, type ThemeId } from '../lib/themes';
import type { RoomId, SpawnEvent, SpawnKind } from '../lib/types';
import { CATALOG } from '../lib/catalog';
import { FRAGMENTS, SHORT } from '../lib/lexicon';

interface ArchiveState {
  seed: string;
  theme: Theme;
  frozen: boolean;
  diagnostic: boolean;
  booted: boolean;
  room: RoomId | null;
  reduced: boolean;
  spawns: SpawnEvent[];
  log: string[];
  mutateTheme: () => void;
  regenerate: () => void;
  toggleFreeze: () => void;
  toggleDiagnostic: () => void;
  setBooted: (v: boolean) => void;
  openRoom: (id: RoomId) => void;
  closeOverlays: () => void;
  spawnAt: (x: number, y: number, kind?: SpawnKind) => void;
  pushLog: (line: string) => void;
}

const ArchiveContext = createContext<ArchiveState | null>(null);

function prefersReduced() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function ArchiveProvider({ children }: { children: ReactNode }) {
  const [seed, setSeed] = useState(() => hexSeed(8));
  const [themeId, setThemeId] = useState<ThemeId>('vessel');
  const [frozen, setFrozen] = useState(false);
  const [diagnostic, setDiagnostic] = useState(false);
  const [booted, setBooted] = useState(false);
  const [room, setRoom] = useState<RoomId | null>(null);
  const [reduced] = useState(prefersReduced);
  const [spawns, setSpawns] = useState<SpawnEvent[]>([]);
  const [log, setLog] = useState<string[]>([
    '> VESSEL OS 0.9.4 — disc mounted',
    '> waiting for observer',
  ]);
  const spawnSeq = useRef(0);

  const theme = useMemo(() => themeById(themeId), [themeId]);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const pushLog = useCallback((line: string) => {
    setLog((prev) => {
      const next = [...prev, line];
      return next.length > 48 ? next.slice(-48) : next;
    });
  }, []);

  const mutateTheme = useCallback(() => {
    setThemeId((id) => {
      const n = nextThemeId(id);
      return n;
    });
    pushLog(`> theme mutated @ ${new Date().toISOString().slice(11, 19)}`);
  }, [pushLog]);

  const regenerate = useCallback(() => {
    const next = hexSeed(8);
    setSeed(next);
    setSpawns([]);
    pushLog(`> imagery regenerated — seed ${next}`);
  }, [pushLog]);

  const toggleFreeze = useCallback(() => {
    setFrozen((f) => {
      pushLog(f ? '> clock resumed' : '> clock arrested (S)');
      return !f;
    });
  }, [pushLog]);

  const toggleDiagnostic = useCallback(() => {
    setDiagnostic((d) => {
      pushLog(d ? '> diagnostic closed' : '> diagnostic overlay armed');
      return !d;
    });
  }, [pushLog]);

  const openRoom = useCallback((id: RoomId) => {
    setRoom(id);
    pushLog(`> entered hidden room: ${id}`);
  }, [pushLog]);

  const closeOverlays = useCallback(() => {
    setRoom(null);
    setDiagnostic(false);
    pushLog('> overlays dismissed');
  }, [pushLog]);

  const spawnAt = useCallback((x: number, y: number, kind?: SpawnKind) => {
    const kinds: SpawnKind[] = ['sigil', 'text', 'ripple', 'swarm'];
    const k = kind ?? kinds[Math.floor(Math.random() * kinds.length)];
    const id = `sp-${spawnSeq.current++}`;
    const payload = k === 'text' ? FRAGMENTS[Math.floor(Math.random() * FRAGMENTS.length)] : SHORT[Math.floor(Math.random() * SHORT.length)];
    const srcs =
      k === 'swarm'
        ? Array.from({ length: 5 }, () => CATALOG[Math.floor(Math.random() * CATALOG.length)].src)
        : undefined;
    setSpawns((prev) => {
      const next = [...prev, { id, kind: k, x, y, born: performance.now(), payload, srcs }];
      return next.length > 36 ? next.slice(-36) : next;
    });
    pushLog(`> ${k} inscribed at ${Math.round(x)},${Math.round(y)}`);
  }, [pushLog]);

  const value = useMemo<ArchiveState>(
    () => ({
      seed,
      theme,
      frozen,
      diagnostic,
      booted,
      room,
      reduced,
      spawns,
      log,
      mutateTheme,
      regenerate,
      toggleFreeze,
      toggleDiagnostic,
      setBooted,
      openRoom,
      closeOverlays,
      spawnAt,
      pushLog,
    }),
    [
      seed,
      theme,
      frozen,
      diagnostic,
      booted,
      room,
      reduced,
      spawns,
      log,
      mutateTheme,
      regenerate,
      toggleFreeze,
      toggleDiagnostic,
      openRoom,
      closeOverlays,
      spawnAt,
      pushLog,
    ],
  );

  return <ArchiveContext.Provider value={value}>{children}</ArchiveContext.Provider>;
}

export function useArchive() {
  const ctx = useContext(ArchiveContext);
  if (!ctx) throw new Error('useArchive outside provider');
  return ctx;
}
