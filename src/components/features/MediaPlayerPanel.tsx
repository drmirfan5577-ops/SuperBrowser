import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, SkipBack, SkipForward, X, Music } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MediaPlayerPanelProps {
  onClose: () => void;
}

const DEMO_VIDEOS = [
  { title: 'Big Buck Bunny (Demo)', url: 'https://www.w3schools.com/html/mov_bbb.mp4', thumbnail: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=200' },
  { title: 'Nature Demo Clip', url: 'https://download.blender.org/peach/bigbuckbunny_movies/BigBuckBunny_640x360.m4v', thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=200' },
];

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function MediaPlayerPanel({ onClose }: MediaPlayerPanelProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [customUrl, setCustomUrl] = useState('');
  const [activeUrl, setActiveUrl] = useState(DEMO_VIDEOS[0].url);
  const [error, setError] = useState('');

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onTimeUpdate = () => setCurrentTime(video.currentTime);
    const onLoaded = () => setDuration(video.duration);
    const onError = () => setError('Could not load this video. Try another URL or open in new tab.');
    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('loadedmetadata', onLoaded);
    video.addEventListener('error', onError);
    return () => {
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('loadedmetadata', onLoaded);
      video.removeEventListener('error', onError);
    };
  }, [activeUrl]);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (playing) { v.pause(); setPlaying(false); }
    else { v.play(); setPlaying(true); }
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !muted;
    setMuted(!muted);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = Number(e.target.value);
    setCurrentTime(Number(e.target.value));
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = videoRef.current;
    const val = Number(e.target.value);
    if (v) v.volume = val;
    setVolume(val);
    setMuted(val === 0);
  };

  const loadCustomUrl = () => {
    const trimmed = customUrl.trim();
    if (!trimmed) return;
    setError('');
    setActiveUrl(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`);
    setPlaying(false);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 shrink-0"
        style={{ background: 'rgba(2,10,6,0.85)', borderBottom: '1px solid rgba(52,211,153,0.12)' }}
      >
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <Music size={13} className="text-white" />
          </div>
          <span className="font-bold text-emerald-300 text-sm">Media Player</span>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-lg text-emerald-700 hover:text-rose-400 hover:bg-rose-900/20 transition-all">
          <X size={14} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Video */}
        <div className="rounded-xl overflow-hidden bg-black aspect-video border border-emerald-900/30"
          style={{ boxShadow: '0 0 30px rgba(52,211,153,0.05)' }}
        >
          {error ? (
            <div className="w-full h-full flex items-center justify-center text-rose-400 text-sm p-4 text-center">{error}</div>
          ) : (
            <video
              ref={videoRef}
              src={activeUrl}
              className="w-full h-full object-contain"
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              playsInline
            />
          )}
        </div>

        {/* Controls */}
        <div className="glass-card p-3 space-y-3">
          {/* Seek bar */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-emerald-700 font-medium w-8">{formatTime(currentTime)}</span>
            <input type="range" min={0} max={duration || 100} value={currentTime} onChange={handleSeek} className="flex-1 cursor-pointer" />
            <span className="text-[10px] text-emerald-700 font-medium w-8 text-right">{formatTime(duration)}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <button onClick={toggleMute} className="p-1.5 rounded-lg hover:bg-emerald-900/30 text-emerald-600 transition-colors">
                {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
              </button>
              <input type="range" min={0} max={1} step={0.05} value={muted ? 0 : volume} onChange={handleVolume} className="w-16 cursor-pointer" />
            </div>

            <div className="flex items-center gap-2">
              <button className="p-1.5 rounded-lg hover:bg-emerald-900/30 text-emerald-700 transition-colors">
                <SkipBack size={16} />
              </button>
              <button
                onClick={togglePlay}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center transition-all active:scale-95"
                style={{ boxShadow: '0 0 20px rgba(52,211,153,0.4)' }}
              >
                {playing ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
              </button>
              <button className="p-1.5 rounded-lg hover:bg-emerald-900/30 text-emerald-700 transition-colors">
                <SkipForward size={16} />
              </button>
            </div>

            <button className="p-1.5 rounded-lg hover:bg-emerald-900/30 text-emerald-700 transition-colors">
              <Maximize size={14} />
            </button>
          </div>
        </div>

        {/* Demo tracks */}
        <div>
          <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-2">Demo Videos</p>
          <div className="space-y-2">
            {DEMO_VIDEOS.map((v, i) => (
              <button
                key={i}
                onClick={() => { setActiveUrl(v.url); setCurrentTrack(i); setError(''); setPlaying(false); }}
                className={cn(
                  'w-full flex items-center gap-3 p-2.5 rounded-xl border transition-all text-left',
                  currentTrack === i && activeUrl === v.url
                    ? 'border-emerald-500/40 bg-emerald-900/30'
                    : 'glass-card hover:border-emerald-700/40'
                )}
              >
                <img src={v.thumbnail} alt="" className="w-9 h-9 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-emerald-200 truncate">{v.title}</p>
                  <p className="text-[9px] text-emerald-700 truncate">{v.url}</p>
                </div>
                {currentTrack === i && playing && (
                  <div className="flex gap-0.5 items-end h-3">
                    {[3,5,4,6,3].map((h,j) => (
                      <div key={j} className="w-0.5 bg-emerald-400 rounded-full animate-pulse" style={{ height: `${h*2}px`, animationDelay: `${j*0.1}s` }} />
                    ))}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Custom URL */}
        <div className="glass-card p-3">
          <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-2">Custom Video URL</p>
          <div className="flex gap-2">
            <input
              value={customUrl}
              onChange={e => setCustomUrl(e.target.value)}
              placeholder="https://example.com/video.mp4"
              className="glass-input text-xs flex-1"
              onKeyDown={e => e.key === 'Enter' && loadCustomUrl()}
            />
            <button onClick={loadCustomUrl} className="btn-emerald px-3 py-2 rounded-lg text-xs">
              Load
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
