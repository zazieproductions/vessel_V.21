import { useEffect, useRef } from 'react';
import { Diagram } from './Diagram';
import { Glyph } from './Glyph';
import { LivingImage } from './LivingImage';
import { WarningLabel } from './WarningLabel';
import type { ClusterSpec } from '../lib/types';
import { useArchive } from '../context/ArchiveContext';

export function Cluster({ spec, offset }: { spec: ClusterSpec; offset: number }) {
  const { theme, diagnostic } = useArchive();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    let raf = 0;
    const apply = () => {
      const mid = offset + spec.height * 0.5;
      const delta = window.scrollY + window.innerHeight * 0.5 - mid;
      el.querySelectorAll<HTMLElement>('[data-para]').forEach((node) => {
        const depth = Number(node.dataset.para) || 0.4;
        node.style.setProperty('--para', `${(-delta * depth * 0.045).toFixed(2)}px`);
      });
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        apply();
      });
    };
    apply();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [offset, spec.height, spec.nodes.length]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      data-cluster={spec.index}
      style={{ height: spec.height }}
    >
      <div className="pointer-events-none absolute inset-x-6 top-6 flex items-end justify-between text-[10px] uppercase tracking-[0.28em] text-[var(--paper)]/55">
        <div>
          <div className="font-display text-lg tracking-[0.2em] text-[var(--fg)]/80 md:text-2xl">
            {spec.title}
          </div>
          <div>
            {spec.accession} · LAYOUT/{spec.layout}
          </div>
        </div>
        <div className="text-right">
          CLUSTER {String(spec.index).padStart(4, '0')}
          <div className="text-[var(--accent2)]">PLATES {spec.nodes.length}</div>
        </div>
      </div>

      {spec.diagrams.map((d) => (
        <Diagram key={d.id} d={d} color={theme.accent2} />
      ))}
      {spec.glyphs.map((g) => (
        <Glyph key={g.id} g={g} accent={theme.accent} />
      ))}

      {spec.nodes.map((node) => {
        const depth = 0.35 + (node.z % 7) * 0.08;
        return <LivingImage key={node.uid} node={node} depth={diagnostic ? 0 : depth} />;
      })}

      {spec.warnings.map((w) => (
        <WarningLabel key={w.id} w={w} />
      ))}

      <div className="pointer-events-none absolute bottom-4 left-0 right-0 mx-8 h-px bg-[var(--fg)]/20" />
    </section>
  );
}
