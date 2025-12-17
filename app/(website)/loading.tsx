import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl cursor-default">
      <div className="flex flex-col lg:flex-row gap-12 items-start mb-20 mt-15 pt-10">
        {/* Left Column */}
        <div className="flex-1 md:w-2/3 w-full space-y-6">
          {/* Badge */}
          <Skeleton className="h-10 w-48 rounded-full" />

          {/* Name */}
          <Skeleton className="h-16 w-3/4 md:w-1/2" />

          {/* Role */}
          <Skeleton className="h-8 w-1/3" />

          {/* Description */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>

          {/* Button Groups */}
          <div className="flex flex-wrap gap-4">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>

          {/* Social Links */}
          <div className="flex gap-3">
            <Skeleton className="h-10 w-10 rounded-md" />
            <Skeleton className="h-10 w-10 rounded-md" />
            <Skeleton className="h-10 w-10 rounded-md" />
            <Skeleton className="h-10 w-10 rounded-md" />
          </div>

          {/* Languages */}
          <div className="flex gap-2">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>

          {/* Location info */}
          <div className="flex gap-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-28" />
          </div>
        </div>

        {/* Right Column - Image */}
        <div className="hidden md:block w-1/3">
          <Skeleton className="w-64 h-64 rounded-2xl mx-auto lg:mx-0" />
        </div>
      </div>
    </div>
  );
}
