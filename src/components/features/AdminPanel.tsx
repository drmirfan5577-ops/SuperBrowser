import { useState } from 'react';
import { Shield, Lock, X, Users, Globe, Palette, Settings, Package, Plus, Trash2, Eye, EyeOff, RefreshCw, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ICON_OPTIONS, COLOR_OPTIONS } from '@/constants/apps';
import type { AppLauncher } from '@/types';

interface AdminPanelProps {
  open: boolean;
  onClose: () => void;
  launchers: AppLauncher[];
  onRemoveLauncher: (id: string) => void;
  onAddLauncher: (l: Omit<AppLauncher, 'id'>) => void;
}

const DEFAULT_PASSWORD = '1122';

type AdminTab = 'overview' | 'launchers' | 'icons' | 'sections' | 'settings';

export function AdminPanel({ open, onClose, launchers, onRemoveLauncher, onAddLauncher }: AdminPanelProps) {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState('');
  const [pwError, setPwError] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [tab, setTab] = useState<AdminTab>('overview');

  // New launcher form
  const [newName, setNewName] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newIcon, setNewIcon] = useState(ICON_OPTIONS[0]);
  const [newColor, setNewColor] = useState(COLOR_OPTIONS[0].value);
  const [newCategory, setNewCategory] = useState('Custom');
  const [addError, setAddError] = useState('');

  // New section form
  const [sectionName, setSectionName] = useState('');
  const [sectionIcon, setSectionIcon] = useState('📂');
  const [sections, setSections] = useState<{name:string;icon:string}[]>(() => {
    try { return JSON.parse(localStorage.getItem('sb_sections') || '[]'); } catch { return []; }
  });

  if (!open) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw === DEFAULT_PASSWORD) {
      setAuthed(true);
      setPwError('');
    } else {
      setPwError('Incorrect password. Default: 1122');
    }
  };

  const handleClose = () => {
    setAuthed(false);
    setPw('');
    setPwError('');
    onClose();
  };

  const handleAddLauncher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) { setAddError('Name required'); return; }
    if (!newUrl.trim()) { setAddError('URL required'); return; }
    const finalUrl = newUrl.startsWith('http') ? newUrl : `https://${newUrl}`;
    onAddLauncher({ name: newName.trim(), url: finalUrl, icon: newIcon, color: newColor, category: newCategory });
    setNewName(''); setNewUrl(''); setNewIcon(ICON_OPTIONS[0]); setNewColor(COLOR_OPTIONS[0].value); setAddError('');
  };

  const addSection = () => {
    if (!sectionName.trim()) return;
    const updated = [...sections, { name: sectionName.trim(), icon: sectionIcon }];
    setSections(updated);
    localStorage.setItem('sb_sections', JSON.stringify(updated));
    setSectionName('');
  };

  const removeSection = (i: number) => {
    const updated = sections.filter((_, idx) => idx !== i);
    setSections(updated);
    localStorage.setItem('sb_sections', JSON.stringify(updated));
  };

  const TABS: { id: AdminTab; label: string; icon: string }[] = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'launchers', label: 'Launchers', icon: '🚀' },
    { id: 'icons', label: 'Icons', icon: '🎨' },
    { id: 'sections', label: 'Sections', icon: '📂' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={handleClose} />

      <div
        className="relative w-full max-w-2xl max-h-[85vh] flex flex-col glass-card-strong rounded-2xl z-10 overflow-hidden"
        style={{ border: '1px solid rgba(52,211,153,0.3)', boxShadow: '0 0 60px rgba(52,211,153,0.15), 0 20px 60px rgba(0,0,0,0.5)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-emerald-900/40 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <Shield size={18} className="text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-emerald-300">Admin Panel</h2>
              <p className="text-[10px] text-emerald-700">Super Browser Control Center</p>
            </div>
          </div>
          <button onClick={handleClose} className="p-2 rounded-lg text-emerald-700 hover:text-rose-400 hover:bg-rose-900/20 transition-all">
            <X size={16} />
          </button>
        </div>

        {!authed ? (
          /* === LOGIN === */
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="w-full max-w-xs">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-600/20 border border-emerald-500/30 flex items-center justify-center">
                  <Lock size={28} className="text-emerald-400" />
                </div>
              </div>
              <h3 className="text-center text-lg font-bold text-emerald-300 mb-1">Admin Access</h3>
              <p className="text-center text-xs text-emerald-700 mb-6">Enter password to continue</p>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={pw}
                    onChange={e => { setPw(e.target.value); setPwError(''); }}
                    placeholder="Enter admin password"
                    className="glass-input pr-10"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(s => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-600 hover:text-emerald-400"
                  >
                    {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                {pwError && (
                  <div className="flex items-center gap-2 text-rose-400 text-xs bg-rose-900/20 border border-rose-800/40 rounded-lg px-3 py-2">
                    <AlertTriangle size={12} />
                    <span>{pwError}</span>
                  </div>
                )}
                <button type="submit" className="btn-emerald w-full py-2.5 rounded-xl text-sm">
                  Unlock Admin Panel
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* === ADMIN CONTENT === */
          <div className="flex flex-1 min-h-0">
            {/* Sidebar nav */}
            <div className="w-36 border-r border-emerald-900/30 p-2 space-y-1 shrink-0">
              {TABS.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={cn(
                    'w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-left text-xs font-medium transition-all',
                    tab === t.id
                      ? 'bg-emerald-900/50 text-emerald-300 border border-emerald-700/40'
                      : 'text-emerald-700 hover:text-emerald-400 hover:bg-emerald-900/20'
                  )}
                >
                  <span>{t.icon}</span> {t.label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">

              {tab === 'overview' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-emerald-300">System Overview</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Total Launchers', value: launchers.length, icon: '🚀', color: 'border-emerald-500/30 bg-emerald-900/20' },
                      { label: 'Custom Apps', value: launchers.filter(l => !l.isDefault).length, icon: '✨', color: 'border-teal-500/30 bg-teal-900/20' },
                      { label: 'Custom Sections', value: sections.length, icon: '📂', color: 'border-blue-500/30 bg-blue-900/20' },
                      { label: 'History Items', value: (() => { try { return JSON.parse(localStorage.getItem('sb_history') || '[]').length; } catch { return 0; } })(), icon: '📜', color: 'border-rose-500/30 bg-rose-900/20' },
                    ].map((stat, i) => (
                      <div key={i} className={cn('rounded-xl p-3 border', stat.color)}>
                        <div className="text-lg mb-1">{stat.icon}</div>
                        <div className="text-xl font-bold text-emerald-200">{stat.value}</div>
                        <div className="text-[10px] text-emerald-600">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                  <div className="glass-card rounded-xl p-3">
                    <p className="text-xs font-semibold text-emerald-400 mb-2">Quick Actions</p>
                    <div className="space-y-2">
                      <button
                        onClick={() => { localStorage.removeItem('sb_history'); }}
                        className="w-full text-left text-xs px-3 py-2 rounded-lg border border-rose-800/40 text-rose-400 hover:bg-rose-900/20 transition-all flex items-center gap-2"
                      >
                        <Trash2 size={12} /> Clear Browse History
                      </button>
                      <button
                        onClick={() => { localStorage.removeItem('super_browser_launchers'); window.location.reload(); }}
                        className="w-full text-left text-xs px-3 py-2 rounded-lg border border-rose-800/40 text-rose-400 hover:bg-rose-900/20 transition-all flex items-center gap-2"
                      >
                        <RefreshCw size={12} /> Reset All Launchers to Default
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {tab === 'launchers' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-emerald-300">Manage Launchers</h3>

                  {/* Add form */}
                  <form onSubmit={handleAddLauncher} className="glass-card rounded-xl p-3 space-y-2">
                    <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Add New Launcher</p>
                    <input value={newName} onChange={e => { setNewName(e.target.value); setAddError(''); }} placeholder="App name" className="glass-input text-xs" />
                    <input value={newUrl} onChange={e => { setNewUrl(e.target.value); setAddError(''); }} placeholder="https://..." className="glass-input text-xs" />
                    <div className="flex gap-2">
                      <select value={newCategory} onChange={e => setNewCategory(e.target.value)} className="glass-input text-xs flex-1">
                        {['Social','AI','Media','Dev','News','Productivity','Search','Entertainment','Islamic','Custom'].map(c => (
                          <option key={c} value={c} style={{background:'#041a10'}}>{c}</option>
                        ))}
                      </select>
                    </div>
                    {addError && <p className="text-[10px] text-rose-400">{addError}</p>}
                    <button type="submit" className="btn-emerald w-full py-2 rounded-lg text-xs">
                      <Plus size={12} className="inline mr-1" /> Add Launcher
                    </button>
                  </form>

                  {/* Launcher list */}
                  <div className="space-y-1.5">
                    {launchers.map(l => (
                      <div key={l.id} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-emerald-900/30 hover:border-emerald-700/30 transition-all">
                        <span className="text-sm">{l.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-emerald-200 truncate">{l.name}</p>
                          <p className="text-[9px] text-emerald-700 truncate">{l.url}</p>
                        </div>
                        {l.isDefault ? (
                          <span className="text-[9px] border border-emerald-800 text-emerald-700 px-1.5 py-0.5 rounded">Default</span>
                        ) : (
                          <button onClick={() => onRemoveLauncher(l.id)} className="p-1.5 rounded-lg text-rose-600 hover:text-rose-400 hover:bg-rose-900/20 transition-all">
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {tab === 'icons' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-emerald-300">Icons & Colors</h3>
                  <div>
                    <p className="text-xs font-semibold text-emerald-500 mb-2">Available Icons</p>
                    <div className="grid grid-cols-8 gap-2">
                      {ICON_OPTIONS.map(ic => (
                        <div
                          key={ic}
                          className="w-9 h-9 rounded-lg text-lg flex items-center justify-center border border-emerald-900/40 hover:border-emerald-500/40 cursor-pointer transition-all hover:scale-110 glass-card"
                        >{ic}</div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-emerald-500 mb-2">Color Palette</p>
                    <div className="grid grid-cols-5 gap-2">
                      {COLOR_OPTIONS.map(c => (
                        <div
                          key={c.value}
                          className={cn('h-8 rounded-lg bg-gradient-to-br cursor-pointer border-2 border-transparent hover:border-white/30 transition-all hover:scale-105', c.value)}
                          title={c.label}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="glass-card rounded-xl p-3">
                    <p className="text-xs font-semibold text-emerald-400 mb-2">Custom Icon URL</p>
                    <div className="flex gap-2">
                      <input placeholder="https://favicon.ico" className="glass-input text-xs flex-1" />
                      <button className="btn-emerald px-3 py-2 rounded-lg text-xs">Add</button>
                    </div>
                    <p className="text-[9px] text-emerald-700 mt-1.5">Paste any image URL to use as launcher icon</p>
                  </div>
                </div>
              )}

              {tab === 'sections' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-emerald-300">Sections Manager</h3>
                  <div className="glass-card rounded-xl p-3 space-y-2">
                    <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Add New Section</p>
                    <div className="flex gap-2">
                      <input value={sectionName} onChange={e => setSectionName(e.target.value)} placeholder="Section name..." className="glass-input text-xs flex-1" />
                      <input value={sectionIcon} onChange={e => setSectionIcon(e.target.value)} className="glass-input text-xs w-12 text-center" maxLength={2} />
                      <button onClick={addSection} className="btn-emerald px-3 py-2 rounded-lg text-xs">
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>

                  {sections.length === 0 ? (
                    <div className="text-center py-8 text-emerald-700 text-xs">
                      No custom sections yet. Add one above.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {sections.map((s, i) => (
                        <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-emerald-900/30 glass-card">
                          <span className="text-base">{s.icon}</span>
                          <span className="flex-1 text-sm font-medium text-emerald-200">{s.name}</span>
                          <button onClick={() => removeSection(i)} className="p-1.5 text-rose-600 hover:text-rose-400 transition-colors">
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {tab === 'settings' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-emerald-300">Settings</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Default Search Engine', type: 'select', options: ['Google', 'DuckDuckGo', 'Bing', 'Yahoo'] },
                      { label: 'Grid Columns', type: 'select', options: ['4', '5', '6', '8', '10'] },
                      { label: 'Animation Speed', type: 'select', options: ['Fast', 'Normal', 'Slow'] },
                      { label: 'Background Style', type: 'select', options: ['Emerald Crimson', 'Cyber Blue', 'Dark Pure', 'Galaxy'] },
                    ].map(setting => (
                      <div key={setting.label} className="flex items-center justify-between gap-4">
                        <span className="text-xs text-emerald-300">{setting.label}</span>
                        <select className="glass-input text-xs w-32">
                          {setting.options.map(o => <option key={o} value={o} style={{background:'#041a10'}}>{o}</option>)}
                        </select>
                      </div>
                    ))}
                  </div>
                  <div className="neon-line-emerald my-3" />
                  <div>
                    <p className="text-xs font-semibold text-rose-400 mb-2 flex items-center gap-1.5"><AlertTriangle size={12} /> Danger Zone</p>
                    <button
                      onClick={() => { localStorage.clear(); window.location.reload(); }}
                      className="w-full py-2.5 rounded-xl border border-rose-700/40 text-rose-400 text-xs font-semibold hover:bg-rose-900/20 transition-all"
                    >
                      Reset All Data & Start Fresh
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}
      </div>
    </div>
  );
}
