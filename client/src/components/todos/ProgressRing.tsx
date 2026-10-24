interface ProgressRingProps {
  completed: number;
  total: number;
  size?: number;
}

export function ProgressRing({ completed, total, size = 64 }: ProgressRingProps) {
  const safeTotal = total > 0 ? total : 0;
  const percentage = safeTotal > 0 ? Math.min(Math.max(completed / safeTotal, 0), 1) : 0;

  const radius = 26;
  const circumference = 2 * Math.PI * radius; // ~163.36
  const offset = circumference * (1 - percentage);

  // Smart label logic:
  const isExtreme = safeTotal > 99;
  const label = isExtreme 
    ? `${Math.round(percentage * 100)}%` 
    : `${completed}/${safeTotal}`;

  // Dynamic font sizing:
  const fontSize = label.length > 5 ? 'text-[10px]' : label.length > 3 ? 'text-xs' : 'text-sm';

  return (
    <div className="relative flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="7"
          className="text-base-200"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="7"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="text-primary-500 transition-all duration-500 ease-out"
        />
      </svg>

      <span className={`absolute font-bold text-title-50 select-none ${fontSize}`}>
        {label}
      </span>
    </div>
  );
}
