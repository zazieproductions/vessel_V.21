import { useEffect, useMemo, useRef, useState } from 'react';
import { generateCluster } from '../lib/generate';
import { useArchive } from '../context/ArchiveContext';
import { writeScroll } from '../lib/pointer';
import { Cluster } from './Cluster';
import type { ClusterSpec } from '../lib/types';

const PAD = 2;
const START_COUNT = 5;

export function InfiniteArchive() {
  const { seed, frozen } = useArchive();
  const [range, setRange] = useState({ lo: 0, hi: START_COUNT - 1 });
  const heights = useRef<Map<number, number>>(new Map());
  const root = useRef<HTMLDivElement>(null);

  const specs = useMemo(() => {
    const out: ClusterSpec[] = [];
    for (let i = range.lo; i <= range.hi; i++) {
      const spec = generateCluster(seed, i);
      heights.current.set(i, spec.height);
      out.push(spec);
    }
    return out;
  }, [seed, range.lo, range.hi]);

  const offsets = useMemo(() => {
    const map = new Map<number, number>();
    let y = 0;
    for (let i = 0; i < 64; i++) {
      if (i < range.lo) {
        y += heights.current.get(i) ?? 1100;
      }
    }
    for (let i = range.lo; i <= range.hi; i++) {
      map.set(i, y);
      y += heights.current.get(i) ?? 1100;
    }
    return map;
  }, [range.lo, range.hi, specs]);

  const prePad = useMemo(() => {
    let y = 0;
    for (let i = 0; i < range.lo; i++) y += heights.current.get(i) ?? 1100;
    return y;
  }, [range.lo, specs]);

  const postPad = 2400;

  useEffect(() => {
    setRange({ lo: 0, hi: START_COUNT - 1 });
    window.scrollTo(0, 0);
  }, [seed]);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const y = window.scrollY;
        writeScroll(y);
        const vh = window.innerHeight;
        let acc = 0;
        let current = 0;
        const maxKnown = Math.max(range.hi + 8, 12);
        for (let i = 0; i <= maxKnown; i++) {
          const h = heights.current.get(i) ?? 1100;
          if (acc + h > y + vh * 0.4) {
            current = i;
            break;
          }
          acc += h;
          current = i;
        }
        const lo = Math.max(0, current - PAD);
        const hi = current + PAD + 2;
        setRange((prev) => (prev.lo === lo && prev.hi === hi ? prev : { lo, hi }));
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [range.hi]);

  return (
    <div
      ref={root}
      className={frozen ? 'frozen' : ''}
      style={{ paddingTop: prePad, paddingBottom: postPad }}
    >
      {specs.map((spec) => (
        <Cluster key={`${seed}-${spec.index}`} spec={spec} offset={offsets.get(spec.index) ?? 0} />
      ))}
    </div>
  );
}
