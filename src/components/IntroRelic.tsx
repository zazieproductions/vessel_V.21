import { useArchive } from '../context/ArchiveContext';

export function IntroRelic() {
  const { seed, theme, openRoom } = useArchive();
  return (
    <section className="relative min-h-[100svh] overflow-hidden px-4 pb-24 pt-24 md:px-10">
      <div className="pointer-events-none absolute inset-0 opacity-30 mix-blend-screen">
        <img src="/images/gen/glitch-cathedral.png" alt="" className="h-full w-full object-cover" />
      </div>
      <div className="relative z-10 grid gap-8 md:grid-cols-[1.1fr_0.9fr]">
        <div>
          <div className="mb-3 text-[10px] uppercase tracking-[0.42em] text-[var(--accent2)]">
            DISC 7 OF 7 · READ ERROR · {theme.codename}
          </div>
          <h1 className="font-display text-[clamp(3rem,12vw,9rem)] leading-[0.82] text-[var(--fg)]">
            VES
            <span className="text-[var(--warn)]">S</span>
            EL
          </h1>
          <p className="mt-6 max-w-md text-[12px] leading-6 tracking-[0.08em] text-[var(--paper)]/80">
            A living archive. Occult terminal. Broken CD-ROM. Outsider atlas.
            The organism indexes you as you index it. Seed {seed}. Do not trust
            ordinary photographs.
          </p>
          <div className="mt-8 flex flex-wrap gap-2 text-[9px] uppercase tracking-[0.22em]">
            <span className="border border-[var(--warn)] px-2 py-1 text-[var(--warn)]">biohazard / symbolic</span>
            <span className="border border-[var(--fg)]/40 px-2 py-1">class iv relic</span>
            <span className="border border-[var(--accent2)] px-2 py-1 text-[var(--accent2)]">observer inside frame</span>
          </div>
        </div>
        <div className="relative">
          <div className="bezel overflow-hidden">
            <img src="/images/gen/cdrom-ui.png" alt="obsolete interface" className="w-full mix-blend-screen" />
          </div>
          <button
            className="absolute -left-4 bottom-10 h-28 w-28 overflow-hidden rounded-full border-2 border-[var(--accent2)] shadow-[0_0_40px_var(--glow)]"
            onClick={(e) => {
              e.stopPropagation();
              openRoom('nave');
            }}
            aria-label="mercury portal"
          >
            <img src="/images/gen/mercury-portal.png" alt="" className="h-full w-full object-cover" />
          </button>
        </div>
      </div>
      <div className="relative z-10 mt-16 grid grid-cols-3 gap-2 md:grid-cols-6">
        {[
          ['/images/gen/eye-cathedral.png', 'eye'],
          ['/images/gen/skeleton-glass.png', 'vessel'],
          ['/images/gen/wrong-moon.png', 'lunar'],
          ['/images/gen/burning-diagram.png', 'burning'],
          ['/images/gen/micro-feed.png', 'micro'],
          ['/images/gen/family-blank.png', 'room0'],
        ].map(([src, room]) => (
          <button
            key={room}
            className="bezel overflow-hidden"
            onClick={(e) => {
              e.stopPropagation();
              openRoom(room as 'eye');
            }}
          >
            <img src={src} alt="" className="h-24 w-full object-cover md:h-32" />
          </button>
        ))}
      </div>
      <div className="relative z-10 mt-10 font-ui text-[10px] uppercase tracking-[0.3em] text-[var(--paper)]/50">
        scroll the organism · click the void · keys M R S D ESC
      </div>
    </section>
  );
}
