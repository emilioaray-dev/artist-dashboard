export default function Loading() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <div className="bg-muted h-8 w-32 animate-pulse rounded" />
        <div className="bg-muted mt-2 h-4 w-64 animate-pulse rounded" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-muted h-28 animate-pulse rounded-xl" />
        ))}
      </div>
    </div>
  );
}
