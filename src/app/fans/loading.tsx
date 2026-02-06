export default function FansLoading() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <div className="bg-muted h-8 w-24 animate-pulse rounded" />
        <div className="bg-muted mt-2 h-4 w-48 animate-pulse rounded" />
      </div>
      <div className="bg-muted h-64 animate-pulse rounded-xl" />
    </div>
  );
}
