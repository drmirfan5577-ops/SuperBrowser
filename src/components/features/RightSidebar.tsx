import { useState } from 'react';
import { Palette, Layout, Monitor, Zap, Star, Grid, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RightSidebarProps {
  visible: boolean;
  onThemeChange?: (theme: string) => void;
  currentTheme?: string;
}

const THEMES = [
  { id: 'emerald-crimson', name: 'Emerald Crimson', colors: ['#34d399', '#f43f5e'], desc: 'Current theme' },
  { id: 'cyber-blue', name: 'Cyber Blue', colors: ['#60a5fa', '#818cf8'], desc: 'Neon blue vibes' },
  { id: 'golden-purple', name: 'Golden Purple', colors: ['#fbbf24', '#a855f7'], desc: 'Royal luxury' },
  { id: 'ocean-coral', name: 'Ocean Coral', colors: ['#22d3ee', '#fb923c'], desc: 'Tropical feel' },
  { id: 'matrix', name: 'Matrix Green', colors: ['#4ade80', '#86efac'], desc: 'Classic hacker' },
];

const WIDGETS = [
  { id: 'clock', name: 'Clock Widget', icon: '🕐' },
  { id: 'weather', name: 'Weather', icon: '🌤' },
  { id: 'news', name: 'News Feed', icon: '📰' },
  { id: 'quotes', name: 'Daily Quotes', icon: '💬' },
  { id: 'crypto', name: 'Crypto Ticker', icon: '📈' },
];

const STATS = [
  { label: 'Sites Visited', value: (() => {
    try { return JSON.parse(localStorage.getItem('sb_history') || '[]').length; } catch { return 0; }
  })(), color: 'text-emerald-400' },
  { label: 'Launchers', value: (() => {
    try { return JSON.parse(localStorage.getItem('super_browser_launchers') || '[]').length; } catch { return 0; }
  })(), color: 'text-teal-400' },
  { label: 'Sessions', value: parseInt(localStorage.getItem('sb_sessions') || '0') + 1, color: 'text-rose-400' },
];

export function RightSidebar({ visible, onThemeChange, currentTheme = 'emerald-crimson' }: RightSidebarProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>('stats');

  const toggle = (s: string) => setExpandedSection(prev => prev === s ? null : s);

  return (
    <aside
      className={cn(
        'fixed right-0 top-0 h-full z-40 flex flex-col transition-all duration-300 overflow-hidden sidebar-panel-right',
        visible ? 'w-56 opacity-100' : 'w-0 opacity-0 pointer-events-none'
      )}
      style={{ paddingTop: '56px' }}
    >
      <div className="flex-1 overflow-y-auto p-3 space-y-2">

        {/* Stats Section */}
        <div className="glass-crimson rounded-xl overflow-hidden">
          <button
            onClick={() => toggle('stats')}
            className="w-full flex items-center justify-between px-3 py-2.5 text-left"
          >
            <span className="text-xs font-bold text-rose-300 flex items-center gap-1.5"><Zap size={12} /> Stats</span>
            <ChevronDown size={12} className={cn('text-rose-500 transition-transform', expandedSection === 'stats' && 'rotate-180')} />
          </button>
          {expandedSection === 'stats' && (
            <div className="px-3 pb-3 grid grid-cols-1 gap-2">
              {STATS.map((s, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-[10px] text-rose-200/60">{s.label}</span>
                  <span className={cn('text-sm font-bold', s.color)}>{s.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Themes */}
        <div className="glass-card rounded-xl overflow-hidden">
          <button
            onClick={() => toggle('themes')}
            className="w-full flex items-center justify-between px-3 py-2.5 text-left"
          >
            <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5"><Palette size={12} /> Themes</span>
            <ChevronDown size={12} className={cn('text-emerald-500 transition-transform', expandedSection === 'themes' && 'rotate-180')} />
          </button>
          {expandedSection === 'themes' && (
            <div className="px-3 pb-3 space-y-1.5">
              {THEMES.map(theme => (
                <button
                  key={theme.id}
                  onClick={() => onThemeChange?.(theme.id)}
                  className={cn(
                    'w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left transition-all',
                    currentTheme === theme.id
                      ? 'bg-emerald-900/40 border border-emerald-500/40'
                      : 'hover:bg-emerald-900/20 border border-transparent'
                  )}
                >
                  <div className="flex gap-0.5">
                    {theme.colors.map((c, i) => (
                      <div key={i} className="w-3 h-3 rounded-full" style={{ backgroundColor: c }} />
                    ))}
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-emerald-200">{theme.name}</p>
                    <p className="text-[9px] text-emerald-600">{theme.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Widgets */}
        <div className="glass-card rounded-xl overflow-hidden">
          <button
            onClick={() => toggle('widgets')}
            className="w-full flex items-center justify-between px-3 py-2.5 text-left"
          >
            <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5"><Grid size={12} /> Widgets</span>
            <ChevronDown size={12} className={cn('text-emerald-500 transition-transform', expandedSection === 'widgets' && 'rotate-180')} />
          </button>
          {expandedSection === 'widgets' && (
            <div className="px-3 pb-3 space-y-1">
              {WIDGETS.map(w => (
                <div key={w.id} className="flex items-center justify-between py-1">
                  <span className="text-xs text-emerald-200/70 flex items-center gap-1.5">
                    <span>{w.icon}</span> {w.name}
                  </span>
                  <span className="text-[9px] text-emerald-700 border border-emerald-800 px-1.5 py-0.5 rounded">Soon</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Display */}
        <div className="glass-card rounded-xl overflow-hidden">
          <button
            onClick={() => toggle('display')}
            className="w-full flex items-center justify-between px-3 py-2.5 text-left"
          >
            <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5"><Monitor size={12} /> Display</span>
            <ChevronDown size={12} className={cn('text-emerald-500 transition-transform', expandedSection === 'display' && 'rotate-180')} />
          </button>
          {expandedSection === 'display' && (
            <div className="px-3 pb-3 space-y-2">
              {[
                { label: 'Glass Blur', id: 'blur' },
                { label: 'Neon Glow', id: 'glow' },
                { label: 'Animations', id: 'anim' },
                { label: 'Grid Lines', id: 'grid' },
              ].map(opt => (
                <div key={opt.id} className="flex items-center justify-between">
                  <span className="text-[10px] text-emerald-200/60">{opt.label}</span>
                  <div className="w-8 h-4 rounded-full bg-emerald-500/30 border border-emerald-500/50 relative cursor-pointer">
                    <div className="absolute right-0.5 top-0.5 w-3 h-3 rounded-full bg-emerald-400" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
      <div className="h-px neon-line-crimson shrink-0" />
    </aside>
  );
}
