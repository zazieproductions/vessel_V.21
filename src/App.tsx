import { ArchiveProvider, useArchive } from './context/ArchiveContext';
import { SVGFilters } from './components/SVGFilters';
import { OverlayFX } from './components/OverlayFX';
import { CustomCursor } from './components/CustomCursor';
import { InfiniteArchive } from './components/InfiniteArchive';
import { FloatingWindows } from './components/FloatingWindows';
import { SpawnLayer } from './components/SpawnLayer';
import { HiddenRoom } from './components/HiddenRoom';
import { BootSequence } from './components/BootSequence';
import { HUD } from './components/HUD';
import { Keyboard } from './components/Keyboard';
import { Diagnostic } from './components/Diagnostic';
import { AnomalyLayer } from './components/AnomalyLayer';
import { IntroRelic } from './components/IntroRelic';
import { SymbolRail } from './components/SymbolRail';
import { ClickVoid } from './components/ClickVoid';

function Shell() {
  const { frozen } = useArchive();
  return (
    <div className={`relative min-h-[400vh] bg-[var(--bg)] text-[var(--fg)] ${frozen ? 'frozen' : ''}`}>
      <SVGFilters />
      <Keyboard />
      <ClickVoid />
      <BootSequence />
      <AnomalyLayer />
      <IntroRelic />
      <InfiniteArchive />
      <SymbolRail />
      <FloatingWindows />
      <SpawnLayer />
      <Diagnostic />
      <HUD />
      <HiddenRoom />
      <OverlayFX />
      <CustomCursor />
    </div>
  );
}

export default function App() {
  return (
    <ArchiveProvider>
      <Shell />
    </ArchiveProvider>
  );
}
