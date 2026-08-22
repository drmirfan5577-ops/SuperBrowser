import { Plus, Shield, Edit3, Check, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TopBarProps {
  editMode: boolean;
  onToggleEdit: () => void;
  onAdd: () => void;
  onAdminOpen: () => void;
  leftOpen: boolean;
  rightOpen: boolean;
  onToggleLeft: () => void;
  onToggleRight: () => void;
  sidebarOffset: { left: number; right: number };
}

export function TopBar({
  editMode, onToggleEdit, onAdd, onAdminOpen,
  leftOpen, rightOpen, onToggleLeft, onToggleRight,
  sidebarOffset
}: TopBarProps) {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-4"
      style={{
        background: 'rgba(2, 15, 9, 0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(52,211,153,0.15)',
        boxShadow: '0 2px 20px rgba(52,211,153,0.06), 0 1px 0 rgba(52,211,153,0.08) inset',
      }}
    >
      {/* LEFT: Star + Logo */}
      <div className="flex items-center gap-2">
        {/* Left Star Toggle */}
        <button
          onClick={onToggleLeft}
          className="star-btn"
          title="Toggle Left Panel"
        >
          ⭐
        </button>

        {/* Logo */}
        <div className="flex items-center gap-2 ml-1">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <Sparkles size={14} className="text-white" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-sm font-bold leading-tight" style={{ color: '#34d399', textShadow: '0 0 12px rgba(52,211,153,0.4)' }}>
              Super Browser
            </h1>
            <p className="text-[9px] text-emerald-700 leading-tight font-medium">Web Launcher Hub</p>
          </div>
        </div>
      </div>

      {/* CENTER: Actions */}
      <div className="flex items-center gap-2">
        {/* Edit toggle */}
        <button
          onClick={onToggleEdit}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
            editMode
              ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-300'
              : 'border border-emerald-900/40 text-emerald-700 hover:text-emerald-400 hover:border-emerald-700/50'
          )}
        >
          {editMode ? <><Check size={12} /> Done</> : <><Edit3 size={12} /> Edit</>}
        </button>

        {/* Add */}
        <button
          onClick={onAdd}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold btn-emerald"
        >
          <Plus size={12} /> Add
        </button>

        {/* Admin */}
        <button
          onClick={onAdminOpen}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
            'border border-rose-800/40 text-rose-400 hover:bg-rose-900/20 hover:border-rose-700/50'
          )}
          title="Admin Panel (Password: 1122)"
        >
          <Shield size={12} /> Admin
        </button>
      </div>

      {/* RIGHT: Star */}
      <div className="flex items-center gap-2">
        {/* Right Star Toggle */}
        <button
          onClick={onToggleRight}
          className="star-btn star-btn-right"
          title="Toggle Right Panel"
        >
          🌟
        </button>
      </div>
    </header>
  );
}
