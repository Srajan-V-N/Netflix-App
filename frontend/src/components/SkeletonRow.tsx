export function SkeletonRow() {
  return (
    <div className="mb-8 px-4 md:px-12">
      {/* Row title skeleton */}
      <div className="skeleton-shimmer mb-3 h-5 w-40 rounded" />

      {/* Card skeletons */}
      <div className="flex gap-2 overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="skeleton-shimmer flex-none rounded-md"
            style={{ width: 160, height: 240 }}
          />
        ))}
      </div>
    </div>
  );
}
