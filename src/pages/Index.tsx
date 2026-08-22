import { useState } from 'react';
import { TopBar } from '@/components/layout/TopBar';
import { SearchBar } from '@/components/features/SearchBar';
import { HubRow } from '@/components/features/HubRow';
import { LauncherGrid } from '@/components/features/LauncherGrid';
import { AddLauncherModal } from '@/components/features/AddLauncherModal';
import { BrowserPanel } from '@/components/features/BrowserPanel';
import { MediaPlayerPanel } from '@/components/features/MediaPlayerPanel';
import { LeftSidebar } from '@/components/features/LeftSidebar';
import { RightSidebar } from '@/components/features/RightSidebar';
import { AdminPanel } from '@/components/features/AdminPanel';
import { useLaunchers } from '@/hooks/useLaunchers';
import type { Hub, AppLauncher } from '@/types';
import { cn } from '@/lib/utils';
import heroBanner from '@/assets/hero-banner.jpg';

type PanelState =
  | { type: 'none' }
  | { type: 'browser'; url: string; title: string }
  | { type: 'media' };

const Index = () => {
  const { launchers, addLauncher, removeLauncher } = useLaunchers();
  const [panel, setPanel] = useState<PanelState>({ type: 'none' });
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [activeHub, setActiveHub] = useState<string | null>(null);
  const [leftOpen, setLeftOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);

  const openBrowser = (url: string, title: string) => {
    setPanel({ type: 'browser', url, title });
  };

  const handleHubClick = (hub: Hub) => {
    setActiveHub(hub.id);
    const url = `https://www.google.com/search?q=${encodeURIComponent(hub.searchQuery)}`;
    openBrowser(url, hub.name);
  };

  const handleLaunch = (launcher: AppLauncher) => {
    if (launcher.url === '__media__') {
      setPanel({ type: 'media' });
      return;
    }
    openBrowser(launcher.url, launcher.name);
  };

  const closePanel = () => {
    setPanel({ type: 'none' });
    setActiveHub(null);
  };

  const isPanelOpen = panel.type !== 'none';

  // Content margin based on sidebar state
  const leftMargin = leftOpen ? 'ml-56' : 'ml-0';
  const rightMargin = rightOpen ? 'mr-56' : 'mr-0';

  return (
    <div className="min-h-screen relative">
      {/* Animated background */}
      <div className="super-bg" />
      <div className="super-bg-orb super-bg-orb-1" />
      <div className="super-bg-orb super-bg-orb-2" />
      <div className="super-bg-orb super-bg-orb-3" />

      {/* Sidebars */}
      <LeftSidebar visible={leftOpen} onNavigate={openBrowser} />
      <RightSidebar visible={rightOpen} />

      {/* Top bar — fixed */}
      <TopBar
        editMode={editMode}
        onToggleEdit={() => setEditMode(e => !e)}
        onAdd={() => setAddModalOpen(true)}
        onAdminOpen={() => setAdminOpen(true)}
        leftOpen={leftOpen}
        rightOpen={rightOpen}
        onToggleLeft={() => setLeftOpen(o => !o)}
        onToggleRight={() => setRightOpen(o => !o)}
        sidebarOffset={{ left: leftOpen ? 224 : 0, right: rightOpen ? 224 : 0 }}
      />

      {/* Main content — below fixed TopBar */}
      <div
        className={cn(
          'relative z-10 transition-all duration-300',
          leftMargin, rightMargin
        )}
        style={{ paddingTop: '56px' }}
      >
        <div className={cn('flex gap-3 p-3', isPanelOpen ? 'h-[calc(100vh-56px)]' : 'min-h-[calc(100vh-56px)]')}>

          {/* LEFT COLUMN */}
          <div className={cn(
            'flex flex-col gap-3 min-w-0 transition-all duration-300',
            isPanelOpen ? 'w-[360px] shrink-0' : 'flex-1'
          )}>

            {/* ── STRIP 1: Search Bar (top, always) ── */}
            <SearchBar onSearch={openBrowser} />

            {/* ── HUB ROW + LAUNCHER LABEL (under search bar, horizontal) ── */}
            <div className="glass-card p-2 flex items-center gap-3 flex-wrap">
              {/* Hubs */}
              <div className="flex-1 min-w-0">
                <HubRow activeHub={activeHub} onHubClick={handleHubClick} />
              </div>
              {/* Divider */}
              <div className="h-6 w-px bg-emerald-900/40 hidden sm:block shrink-0" />
              {/* Launcher count badge */}
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-[9px] font-bold text-emerald-700 uppercase tracking-widest">Launchers</span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-900/40 border border-emerald-800/40 px-1.5 py-0.5 rounded-full">
                  {launchers.length}
                </span>
                {editMode && <span className="text-[9px] text-rose-400 font-bold">— EDIT</span>}
              </div>
            </div>

            {/* ── HERO BANNER (only when no panel) ── */}
            {!isPanelOpen && (
              <div className="relative rounded-2xl overflow-hidden h-36 shrink-0"
                style={{ boxShadow: '0 8px 40px rgba(52,211,153,0.1), 0 0 0 1px rgba(52,211,153,0.12)' }}
              >
                <img src={heroBanner} alt="Super Browser" className="w-full h-full object-cover" />
                {/* Emerald-Crimson overlay */}
                <div className="absolute inset-0"
                  style={{ background: 'linear-gradient(135deg, rgba(2,40,24,0.85) 0%, rgba(4,15,10,0.5) 50%, rgba(30,4,12,0.7) 100%)' }}
                />
                <div className="absolute inset-0 flex items-center px-5 justify-between">
                  <div>
                    <h2 className="font-black text-xl leading-tight text-emerald-glow" style={{ textShadow: '0 0 30px rgba(52,211,153,0.6)' }}>
                      Your Web Universe
                    </h2>
                    <p className="text-emerald-400/70 text-xs mt-1 font-medium">Launch, search, watch — all in one place</p>
                    <div className="mt-3 flex gap-2 flex-wrap">
                      <div className="px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-emerald-500/30 text-emerald-300"
                        style={{ background: 'rgba(52,211,153,0.1)', backdropFilter: 'blur(8px)' }}
                      >
                        {launchers.length} Launchers
                      </div>
                      <div className="px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-rose-500/30 text-rose-300"
                        style={{ background: 'rgba(244,63,94,0.1)', backdropFilter: 'blur(8px)' }}
                      >
                        Glassmorphism UI
                      </div>
                      <div className="px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-teal-500/30 text-teal-300"
                        style={{ background: 'rgba(20,184,166,0.1)', backdropFilter: 'blur(8px)' }}
                      >
                        Emerald × Crimson
                      </div>
                    </div>
                  </div>
                  {/* Mini icon grid preview */}
                  <div className="hidden md:grid grid-cols-3 gap-1.5 shrink-0">
                    {['▶️','💬','✨','🔍','📧','🐦','💾','🦊','🎬'].map((ic,i) => (
                      <div key={i}
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-base"
                        style={{
                          background: 'rgba(4,30,20,0.6)',
                          backdropFilter: 'blur(8px)',
                          border: '1px solid rgba(52,211,153,0.15)',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                        }}
                      >{ic}</div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── LAUNCHER GRID ── */}
            <div
              className="flex-1 glass-card p-3 overflow-y-auto"
              style={{ minHeight: isPanelOpen ? 0 : '200px' }}
            >
              <LauncherGrid
                launchers={launchers}
                onLaunch={handleLaunch}
                onRemove={removeLauncher}
                editMode={editMode}
              />
            </div>

            {/* ── NEON BOTTOM BAR ── */}
            <div className="flex items-center justify-between px-1 shrink-0">
              <div className="neon-line-emerald flex-1 h-px" />
              <span className="text-[9px] text-emerald-800 px-2 font-medium">Super Browser v2</span>
              <div className="neon-line-crimson flex-1 h-px" />
            </div>
          </div>

          {/* RIGHT COLUMN: Browser / Media panel */}
          {isPanelOpen && (
            <div
              className="flex-1 min-w-0 flex flex-col overflow-hidden rounded-2xl"
              style={{
                background: 'rgba(3,15,10,0.75)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(52,211,153,0.2)',
                boxShadow: '0 8px 40px rgba(52,211,153,0.08), 0 0 0 1px rgba(52,211,153,0.06) inset',
              }}
            >
              {panel.type === 'browser' && (
                <BrowserPanel url={panel.url} title={panel.title} onClose={closePanel} />
              )}
              {panel.type === 'media' && (
                <MediaPlayerPanel onClose={closePanel} />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <AddLauncherModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAdd={addLauncher}
      />
      <AdminPanel
        open={adminOpen}
        onClose={() => setAdminOpen(false)}
        launchers={launchers}
        onRemoveLauncher={removeLauncher}
        onAddLauncher={addLauncher}
      />
    </div>
  );
};

export default Index;
