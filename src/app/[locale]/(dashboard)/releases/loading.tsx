export default function ReleasesLoading() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <div className="bg-muted h-8 w-28 animate-pulse rounded" />
        <div className="bg-muted mt-2 h-4 w-52 animate-pulse rounded" />
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={`release-${i}`} className="bg-muted h-80 animate-pulse rounded-xl" />
        ))}
      </div>
    </div>
  );
}
