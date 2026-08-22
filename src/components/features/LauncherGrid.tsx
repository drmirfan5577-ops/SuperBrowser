import { useState } from 'react';
import { X } from 'lucide-react';
import type { AppLauncher } from '@/types';
import { cn } from '@/lib/utils';

interface LauncherGridProps {
  launchers: AppLauncher[];
  onLaunch: (launcher: AppLauncher) => void;
  onRemove: (id: string) => void;
  editMode: boolean;
}

export function LauncherGrid({ launchers, onLaunch, onRemove, editMode }: LauncherGridProps) {
  return (
    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2.5">
      {launchers.map(launcher => (
        <div key={launcher.id} className="relative group">
          {editMode && !launcher.isDefault && (
            <button
              onClick={e => { e.stopPropagation(); onRemove(launcher.id); }}
              className="absolute -top-1.5 -right-1.5 z-10 w-5 h-5 bg-rose-600 text-white rounded-full flex items-center justify-center shadow-md hover:bg-rose-500 transition-colors"
            >
              <X size={9} />
            </button>
          )}

          <button
            onClick={() => onLaunch(launcher)}
            className="launcher-btn w-full"
          >
            {/* Icon */}
            <div className={cn(
              'w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br shadow-sm transition-all duration-200',
              launcher.color
            )}
              style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.06) inset' }}
            >
              <span className="text-lg leading-none">{launcher.icon}</span>
            </div>

            {/* Name */}
            <span className="text-[9px] font-semibold text-emerald-300/70 text-center leading-tight line-clamp-2 w-full group-hover:text-emerald-200 transition-colors">
              {launcher.name}
            </span>
          </button>
        </div>
      ))}
    </div>
  );
}
