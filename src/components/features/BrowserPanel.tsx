import { useState } from 'react';
import { X, ExternalLink, RotateCw, ArrowLeft, ArrowRight, Lock } from 'lucide-react';

interface BrowserPanelProps {
  url: string;
  title: string;
  onClose: () => void;
}

export function BrowserPanel({ url, title, onClose }: BrowserPanelProps) {
  const [currentUrl, setCurrentUrl] = useState(url);
  const [addressInput, setAddressInput] = useState(url);
  const [isLoading, setIsLoading] = useState(true);
  const iframeRef = useState<HTMLIFrameElement | null>(null);

  const navigate = (newUrl: string) => {
    setCurrentUrl(newUrl);
    setAddressInput(newUrl);
    setIsLoading(true);
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = addressInput.trim();
    if (!trimmed) return;
    const finalUrl = trimmed.startsWith('http') ? trimmed : `https://www.google.com/search?q=${encodeURIComponent(trimmed)}`;
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
          <RotateCw size={14} className={isLoading ? 'animate-spin text-emerald-400' : ''} />
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
      {isLoading && <div className="h-0.5 loading-bar shrink-0" />}

      {/* iframe */}
      <div className="flex-1 relative overflow-hidden" style={{ background: '#020f09' }}>
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
          src={currentUrl}
          className="w-full h-full"
          title={title}
          onLoad={() => setIsLoading(false)}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-presentation"
          allow="autoplay; fullscreen; clipboard-write"
          style={{ border: 'none' }}
        />
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
