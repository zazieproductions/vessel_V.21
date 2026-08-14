export const FRAGMENTS = [
  'THE ARCHIVE IS A BODY THAT FORGOT ITS NAME',
  'NODE 7 IS LISTENING',
  'DO NOT INDEX THE MOON',
  'ACCESSION REJECTED / ACCESSION ACCEPTED',
  'SYMBOLIC INTEGRITY: DEGRADED',
  'THIS PLATE WAS EXPOSED TWICE',
  'THE DOOR IN THE CORTEX OPENS INWARD',
  'VESSEL OS DOES NOT DREAM. IT REMEMBERS.',
  'SUBJECT BLINKED DURING CAPTURE',
  'COORDINATES ARE A COURTESY',
  'YOU ARE BEING FILED',
  'THE INSECT ARRANGED ITSELF',
  'HEAT SIGNATURE OF A PRAYER',
  'DISC 7 OF 7 — SURFACE SCRATCHED',
  'THIS IMAGE HAS A TWIN THAT LIES',
  'DO NOT FEED THE PORTAL',
  'FAMILY NEGATIVE / FACE REMOVED AT REQUEST',
  'THE CATHEDRAL IS A MACHINE FOR LOOKING',
  'MICROSCOPIC FEED STALLED AT FRAME 4096',
  'IF YOU CAN READ THIS YOU ARE ALREADY INSIDE',
  'BURN AFTER INDEXING',
  'THE SKELETON IS TRANSLUCENT BECAUSE IT IS HONEST',
  'WARNING: ORDINARY PHOTOGRAPH DETECTED',
  'SEED MUTATED UNDER OBSERVATION',
  'A MAP THAT EATS ITS OWN STREETS',
  'PLEASE REMAIN IN THE FRAME',
  'THE CURSOR IS A RELIC',
  'LAYER 3 CONTAINS A SECOND SKY',
  'THEY PINNED THE MOTHS INTO A SEAL',
  'INFRARED SAYS THE DIAGRAM IS STILL BURNING',
  'ROOM 0 IS TOO NORMAL TO BE SAFE',
  'THE OPERATING SYSTEM IS SENTIENT AND BORED',
  'ALIGN THE RETICLE WITH YOUR DOUBT',
  'ANATOMY OF AN IMPOSSIBLE ORGAN',
  'THIS CLUSTER WAS GENERATED, THEN FOUND',
];

export const SHORT = [
  'VESSEL', 'NODE', 'SEAL', 'PLATE', 'NAVE', 'FEED', 'DISC',
  'IRIS', 'HUSK', 'RITE', 'FILM', 'WAX', 'OIL', 'ASH',
  'GATE', 'HULL', 'VEIN', 'GLYPH', 'HOST', 'ECHO', 'NULL',
  'WORM', 'CROWN', 'LINT', 'DUST', 'CORE', 'HIVE', 'KNOT',
];

export const WARNINGS = [
  'DO NOT DEVELOP',
  'BIOHAZARD / SYMBOLIC',
  'CLASS IV RELIC',
  'UNSTABLE GEOMETRY',
  'LIVE FEED',
  'HANDLE WITH GLOVES',
  'EXPOSURE LIMIT EXCEEDED',
  'CONTAINS A FACE',
  'MAGNETIC',
  'NOT A METAPHOR',
  'KEEP AWAY FROM MOONS',
  'THIS SIDE TOWARD ENEMY',
  'VOID IF SEAL BROKEN',
  'OBSERVER CONTAMINATED',
  'RECURSIVE IMAGE',
];

export const ACCESSION = [
  'ACC', 'PLATE', 'NEG', 'SPEC', 'REL', 'OS', 'CRT', 'MRI', 'CD', 'VES',
];

export const WINDOW_TITLES = [
  'MICROSCOPIC_FEED.exe',
  'SEAL_VIEWER.old',
  'syslog.vessel',
  'WARNING.hlp',
  'MAP_FOLD.atl',
  'diag /dev/iris',
  'CD-ROM 7: READ ERROR',
  'family.neg',
  'burn_queue',
];

export const LOG_LINES = [
  '> mounting /dev/relic',
  '> checksum mismatched — proceeding',
  '> observer entered frame 00:00:00',
  '> glyph table rebuilt (4096 entries)',
  '> heat in plate 19 still climbing',
  '> discarded 7 ordinary photographs',
  '> portal latency: 4.2 liturgies',
  '> seed collision in cluster −3',
  '> the moon refused to be filed',
  '> CRT phosphor memory 61%',
  '> moths rearranged themselves again',
  '> symbolic integrity 34% → 33%',
  '> cursor trail exceeding particle cap',
  '> room 0 door is unlocked',
  '> waiting for key: M R S D ESC',
];

export const ROOM_COPY: Record<string, { title: string; sub: string; body: string[] }> = {
  vessel: {
    title: 'THE VESSEL',
    sub: 'ANNEX / GLASS SKELETON',
    body: [
      'A body stored as light. The ribs keep a faint lime, as if the last meal was a signal.',
      'Do not ask whom it belonged to. The archive answers with another plate.',
      'Integrity of the glass: honest. Integrity of the file: unknown.',
    ],
  },
  lunar: {
    title: 'LUNAR ANNEX',
    sub: 'DO NOT INDEX THE MOON',
    body: [
      'Craters arranged themselves into a watching. The telescope is a confession booth.',
      'Rotation continues after the disc is ejected.',
      'If it looks ordinary, you are not looking long enough.',
    ],
  },
  eye: {
    title: 'THE EYE THAT WATCHES',
    sub: 'IRIS / NAVE / FEED',
    body: [
      'A cathedral learned how to blink. The pupil is a door you have already walked through.',
      'Veins carry infrared. The sclera keeps cyan like a bruise that remembers water.',
      'It returns your looking, slightly delayed.',
    ],
  },
  room0: {
    title: 'ROOM 0',
    sub: 'ORDINARY PHOTOGRAPHS',
    body: [
      'These plates are correctly exposed, correctly posed, correctly filed.',
      'That is the anomaly. Nothing here is wrong except the room that holds them.',
      'You may leave when the faces stop seeming kind.',
    ],
  },
  burning: {
    title: 'BURNING LIBRARY',
    sub: 'GEOMETRY STILL ON FIRE',
    body: [
      'A diagram that will not finish burning. Compass marks survive as embers.',
      'Do not inhale the pink. It is a wavelength, not a smoke.',
      'Copies of this plate ignite other copies. That is how the archive stays warm.',
    ],
  },
  micro: {
    title: 'MICROSCOPIC FEED',
    sub: 'LIVE / STALLED / LIVE',
    body: [
      'Organisms arranged like stained glass. They are not cells. They are rooms.',
      'Flagella keep time for a liturgy no one scheduled.',
      'If the feed freezes, you froze it. Press S to admit this.',
    ],
  },
  nave: {
    title: 'GLITCH CATHEDRAL',
    sub: 'PIXELATED NAVE',
    body: [
      'The stained glass shattered into a codec. Saints are now compression artifacts.',
      'Walk the aisle by scrolling. The altar is a cursor.',
      'Silver dust is just the file system glittering.',
    ],
  },
};

export function accessionOf(n: number): string {
  const p = ACCESSION[n % ACCESSION.length];
  const a = (n * 47 + 1301) % 9000 + 1000;
  const b = (n * 13 + 7) % 99;
  return `${p}-${a}.${String(b).padStart(2, '0')}`;
}
