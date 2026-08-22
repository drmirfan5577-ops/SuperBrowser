import { useState } from 'react';
import { Search, ArrowRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  onSearch: (url: string, title: string) => void;
}

const QUICK_ENGINES = [
  { label: 'Google', prefix: 'https://www.google.com/search?q=', icon: '🔍' },
  { label: 'YouTube', prefix: 'https://www.youtube.com/results?search_query=', icon: '▶️' },
  { label: 'DDG', prefix: 'https://duckduckgo.com/?q=', icon: '🦆' },
  { label: 'Bing', prefix: 'https://www.bing.com/search?q=', icon: '🅱️' },
];

const HISTORY_KEY = 'sb_history';

function addToHistory(title: string, url: string) {
  try {
    const hist = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
    const entry = { title, url, time: new Date().toLocaleString() };
    const filtered = hist.filter((h: { url: string }) => h.url !== url);
    localStorage.setItem(HISTORY_KEY, JSON.stringify([entry, ...filtered].slice(0, 50)));
  } catch {}
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [engine, setEngine] = useState(0);
  const [focused, setFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    let url: string;
    let title: string;

    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      url = trimmed;
      title = trimmed;
    } else {
      const selected = QUICK_ENGINES[engine];
      url = selected.prefix + encodeURIComponent(trimmed);
      title = `${selected.label}: ${trimmed}`;
    }

    addToHistory(title, url);
    onSearch(url, title);
    setQuery('');
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div
        className={cn(
          'flex items-center gap-1.5 p-1.5 pl-3 rounded-2xl transition-all duration-300',
          focused
            ? 'shadow-[0_0_0_1px_rgba(52,211,153,0.4),0_0_20px_rgba(52,211,153,0.15)]'
            : ''
        )}
        style={{
          background: 'rgba(4,25,16,0.7)',
          backdropFilter: 'blur(20px)',
          border: focused ? '1px solid rgba(52,211,153,0.4)' : '1px solid rgba(52,211,153,0.15)',
        }}
      >
        {/* Engine Switcher */}
        <div className="hidden sm:flex items-center gap-0.5 shrink-0">
          {QUICK_ENGINES.map((eng, i) => (
            <button
              key={eng.label}
              type="button"
              onClick={() => setEngine(i)}
              className={cn(
                'px-2 py-1 rounded-lg text-[10px] font-medium transition-all',
                engine === i
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'text-emerald-700 hover:text-emerald-400 hover:bg-emerald-900/30'
              )}
            >
              {eng.icon} {eng.label}
            </button>
          ))}
        </div>

        <div className="hidden sm:block w-px h-4 bg-emerald-900/60" />

        {/* Input */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Search size={14} className="text-emerald-600 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Search or enter URL…"
            className="flex-1 bg-transparent outline-none text-emerald-100 placeholder:text-emerald-800 text-sm font-medium min-w-0"
          />
          {query && (
            <button type="button" onClick={() => setQuery('')} className="text-emerald-700 hover:text-emerald-400 transition-colors shrink-0">
              <X size={12} />
            </button>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="btn-emerald flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm shrink-0"
        >
          Go <ArrowRight size={13} />
        </button>
      </div>
    </form>
  );
}
