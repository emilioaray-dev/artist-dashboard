export default function SettingsLoading() {
  return (
    <div className="container mx-auto py-6">
      <div className="bg-muted mb-6 h-8 w-24 animate-pulse rounded" />
      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-muted h-64 animate-pulse rounded-xl" />
        <div className="bg-muted h-64 animate-pulse rounded-xl" />
      </div>
    </div>
  );
}
