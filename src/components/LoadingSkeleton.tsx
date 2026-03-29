"use client";

function Pulse({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-card-border/50 ${className ?? ""}`}
      style={style}
    />
  );
}

export default function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      {/* Strategy summary skeleton */}
      <div className="bg-card border border-card-border rounded-2xl p-6">
        <Pulse className="h-5 w-40 mb-3" />
        <Pulse className="h-3 w-full mb-2" />
        <Pulse className="h-3 w-3/4" />
      </div>

      {/* Stats cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="bg-card border border-card-border rounded-xl p-4 flex flex-col items-center gap-2"
          >
            <Pulse className="h-3 w-20" />
            <Pulse className="h-7 w-28" />
            <Pulse className="h-3 w-16" />
          </div>
        ))}
      </div>

      {/* Chart skeleton */}
      <div className="bg-card border border-card-border rounded-2xl p-6">
        <Pulse className="h-5 w-52 mb-4" />
        <div className="flex items-end gap-2 h-[200px] sm:h-[300px]">
          {[40, 55, 45, 65, 60, 75, 70, 85, 80, 95, 100].map((h, i) => (
            <Pulse key={i} className="flex-1" style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>

      {/* Assets skeleton */}
      <div className="bg-card border border-card-border rounded-2xl p-6">
        <Pulse className="h-5 w-44 mb-4" />
        <div className="space-y-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 rounded-lg border border-card-border"
            >
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <Pulse className="h-4 w-14" />
                  <Pulse className="h-3 w-32" />
                </div>
                <Pulse className="h-3 w-48" />
              </div>
              <Pulse className="h-4 w-10 ml-3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
