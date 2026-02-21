export default function BlogLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="h-4 w-32 rounded skeleton mb-8" />
      <div className="space-y-4 mb-8">
        <div className="flex gap-3">
          <div className="h-5 w-20 rounded-full skeleton" />
          <div className="h-5 w-28 rounded skeleton" />
        </div>
        <div className="h-12 w-3/4 rounded-xl skeleton" />
        <div className="h-6 w-full rounded skeleton" />
      </div>
      <div className="h-64 w-full rounded-2xl skeleton mb-10" />
      <div className="space-y-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-4 w-full rounded skeleton" style={{ width: `${70 + Math.random() * 30}%` }} />
        ))}
      </div>
    </div>
  );
}
