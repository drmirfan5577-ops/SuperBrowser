export interface AppLauncher {
  id: string;
  name: string;
  url: string;
  icon: string;       // emoji or image URL
  color: string;      // tailwind gradient classes
  isDefault?: boolean;
  category?: string;
}

export interface Hub {
  id: string;
  name: string;
  icon: string;
  searchQuery: string;
  isDefault?: boolean;
}

export interface Bookmark {
  id: string;
  name: string;
  url: string;
  icon: string;
}

export interface HistoryEntry {
  title: string;
  url: string;
  time: number;
}

export interface MediaItem {
  id: string;
  title: string;
  url: string;
  local?: boolean;    // object URL for a local file (session only)
}

export type SearchEngineId = 'google' | 'duckduckgo' | 'bing' | 'youtube';
export type ThemeId = 'emerald-crimson' | 'cyber-blue' | 'golden-purple' | 'ocean-coral' | 'rose-garden';
export type WidgetId = 'clock' | 'prayer' | 'weather' | 'crypto';

export interface Settings {
  searchEngine: SearchEngineId;
  gridColumns: 'auto' | '3' | '4' | '5' | '6' | '8';
  openMode: 'panel' | 'tab';
  theme: ThemeId;
  animations: boolean;
  glassBlur: boolean;
  gridLines: boolean;
  particles: boolean;
  widgets: WidgetId[];
  adminPasswordHash: string | null;   // null = default password
}
