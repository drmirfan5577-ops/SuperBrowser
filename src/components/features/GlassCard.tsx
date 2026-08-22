import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  strong?: boolean;
  hoverable?: boolean;
}

export function GlassCard({ children, className, onClick, strong = false, hoverable = false }: GlassCardProps) {
  const base = strong ? 'glass-card-strong' : 'glass-card';

  return (
    <div
      onClick={onClick}
      className={cn(
        base,
        hoverable && 'cursor-pointer transition-all duration-200 hover:scale-[1.03] hover:shadow-blue-200/60 active:scale-[0.98]',
        onClick && !hoverable && 'cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  );
}
