import { useEffect, useRef } from 'react';
import { useArchive } from '../context/ArchiveContext';

export function OverlayFX() {
  const { reduced, frozen } = useArchive();
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = ref.current;
    if (!c || reduced) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    let raf = 0;
    let t = 0;
    const resize = () => {
      c.width = 180;
      c.height = 120;
    };
    resize();
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (frozen) return;
      t++;
      if (t % 3 !== 0) return;
      const { width: w, height: h } = c;
      const img = ctx.createImageData(w, h);
      const d = img.data;
      for (let i = 0; i < d.length; i += 4) {
        const v = Math.random() * 255;
        d[i] = d[i + 1] = d[i + 2] = v;
        d[i + 3] = 28;
      }
      ctx.putImageData(img, 0, 0);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced, frozen]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[70]" aria-hidden>
      <div className="scanlines absolute inset-0" />
      <div className="noise-overlay absolute inset-0" />
      <div className="vignette absolute inset-0" />
      <div className="crt-curve absolute inset-0" />
      <canvas ref={ref} className="absolute inset-0 h-full w-full opacity-30 mix-blend-overlay" />
      {!frozen && !reduced && (
        <video
          className="absolute inset-0 h-full w-full object-cover opacity-[0.07] mix-blend-screen"
          src="/videos/grain.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
      )}
    </div>
  );
}
