import { useMemo, useState, type CSSProperties } from 'react';
import type { ImageNode, RoomId } from '../lib/types';
import { useArchive } from '../context/ArchiveContext';

const MASK: Record<string, string> = {
  vignette: 'mask-vignette',
  slats: 'mask-slats',
  circle: 'mask-circle',
  jagged: 'mask-jagged',
  film: 'mask-film',
  iris: 'mask-iris',
};

const BEHAVE: Record<string, string> = {
  melt: 'melt',
  glitch: 'glitch',
  pulse: 'pulse-slow',
  orbit: 'orbit',
  burn: 'burn-flicker',
  rotate: 'spin-slow',
};

export function LivingImage({
  node,
  depth,
}: {
  node: ImageNode;
  depth: number;
}) {
  const { frozen, reduced, openRoom, diagnostic } = useArchive();
  const [hover, setHover] = useState(false);
  const [split, setSplit] = useState(false);
  const t = node.treatment;
  const h = node.w / Math.max(0.45, node.item.ratio);

  const filter = useMemo(() => {
    const bits = [
      `hue-rotate(${t.hue + (hover ? 40 : 0)}deg)`,
      `saturate(${hover ? t.sat * 1.25 : t.sat})`,
      `contrast(${hover ? t.contrast * 1.1 : t.contrast})`,
    ];
    if (t.invert > 0) bits.push(`invert(${hover ? 1 - t.invert : t.invert})`);
    return bits.join(' ');
  }, [t, hover]);

  const room = (node.item.room || (node.anomaly === 'eye' ? 'eye' : node.anomaly === 'skeleton' ? 'vessel' : node.anomaly === 'moon' ? 'lunar' : node.anomaly === 'burn' ? 'burning' : node.anomaly === 'stock' ? 'room0' : node.anomaly === 'portal' ? 'nave' : undefined)) as RoomId | undefined;

  const behaveClass = frozen || reduced ? '' : BEHAVE[node.behavior] || '';

  return (
    <figure
      className="group absolute select-none"
      data-living
      data-para={depth}
      style={{
        left: `${node.x}%`,
        top: `${node.y}%`,
        width: `${node.w}%`,
        zIndex: node.z + 2,
        transform: `translateY(var(--para, 0px)) rotate(${node.rot + (hover && node.behavior === 'rotate' ? 8 : 0)}deg)`,
      }}
      onMouseEnter={() => {
        setHover(true);
        if (node.behavior === 'split') setSplit(true);
      }}
      onMouseLeave={() => {
        setHover(false);
        setSplit(false);
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (room) openRoom(room);
      }}
    >
      <div
        className={`relative overflow-hidden bezel ${MASK[t.mask] || ''} ${behaveClass}`}
        style={{
          aspectRatio: `${node.item.ratio}`,
          opacity: t.opacity,
          mixBlendMode: t.blend as CSSProperties['mixBlendMode'],
        }}
      >
        {node.under && (
          <img
            src={node.under.src}
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
            style={{
              opacity: hover && node.behavior === 'reveal' ? 1 : node.behavior === 'reveal' ? 0.15 : 0.35,
              filter: 'grayscale(0.4) contrast(1.2)',
              transform: `scale(${hover ? 1.08 : 1})`,
            }}
          />
        )}

        {node.behavior === 'split' || split ? (
          <div className="absolute inset-0 flex">
            <div className="h-full w-1/2 overflow-hidden">
              <img
                src={node.item.src}
                alt={node.item.alt}
                loading="lazy"
                decoding="async"
                className="h-full w-[200%] max-w-none object-cover"
                style={{
                  filter,
                  transform: `translateX(${hover ? -8 : 0}%) scaleX(${t.flipX ? -1 : 1}) scaleY(${t.flipY ? -1 : 1})`,
                }}
              />
            </div>
            <div className="h-full w-1/2 overflow-hidden">
              <img
                src={node.item.src}
                alt=""
                loading="lazy"
                decoding="async"
                className="h-full w-[200%] max-w-none object-cover"
                style={{
                  marginLeft: '-100%',
                  filter: `${filter} hue-rotate(80deg)`,
                  transform: `translateX(${hover ? 8 : 0}%)`,
                }}
              />
            </div>
          </div>
        ) : (
          <img
            src={node.item.src}
            alt={node.item.alt}
            loading="lazy"
            decoding="async"
            className="relative z-[1] h-full w-full object-cover"
            style={{
              filter,
              transform: `scaleX(${t.flipX ? -1 : 1}) scaleY(${t.flipY ? -1 : 1}) scale(${hover ? 1.06 : 1})`,
              height: hover && node.behavior === 'melt' ? `${100 + 8}%` : '100%',
            }}
          />
        )}

        {node.behavior === 'duplicate' && hover && (
          <img
            src={node.item.src}
            alt=""
            className="pointer-events-none absolute inset-0 z-[2] h-full w-full object-cover opacity-50"
            style={{
              transform: 'translate(10%, -8%) scale(0.92)',
              mixBlendMode: 'screen',
              filter: 'hue-rotate(120deg)',
            }}
          />
        )}

        {t.grain > 0.15 && (
          <div className="noise-overlay absolute inset-0 z-[3]" style={{ opacity: t.grain }} />
        )}

        {node.item.normal && (
          <div className="absolute left-1 top-1 z-[4] border border-black bg-[var(--paper)] px-1 text-[8px] tracking-widest text-black">
            ORDINARY
          </div>
        )}
        {node.item.rare && (
          <div className="absolute right-1 top-1 z-[4] border border-[var(--warn)] bg-black/70 px-1 text-[8px] tracking-widest text-[var(--warn)]">
            ANOMALY
          </div>
        )}
      </div>

      <figcaption className="mt-1 flex items-start justify-between gap-2 text-[9px] uppercase tracking-[0.16em] text-[var(--paper)]/70">
        <span className="line-clamp-2">{node.caption}</span>
        <span className="shrink-0 text-[var(--accent2)]">{node.label}</span>
      </figcaption>

      {diagnostic && (
        <div className="pointer-events-none absolute -left-1 -top-4 font-ui text-[8px] text-[var(--accent2)]">
          {node.uid} · {node.behavior} · {Math.round(node.w)}×{Math.round(h)}
        </div>
      )}
    </figure>
  );
}
