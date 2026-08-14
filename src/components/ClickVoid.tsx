import { useEffect } from 'react';
import { useArchive } from '../context/ArchiveContext';

export function ClickVoid() {
  const { spawnAt, booted } = useArchive();

  useEffect(() => {
    if (!booted) return;
    const onClick = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      if (t.closest('[data-living], [data-win], [data-hud], button, a, input, textarea')) return;
      spawnAt(e.clientX, e.clientY);
    };
    window.addEventListener('click', onClick);
    return () => window.removeEventListener('click', onClick);
  }, [spawnAt, booted]);

  return null;
}
