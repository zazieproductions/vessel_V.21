import { useEffect } from 'react';
import { useArchive } from '../context/ArchiveContext';

export function Keyboard() {
  const { mutateTheme, regenerate, toggleFreeze, toggleDiagnostic, closeOverlays } = useArchive();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
      if (e.key === 'Escape') {
        closeOverlays();
        return;
      }
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const k = e.key.toLowerCase();
      if (k === 'm') mutateTheme();
      if (k === 'r') regenerate();
      if (k === 's') toggleFreeze();
      if (k === 'd') toggleDiagnostic();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mutateTheme, regenerate, toggleFreeze, toggleDiagnostic, closeOverlays]);

  return null;
}
