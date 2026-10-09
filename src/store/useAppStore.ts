import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEFAULT_BOOKMARKS, DEFAULT_HUBS, DEFAULT_LAUNCHERS } from '@/constants/apps';
import type { AppLauncher, Bookmark, HistoryEntry, Hub, MediaItem, Settings } from '@/types';

const uid = (p: string) => `${p}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

export const DEFAULT_SETTINGS: Settings = {
  searchEngine: 'google',
  gridColumns: 'auto',
  openMode: 'panel',
  theme: 'emerald-crimson',
  animations: true,
  glassBlur: true,
  gridLines: true,
  particles: true,
  widgets: ['clock', 'prayer', 'weather'],
  adminPasswordHash: null,
};

// Carry over launchers saved by the previous version of the app
function legacyLaunchers(): AppLauncher[] | null {
  try {
    const raw = localStorage.getItem('super_browser_launchers');
    if (!raw) return null;
    const parsed: AppLauncher[] = JSON.parse(raw);
    const custom = parsed.filter(l => !l.isDefault);
    return custom.length ? [...custom, ...DEFAULT_LAUNCHERS] : null;
  } catch {
    return null;
  }
}

interface AppState {
  launchers: AppLauncher[];
  hubs: Hub[];
  bookmarks: Bookmark[];
  history: HistoryEntry[];
  playlist: MediaItem[];
  settings: Settings;
  sessions: number;

  addLauncher: (l: Omit<AppLauncher, 'id'>) => void;
  updateLauncher: (id: string, patch: Partial<AppLauncher>) => void;
  removeLauncher: (id: string) => void;
  moveLauncher: (id: string, dir: -1 | 1) => void;
  resetLaunchers: () => void;

  addHub: (h: Omit<Hub, 'id'>) => void;
  removeHub: (id: string) => void;
  resetHubs: () => void;

  addBookmark: (b: Omit<Bookmark, 'id'>) => void;
  removeBookmark: (id: string) => void;
  isBookmarked: (url: string) => boolean;

  pushHistory: (title: string, url: string) => void;
  clearHistory: () => void;

  addMedia: (m: Omit<MediaItem, 'id'>) => MediaItem;
  removeMedia: (id: string) => void;

  updateSettings: (patch: Partial<Settings>) => void;
  resetAll: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      launchers: legacyLaunchers() ?? DEFAULT_LAUNCHERS,
      hubs: DEFAULT_HUBS,
      bookmarks: DEFAULT_BOOKMARKS,
      history: [],
      playlist: [],
      settings: DEFAULT_SETTINGS,
      sessions: 0,

      addLauncher: l => set(s => ({ launchers: [{ ...l, id: uid('app') }, ...s.launchers] })),
      updateLauncher: (id, patch) => set(s => ({ launchers: s.launchers.map(l => (l.id === id ? { ...l, ...patch } : l)) })),
      removeLauncher: id => set(s => ({ launchers: s.launchers.filter(l => l.id !== id) })),
      moveLauncher: (id, dir) =>
        set(s => {
          const i = s.launchers.findIndex(l => l.id === id);
          const j = i + dir;
          if (i < 0 || j < 0 || j >= s.launchers.length) return s;
          const next = [...s.launchers];
          [next[i], next[j]] = [next[j], next[i]];
          return { launchers: next };
        }),
      resetLaunchers: () => set({ launchers: DEFAULT_LAUNCHERS }),

      addHub: h => set(s => ({ hubs: [...s.hubs, { ...h, id: uid('hub') }] })),
      removeHub: id => set(s => ({ hubs: s.hubs.filter(h => h.id !== id) })),
      resetHubs: () => set({ hubs: DEFAULT_HUBS }),

      addBookmark: b => set(s => ({ bookmarks: [{ ...b, id: uid('bm') }, ...s.bookmarks.filter(x => x.url !== b.url)] })),
      removeBookmark: id => set(s => ({ bookmarks: s.bookmarks.filter(b => b.id !== id) })),
      isBookmarked: url => get().bookmarks.some(b => b.url === url),

      pushHistory: (title, url) =>
        set(s => ({ history: [{ title, url, time: Date.now() }, ...s.history.filter(h => h.url !== url)].slice(0, 100) })),
      clearHistory: () => set({ history: [] }),

      addMedia: m => {
        const item = { ...m, id: uid('media') };
        set(s => ({ playlist: [...s.playlist, item] }));
        return item;
      },
      removeMedia: id => set(s => ({ playlist: s.playlist.filter(m => m.id !== id) })),

      updateSettings: patch => set(s => ({ settings: { ...s.settings, ...patch } })),
      resetAll: () =>
        set({
          launchers: DEFAULT_LAUNCHERS,
          hubs: DEFAULT_HUBS,
          bookmarks: DEFAULT_BOOKMARKS,
          history: [],
          playlist: [],
          settings: DEFAULT_SETTINGS,
        }),
    }),
    {
      name: 'super_browser_v3',
      version: 1,
      // Local files only live for the session, so they are never persisted
      partialize: s => ({ ...s, playlist: s.playlist.filter(m => !m.local) }),
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<AppState>;
        return { ...current, ...p, settings: { ...DEFAULT_SETTINGS, ...(p.settings ?? {}) } };
      },
      onRehydrateStorage: () => state => {
        if (state) useAppStore.setState({ sessions: (state.sessions ?? 0) + 1 });
      },
    }
  )
);
