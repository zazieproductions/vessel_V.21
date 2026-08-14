import { motion, AnimatePresence } from 'framer-motion';
import { useArchive } from '../context/ArchiveContext';
import { CATALOG } from '../lib/catalog';
import { ROOM_COPY } from '../lib/lexicon';

export function HiddenRoom() {
  const { room, closeOverlays } = useArchive();
  const copy = room ? ROOM_COPY[room] : null;
  const plates = CATALOG.filter((c) => c.room === room || (room === 'room0' && c.normal) || (room === 'nave' && c.kind === 'ruin'));

  return (
    <AnimatePresence>
      {room && copy && (
        <motion.div
          className="fixed inset-0 z-[75] flex items-center justify-center p-4 md:p-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeOverlays}
        >
          <div className="absolute inset-0 bg-black/80" />
          <motion.article
            className="relative max-h-[90vh] w-full max-w-5xl overflow-y-auto bezel paper-stain p-5 text-black md:p-10"
            initial={{ y: 40, rotate: -1 }}
            animate={{ y: 0, rotate: 0 }}
            exit={{ y: 30, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <header className="mb-6 flex items-start justify-between gap-4 border-b border-black/30 pb-4">
              <div>
                <div className="text-[10px] tracking-[0.3em]">{copy.sub}</div>
                <h2 className="font-display text-3xl md:text-5xl">{copy.title}</h2>
              </div>
              <button
                className="border border-black px-3 py-1 text-[11px] tracking-[0.2em] uppercase"
                onClick={closeOverlays}
              >
                seal / esc
              </button>
            </header>
            <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-3 text-sm leading-relaxed">
                {copy.body.map((p) => (
                  <p key={p}>{p}</p>
                ))}
                <p className="text-[10px] tracking-[0.2em] uppercase opacity-70">
                  Hidden rooms are not exits. They are deeper filings.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {plates.slice(0, 6).map((p) => (
                  <figure key={p.id} className="border border-black/40 bg-black">
                    <img src={p.src} alt={p.alt} className="h-32 w-full object-cover mix-blend-multiply" />
                    <figcaption className="px-1 py-0.5 text-[8px] uppercase tracking-widest">{p.alt}</figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </motion.article>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
