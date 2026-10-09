import { useEffect, useState } from 'react';
import { X, ExternalLink, RotateCw, Lock, ShieldAlert } from 'lucide-react';

// Sites that send X-Frame-Options / CSP frame-ancestors and render blank inside an iframe
const BLOCKED_HOSTS = [
  'youtube.com', 'whatsapp.com', 'aistudio.google.com', 'mail.google.com', 'gemini.google.com',
  'accounts.google.com', 'x.com', 'twitter.com', 'github.com', 'reddit.com', 'facebook.com',
  'instagram.com', 'linkedin.com', 'openai.com', 'chatgpt.com', 'tradingview.com',
  'steampowered.com', 'duckduckgo.com', 'bing.com', 'netflix.com', 'amazon.com', 'tiktok.com',
];

function getHost(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

function isBlocked(url: string) {
  const host = getHost(url);
  return BLOCKED_HOSTS.some(b => host === b || host.endsWith(`.${b}`));
}

// Rewrite URLs to an embeddable form where the site offers one
function toEmbedUrl(url: string) {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, '');
    if (host === 'google.com') {
      u.searchParams.set('igu', '1');
      return u.toString();
    }
    if (host === 'youtube.com' && u.pathname === '/watch' && u.searchParams.get('v')) {
      return `https://www.youtube.com/embed/${u.searchParams.get('v')}`;
    }
    if (host === 'youtu.be' && u.pathname.length > 1) {
      return `https://www.youtube.com/embed${u.pathname}`;
    }
    return url;
  } catch {
    return url;
  }
}

interface BrowserPanelProps {
  url: string;
  title: string;
  onClose: () => void;
}

export function BrowserPanel({ url, title, onClose }: BrowserPanelProps) {
  const [currentUrl, setCurrentUrl] = useState(url);
  const [addressInput, setAddressInput] = useState(url);
  const [isLoading, setIsLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  // Follow new URLs passed in while the panel is already open
  useEffect(() => {
    setCurrentUrl(url);
    setAddressInput(url);
    setIsLoading(true);
  }, [url]);

  const embedUrl = toEmbedUrl(currentUrl);
  const blocked = embedUrl === currentUrl && isBlocked(currentUrl);

  const navigate = (newUrl: string) => {
    setCurrentUrl(newUrl);
    setAddressInput(newUrl);
    setIsLoading(true);
    setReloadKey(k => k + 1);
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = addressInput.trim();
    if (!trimmed) return;
    const looksLikeDomain = /^[\w-]+(\.[\w-]+)+(\/.*)?$/.test(trimmed);
    const finalUrl = trimmed.startsWith('http')
      ? trimmed
      : looksLikeDomain
        ? `https://${trimmed}`
        : `https://www.google.com/search?q=${encodeURIComponent(trimmed)}`;
    navigate(finalUrl);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div
        className="flex items-center gap-1.5 p-2 shrink-0 rounded-b-none rounded-t-xl"
        style={{
          background: 'rgba(2,15,9,0.85)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(52,211,153,0.15)',
        }}
      >
        <button onClick={() => navigate(currentUrl)} className="p-1.5 rounded-lg text-emerald-700 hover:text-emerald-400 hover:bg-emerald-900/30 transition-all">
          <RotateCw size={14} className={isLoading && !blocked ? 'animate-spin text-emerald-400' : ''} />
        </button>

        {/* Address bar */}
        <form onSubmit={handleAddressSubmit} className="flex-1 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all"
          style={{ background: 'rgba(4,25,16,0.7)', border: '1px solid rgba(52,211,153,0.2)' }}
        >
          <Lock size={10} className="text-emerald-500 shrink-0" />
          <input
            value={addressInput}
            onChange={e => setAddressInput(e.target.value)}
            className="flex-1 bg-transparent text-xs text-emerald-200 outline-none font-medium placeholder:text-emerald-800"
            spellCheck={false}
          />
        </form>

        <button onClick={() => window.open(currentUrl, '_blank', 'noopener,noreferrer')}
          className="p-1.5 rounded-lg text-emerald-700 hover:text-emerald-400 hover:bg-emerald-900/30 transition-all" title="Open in new tab">
          <ExternalLink size={14} />
        </button>
        <button onClick={onClose} className="p-1.5 rounded-lg text-emerald-700 hover:text-rose-400 hover:bg-rose-900/20 transition-all">
          <X size={14} />
        </button>
      </div>

      {/* Loading bar */}
      {isLoading && !blocked && <div className="h-0.5 loading-bar shrink-0" />}

      {/* iframe */}
      <div className="flex-1 relative overflow-hidden" style={{ background: '#020f09' }}>
        {blocked ? (
          <div className="absolute inset-0 flex items-center justify-center p-6">
            <div className="flex flex-col items-center gap-3 text-center max-w-xs">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-rose-900/20 border border-rose-500/30">
                <ShieldAlert size={22} className="text-rose-400" />
              </div>
              <p className="text-sm font-bold text-emerald-200">{title} can't be displayed here</p>
              <p className="text-xs text-emerald-600">
                {getHost(currentUrl) || 'This site'} blocks being shown inside other pages. Open it in a new tab instead.
              </p>
              <button
                onClick={() => window.open(currentUrl, '_blank', 'noopener,noreferrer')}
                className="mt-1 flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-emerald-950 bg-emerald-400 hover:bg-emerald-300 transition-colors"
              >
                <ExternalLink size={13} /> Open {title} in New Tab
              </button>
            </div>
          </div>
        ) : (
        <>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-10"
            style={{ background: 'rgba(2,10,6,0.8)', backdropFilter: 'blur(10px)' }}
          >
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 rounded-full border-2 border-emerald-500/30 border-t-emerald-400 animate-spin" />
              <p className="text-xs text-emerald-500 font-medium">Loading {title}…</p>
            </div>
          </div>
        )}
        <iframe
          key={`${embedUrl}-${reloadKey}`}
          src={embedUrl}
          className="w-full h-full"
          title={title}
          onLoad={() => setIsLoading(false)}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-presentation"
          allow="autoplay; fullscreen; clipboard-write"
          style={{ border: 'none' }}
        />
        </>
        )}
      </div>

      {/* Footer note */}
      <div className="px-3 py-1 shrink-0 flex justify-center" style={{ borderTop: '1px solid rgba(52,211,153,0.08)' }}>
        <p className="text-[9px] text-emerald-800">
          Some sites block embedding.
          <button onClick={() => window.open(currentUrl, '_blank')} className="text-emerald-600 hover:text-emerald-400 mx-1 font-medium transition-colors">
            Open in New Tab
          </button>
          if page doesn't load.
        </p>
      </div>
    </div>
  );
}
