import { useState } from 'react';
import { Globe, Clock, BookmarkPlus, Rss, Bot, BookOpen, Mosque, Users, Cpu, Gamepad2, TrendingUp, FlaskConical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LeftSidebarProps {
  visible: boolean;
  onNavigate: (url: string, title: string) => void;
}

const QUICK_LINKS = [
  { icon: '📰', name: 'BBC News', url: 'https://www.bbc.com/news', color: 'text-red-400' },
  { icon: '🌍', name: 'Al Jazeera', url: 'https://www.aljazeera.com', color: 'text-yellow-400' },
  { icon: '🤖', name: 'ChatGPT', url: 'https://chat.openai.com', color: 'text-emerald-400' },
  { icon: '✨', name: 'Gemini', url: 'https://gemini.google.com', color: 'text-blue-400' },
  { icon: '📖', name: 'Quran.com', url: 'https://quran.com', color: 'text-amber-400' },
  { icon: '🕌', name: 'IslamQA', url: 'https://islamqa.info', color: 'text-green-400' },
  { icon: '💻', name: 'GitHub', url: 'https://github.com', color: 'text-slate-300' },
  { icon: '📊', name: 'TradingView', url: 'https://tradingview.com', color: 'text-emerald-300' },
  { icon: '🎮', name: 'Steam', url: 'https://store.steampowered.com', color: 'text-blue-300' },
  { icon: '🔬', name: 'arXiv', url: 'https://arxiv.org', color: 'text-pink-400' },
];

const HISTORY_KEY = 'sb_history';

export function LeftSidebar({ visible, onNavigate }: LeftSidebarProps) {
  const [tab, setTab] = useState<'links' | 'history'>('links');

  const getHistory = (): { title: string; url: string; time: string }[] => {
    try {
      return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
    } catch { return []; }
  };

  const history = getHistory();

  const clearHistory = () => {
    localStorage.removeItem(HISTORY_KEY);
    window.location.reload();
  };

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-full z-40 flex flex-col transition-all duration-300 overflow-hidden sidebar-panel',
        visible ? 'w-56 opacity-100' : 'w-0 opacity-0 pointer-events-none'
      )}
      style={{ paddingTop: '56px' }}
    >
      {/* Tab switcher */}
      <div className="flex border-b border-emerald-900/40 shrink-0">
        <button
          onClick={() => setTab('links')}
          className={cn(
            'flex-1 py-2.5 text-xs font-semibold transition-all',
            tab === 'links' ? 'text-emerald-400 border-b-2 border-emerald-500' : 'text-emerald-700 hover:text-emerald-400'
          )}
        >
          Quick Links
        </button>
        <button
          onClick={() => setTab('history')}
          className={cn(
            'flex-1 py-2.5 text-xs font-semibold transition-all',
            tab === 'history' ? 'text-emerald-400 border-b-2 border-emerald-500' : 'text-emerald-700 hover:text-emerald-400'
          )}
        >
          History
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {tab === 'links' ? (
          <>
            <p className="text-[9px] font-bold text-emerald-700 uppercase tracking-widest mb-2 px-1">Bookmarked Sites</p>
            {QUICK_LINKS.map((link, i) => (
              <button
                key={i}
                onClick={() => onNavigate(link.url, link.name)}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-all hover:bg-emerald-900/30 hover:border-emerald-700/40 border border-transparent group text-left"
              >
                <span className="text-base">{link.icon}</span>
                <span className="text-xs font-medium text-emerald-200/80 group-hover:text-emerald-200 truncate">{link.name}</span>
              </button>
            ))}
          </>
        ) : (
          <>
            <div className="flex items-center justify-between mb-2 px-1">
              <p className="text-[9px] font-bold text-emerald-700 uppercase tracking-widest">Recent</p>
              {history.length > 0 && (
                <button onClick={clearHistory} className="text-[9px] text-rose-500 hover:text-rose-400 font-medium">Clear</button>
              )}
            </div>
            {history.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-8">
                <Clock size={24} className="text-emerald-800" />
                <p className="text-xs text-emerald-700">No history yet</p>
              </div>
            ) : (
              history.slice(0, 20).map((h, i) => (
                <button
                  key={i}
                  onClick={() => onNavigate(h.url, h.title)}
                  className="w-full flex items-start gap-2 px-2.5 py-2 rounded-lg hover:bg-emerald-900/30 border border-transparent hover:border-emerald-700/40 transition-all text-left"
                >
                  <Globe size={12} className="text-emerald-600 mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-emerald-200/70 truncate leading-tight">{h.title}</p>
                    <p className="text-[9px] text-emerald-800 truncate">{h.time}</p>
                  </div>
                </button>
              ))
            )}
          </>
        )}
      </div>

      {/* Bottom glow line */}
      <div className="h-px neon-line-emerald shrink-0" />
    </aside>
  );
}
