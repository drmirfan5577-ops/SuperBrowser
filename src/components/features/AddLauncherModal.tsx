import { useState } from 'react';
import { X, Globe, Check } from 'lucide-react';
import { ICON_OPTIONS, COLOR_OPTIONS } from '@/constants/apps';
import type { AppLauncher } from '@/types';
import { cn } from '@/lib/utils';

interface AddLauncherModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (launcher: Omit<AppLauncher, 'id'>) => void;
}

export function AddLauncherModal({ open, onClose, onAdd }: AddLauncherModalProps) {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [icon, setIcon] = useState(ICON_OPTIONS[0]);
  const [color, setColor] = useState(COLOR_OPTIONS[0].value);
  const [category, setCategory] = useState('Custom');
  const [error, setError] = useState('');

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimName = name.trim();
    const trimUrl = url.trim();
    if (!trimName) { setError('Name is required'); return; }
    if (!trimUrl) { setError('URL is required'); return; }
    const finalUrl = trimUrl.startsWith('http') ? trimUrl : `https://${trimUrl}`;
    onAdd({ name: trimName, url: finalUrl, icon, color, category });
    setName(''); setUrl(''); setIcon(ICON_OPTIONS[0]); setColor(COLOR_OPTIONS[0].value); setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div
        className="glass-card-strong relative w-full max-w-md p-5 z-10 rounded-2xl"
        style={{ border: '1px solid rgba(52,211,153,0.3)' }}
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-emerald-700 hover:text-rose-400 transition-colors">
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <Globe size={16} className="text-white" />
          </div>
          <div>
            <h2 className="text-base font-bold text-emerald-300">Add Launcher</h2>
            <p className="text-[10px] text-emerald-700">Add any website as a quick launcher</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-[10px] font-bold text-emerald-600 mb-1 uppercase tracking-wider">App Name</label>
            <input
              value={name}
              onChange={e => { setName(e.target.value); setError(''); }}
              placeholder="e.g. My Website"
              className="glass-input"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-emerald-600 mb-1 uppercase tracking-wider">Website URL</label>
            <input
              value={url}
              onChange={e => { setUrl(e.target.value); setError(''); }}
              placeholder="https://example.com"
              className="glass-input"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-emerald-600 mb-1 uppercase tracking-wider">Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)} className="glass-input">
              {['Social','AI','Media','Dev','News','Productivity','Search','Entertainment','Islamic','Custom'].map(c => (
                <option key={c} value={c} style={{ background: '#041a10' }}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-emerald-600 mb-2 uppercase tracking-wider">Icon</label>
            <div className="flex flex-wrap gap-1.5">
              {ICON_OPTIONS.map(ic => (
                <button key={ic} type="button" onClick={() => setIcon(ic)}
                  className={cn(
                    'w-8 h-8 rounded-lg text-base flex items-center justify-center border transition-all',
                    icon === ic
                      ? 'border-emerald-500/60 bg-emerald-900/40 scale-110 shadow-[0_0_8px_rgba(52,211,153,0.3)]'
                      : 'border-emerald-900/40 bg-emerald-950/30 hover:border-emerald-700/40'
                  )}
                >{ic}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-emerald-600 mb-2 uppercase tracking-wider">Color</label>
            <div className="flex flex-wrap gap-1.5">
              {COLOR_OPTIONS.map(c => (
                <button key={c.value} type="button" onClick={() => setColor(c.value)}
                  className={cn(
                    'w-6 h-6 rounded-lg bg-gradient-to-br border-2 transition-all hover:scale-110',
                    c.value,
                    color === c.value ? 'border-white/50 scale-110' : 'border-transparent'
                  )}
                  title={c.label}
                >
                  {color === c.value && <Check size={10} className="text-white mx-auto" />}
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="flex items-center gap-3 p-2.5 rounded-xl glass-card">
            <div className={cn('w-9 h-9 rounded-xl bg-gradient-to-br flex items-center justify-center', color)}>
              <span className="text-base">{icon}</span>
            </div>
            <div>
              <div className="text-sm font-semibold text-emerald-200">{name || 'App Name'}</div>
              <div className="text-[10px] text-emerald-700 truncate max-w-[200px]">{url || 'https://...'}</div>
            </div>
          </div>

          {error && <p className="text-xs text-rose-400">{error}</p>}

          <button type="submit" className="btn-emerald w-full py-2.5 rounded-xl text-sm">
            Add Launcher
          </button>
        </form>
      </div>
    </div>
  );
}
