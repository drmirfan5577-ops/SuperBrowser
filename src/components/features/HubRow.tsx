import type { Hub } from '@/types';
import { DEFAULT_HUBS } from '@/constants/apps';
import { cn } from '@/lib/utils';

interface HubRowProps {
  activeHub: string | null;
  onHubClick: (hub: Hub) => void;
}

export function HubRow({ activeHub, onHubClick }: HubRowProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-0.5" style={{ scrollbarWidth: 'none' }}>
      {DEFAULT_HUBS.map(hub => (
        <button
          key={hub.id}
          onClick={() => onHubClick(hub)}
          className={cn(
            'hub-btn flex-shrink-0 px-2.5 py-1.5',
            activeHub === hub.id ? 'active' : ''
          )}
        >
          {/* Icon at 1/3 size — original was text-xl ~20px, now ~7px emoji */}
          <span style={{ fontSize: '9px', lineHeight: 1 }}>{hub.icon}</span>
          <span className={cn(
            'text-[9px] font-semibold whitespace-nowrap leading-tight',
            activeHub === hub.id ? 'text-emerald-300' : 'text-emerald-600'
          )}>
            {hub.name}
          </span>
        </button>
      ))}
    </div>
  );
}
