export interface AppLauncher {
  id: string;
  name: string;
  url: string;
  icon: string;       // lucide icon name or emoji
  color: string;      // tailwind color class
  isDefault?: boolean;
  category?: string;
}

export interface Hub {
  id: string;
  name: string;
  icon: string;
  searchQuery: string;
}

export interface SavedFilter {
  id: string;
  name: string;
  createdAt: string;
}

export interface BrowserTab {
  id: string;
  url: string;
  title: string;
}
