import { BlogCardSkeleton } from "@/components/BlogCardSkeleton";

export default function Loading() {
  return (
    <div>
      {/* Hero skeleton */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 text-center">
        <div className="h-6 w-48 rounded-full skeleton mx-auto mb-6" />
        <div className="h-14 w-3/4 rounded-xl skeleton mx-auto mb-4" />
        <div className="h-14 w-1/2 rounded-xl skeleton mx-auto mb-6" />
        <div className="h-5 w-2/3 rounded skeleton mx-auto mb-10" />
        <div className="flex gap-4 justify-center">
          <div className="h-12 w-36 rounded-xl skeleton" />
          <div className="h-12 w-36 rounded-xl skeleton" />
        </div>
      </div>

      {/* Latest News skeleton */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-7 w-40 rounded skeleton" />
          <div className="flex-1 h-px bg-border/30" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          <div className="lg:col-span-3 h-[420px] rounded-2xl skeleton" />
          <div className="lg:col-span-2 flex flex-col gap-5">
            <div className="flex-1 min-h-[180px] rounded-2xl skeleton" />
            <div className="flex-1 min-h-[180px] rounded-2xl skeleton" />
          </div>
        </div>
      </div>

      {/* Blog feed skeleton */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="h-8 w-48 rounded skeleton mb-2" />
        <div className="h-5 w-72 rounded skeleton mb-10" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <BlogCardSkeleton count={6} />
        </div>
      </div>
    </div>
  );
}
