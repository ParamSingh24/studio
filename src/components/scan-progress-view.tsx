
'use client';

interface ScanProgressViewProps {
  progress: number;
  status: string;
}

export default function ScanProgressView({ progress, status }: ScanProgressViewProps) {
    const circumference = 2 * Math.PI * 54; // 2 * pi * radius
    const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-10 md:p-20">
      <div className="relative w-48 h-48">
        <svg className="w-full h-full" viewBox="0 0 120 120">
          <circle
            className="text-muted"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            r="54"
            cx="60"
            cy="60"
          />
          <circle
            className="text-primary"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            r="54"
            cx="60"
            cy="60"
            strokeLinecap="round"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: offset,
              transition: 'stroke-dashoffset 0.35s ease-in-out',
              transform: 'rotate(-90deg)',
              transformOrigin: '50% 50%'
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-primary">
          {Math.round(progress)}%
        </div>
      </div>
      <h2 className="text-2xl font-semibold mt-8 animate-pulse">{status}</h2>
      <p className="text-muted-foreground mt-2">Please wait while we sweep your files clean.</p>
    </div>
  );
}
