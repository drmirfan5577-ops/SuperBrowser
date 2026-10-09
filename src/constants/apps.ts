import type { AppLauncher, Bookmark, Hub, SearchEngineId, ThemeId } from '@/types';

export const DEFAULT_HUBS: Hub[] = [
  { id: 'news', name: 'News Hub', icon: '📰', searchQuery: 'latest world news today', isDefault: true },
  { id: 'ai', name: 'AI Hub', icon: '🤖', searchQuery: 'best AI tools', isDefault: true },
  { id: 'islamic', name: 'Islamic Hub', icon: '🕌', searchQuery: 'Islamic resources quran hadith', isDefault: true },
  { id: 'social', name: 'Social Hub', icon: '👥', searchQuery: 'social media platforms', isDefault: true },
  { id: 'general', name: 'General Hub', icon: '🌐', searchQuery: 'top websites', isDefault: true },
  { id: 'tech', name: 'Tech Hub', icon: '💻', searchQuery: 'technology news programming', isDefault: true },
  { id: 'edu', name: 'Edu Hub', icon: '📚', searchQuery: 'online learning courses education', isDefault: true },
];

export const DEFAULT_LAUNCHERS: AppLauncher[] = [
  { id: 'youtube', name: 'YouTube', url: 'https://youtube.com', icon: '▶️', color: 'from-red-400 to-red-600', isDefault: true, category: 'Entertainment' },
  { id: 'whatsapp', name: 'WhatsApp', url: 'https://web.whatsapp.com', icon: '💬', color: 'from-green-400 to-green-600', isDefault: true, category: 'Social' },
  { id: 'aistudio', name: 'AI Studio', url: 'https://aistudio.google.com', icon: '✨', color: 'from-purple-400 to-purple-600', isDefault: true, category: 'AI' },
  { id: 'google', name: 'Google', url: 'https://www.google.com', icon: '🔍', color: 'from-blue-400 to-blue-600', isDefault: true, category: 'Search' },
  { id: 'gmail', name: 'Gmail', url: 'https://mail.google.com', icon: '📧', color: 'from-red-400 to-orange-500', isDefault: true, category: 'Productivity' },
  { id: 'twitter', name: 'Twitter / X', url: 'https://x.com', icon: '🐦', color: 'from-slate-600 to-slate-800', isDefault: true, category: 'Social' },
  { id: 'github', name: 'GitHub', url: 'https://github.com', icon: '💾', color: 'from-gray-600 to-gray-800', isDefault: true, category: 'Dev' },
  { id: 'reddit', name: 'Reddit', url: 'https://www.reddit.com', icon: '🦊', color: 'from-orange-400 to-orange-600', isDefault: true, category: 'Social' },
  { id: 'quran', name: 'Quran', url: 'https://quran.com', icon: '📖', color: 'from-emerald-400 to-teal-600', isDefault: true, category: 'Islamic' },
  { id: 'wikipedia', name: 'Wikipedia', url: 'https://www.wikipedia.org', icon: '🌍', color: 'from-slate-400 to-slate-600', isDefault: true, category: 'Search' },
  { id: 'media', name: 'Media Player', url: '__media__', icon: '🎬', color: 'from-blue-500 to-indigo-600', isDefault: true, category: 'Media' },
];

export const DEFAULT_BOOKMARKS: Bookmark[] = [
  { id: 'bbc', icon: '📰', name: 'BBC News', url: 'https://www.bbc.com/news' },
  { id: 'aljazeera', icon: '🌍', name: 'Al Jazeera', url: 'https://www.aljazeera.com' },
  { id: 'chatgpt', icon: '🤖', name: 'ChatGPT', url: 'https://chatgpt.com' },
  { id: 'gemini', icon: '✨', name: 'Gemini', url: 'https://gemini.google.com' },
  { id: 'qurancom', icon: '📖', name: 'Quran.com', url: 'https://quran.com' },
  { id: 'sunnah', icon: '🕌', name: 'Sunnah.com', url: 'https://sunnah.com' },
  { id: 'islamqa', icon: '💡', name: 'IslamQA', url: 'https://islamqa.info' },
  { id: 'gh', icon: '💻', name: 'GitHub', url: 'https://github.com' },
  { id: 'tradingview', icon: '📊', name: 'TradingView', url: 'https://www.tradingview.com' },
  { id: 'arxiv', icon: '🔬', name: 'arXiv', url: 'https://arxiv.org' },
];

export const SEARCH_ENGINES: Record<SearchEngineId, { label: string; icon: string; prefix: string }> = {
  google: { label: 'Google', icon: '🔍', prefix: 'https://www.google.com/search?q=' },
  duckduckgo: { label: 'DuckDuckGo', icon: '🦆', prefix: 'https://duckduckgo.com/?q=' },
  bing: { label: 'Bing', icon: '🅱️', prefix: 'https://www.bing.com/search?q=' },
  youtube: { label: 'YouTube', icon: '▶️', prefix: 'https://www.youtube.com/results?search_query=' },
};

// RGB triplets consumed by CSS variables --a1 / --a2 / --a3
export const THEMES: { id: ThemeId; name: string; colors: [string, string, string] }[] = [
  { id: 'emerald-crimson', name: 'Emerald Crimson', colors: ['16 185 129', '244 63 94', '20 184 166'] },
  { id: 'cyber-blue', name: 'Cyber Blue', colors: ['59 130 246', '139 92 246', '6 182 212'] },
  { id: 'golden-purple', name: 'Golden Purple', colors: ['245 158 11', '168 85 247', '236 72 153'] },
  { id: 'ocean-coral', name: 'Ocean Coral', colors: ['6 182 212', '249 115 22', '59 130 246'] },
  { id: 'rose-garden', name: 'Rose Garden', colors: ['236 72 153', '16 185 129', '168 85 247'] },
];

export const CATEGORIES = ['Social', 'AI', 'Media', 'Dev', 'News', 'Productivity', 'Search', 'Entertainment', 'Islamic', 'Custom'];

export const ICON_OPTIONS = ['🌐', '🔗', '📌', '⚡', '🎯', '💡', '📊', '🎨', '🛒', '📰', '🎵', '🏠', '🌍', '🔐', '💼', '🎮', '📷', '✈️', '🏋️', '💰', '🕌', '📖', '🤖', '📺'];

export const COLOR_OPTIONS = [
  { label: 'Blue', value: 'from-blue-400 to-blue-600' },
  { label: 'Purple', value: 'from-purple-400 to-purple-600' },
  { label: 'Green', value: 'from-green-400 to-green-600' },
  { label: 'Red', value: 'from-red-400 to-red-600' },
  { label: 'Orange', value: 'from-orange-400 to-orange-600' },
  { label: 'Pink', value: 'from-pink-400 to-pink-600' },
  { label: 'Teal', value: 'from-teal-400 to-teal-600' },
  { label: 'Indigo', value: 'from-indigo-400 to-indigo-600' },
  { label: 'Yellow', value: 'from-yellow-400 to-amber-500' },
  { label: 'Slate', value: 'from-slate-500 to-slate-700' },
];

export const DEFAULT_ADMIN_PASSWORD = '1122';
