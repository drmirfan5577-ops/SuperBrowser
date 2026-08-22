import { useState, useEffect } from 'react';
import type { AppLauncher } from '@/types';
import { DEFAULT_LAUNCHERS } from '@/constants/apps';

const STORAGE_KEY = 'super_browser_launchers';

export function useLaunchers() {
  const [launchers, setLaunchers] = useState<AppLauncher[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: AppLauncher[] = JSON.parse(stored);
        // Merge: keep defaults, add custom ones
        const customIds = parsed.map(p => p.id);
        const missingDefaults = DEFAULT_LAUNCHERS.filter(d => !customIds.includes(d.id));
        return [...parsed, ...missingDefaults].filter((v, i, a) => a.findIndex(x => x.id === v.id) === i);
      }
    } catch (e) {
      console.error('Failed to load launchers from storage', e);
    }
    return DEFAULT_LAUNCHERS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(launchers));
  }, [launchers]);

  const addLauncher = (launcher: Omit<AppLauncher, 'id'>) => {
    const newLauncher: AppLauncher = {
      ...launcher,
      id: `custom_${Date.now()}`,
    };
    setLaunchers(prev => [newLauncher, ...prev]);
    return newLauncher;
  };

  const removeLauncher = (id: string) => {
    setLaunchers(prev => prev.filter(l => l.id !== id));
  };

  const reorderLaunchers = (from: number, to: number) => {
    setLaunchers(prev => {
      const next = [...prev];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
  };

  return { launchers, addLauncher, removeLauncher, reorderLaunchers };
}
