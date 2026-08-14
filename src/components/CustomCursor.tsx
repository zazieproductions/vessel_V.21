import { useEffect, useRef } from 'react';
import { useArchive } from '../context/ArchiveContext';
import { writePointer } from '../lib/pointer';

interface P {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
}

const CAP = 42;

export function CustomCursor() {
  const { reduced, frozen, theme } = useArchive();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pos = useRef({ x: 0, y: 0, px: 0, py: 0, vx: 0, vy: 0 });
  const parts = useRef<P[]>([]);
  const hud = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      c.width = window.innerWidth;
      c.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (frozen) return;
      const { x, y, px, py } = pos.current;
      const vx = x - px;
      const vy = y - py;
      pos.current.vx = vx;
      pos.current.vy = vy;
      pos.current.px = x;
      pos.current.py = y;
      writePointer(x, y, vx, vy);

      if (!reduced && (Math.abs(vx) > 0.4 || Math.abs(vy) > 0.4)) {
        parts.current.push({ x, y, vx, vy, life: 1 });
        if (parts.current.length > CAP) parts.current.splice(0, parts.current.length - CAP);
      }

      ctx.clearRect(0, 0, c.width, c.height);
      ctx.globalCompositeOperation = 'lighter';
      for (let i = parts.current.length - 1; i >= 0; i--) {
        const p = parts.current[i];
        p.life -= 0.035;
        p.x += p.vx * 0.15;
        p.y += p.vy * 0.15;
        if (p.life <= 0) {
          parts.current.splice(i, 1);
          continue;
        }
        ctx.fillStyle = theme.accent;
        ctx.globalAlpha = p.life * 0.55;
        ctx.fillRect(p.x, p.y, 2, 2);
        ctx.fillStyle = theme.accent2;
        ctx.fillRect(p.x + p.vx * 0.4, p.y + p.vy * 0.4, 1.4, 1.4);
      }
      ctx.globalAlpha = 1;

      if (hud.current) {
        hud.current.style.transform = `translate(${x + 16}px, ${y + 18}px)`;
        hud.current.textContent = `${Math.round(x).toString(16).toUpperCase().padStart(3, '0')} · ${Math.round(y).toString(16).toUpperCase().padStart(3, '0')}  v${Math.round(Math.hypot(vx, vy))}`;
      }
      if (ring.current) {
        const spd = Math.min(48, Math.hypot(vx, vy));
        ring.current.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) scale(${1 + spd * 0.018}) rotate(${spd * 2}deg)`;
        ring.current.style.filter = spd > 14 ? 'url(#velDistort)' : 'none';
      }
    };
    raf = requestAnimationFrame(tick);

    const move = (e: PointerEvent) => {
      pos.current.x = e.clientX;
      pos.current.y = e.clientY;
    };
    window.addEventListener('pointermove', move, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', move);
    };
  }, [reduced, frozen, theme.accent, theme.accent2]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[80] hidden [@media(pointer:fine)]:block" aria-hidden>
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <div
        ref={ring}
        className="absolute left-0 top-0 h-10 w-10"
        style={{ border: `1px solid ${theme.accent}`, borderRadius: '50%' }}
      >
        <div className="absolute left-1/2 top-0 h-2 w-px -translate-x-1/2 bg-[var(--accent)]" />
        <div className="absolute bottom-0 left-1/2 h-2 w-px -translate-x-1/2 bg-[var(--accent)]" />
        <div className="absolute left-0 top-1/2 h-px w-2 -translate-y-1/2 bg-[var(--accent)]" />
        <div className="absolute right-0 top-1/2 h-px w-2 -translate-y-1/2 bg-[var(--accent)]" />
        <div className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 bg-[var(--warn)]" />
      </div>
      <div
        ref={hud}
        className="absolute left-0 top-0 font-ui text-[10px] tracking-[0.14em] text-[var(--accent2)] mix-blend-screen"
      />
    </div>
  );
}
