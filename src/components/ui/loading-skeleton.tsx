import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  className?: string;
  count?: number;
}

export function LoadingSkeleton({ className, count = 1 }: LoadingSkeletonProps) {
  return (
    <div className={cn("animate-pulse", className)}>
      {[...Array(count)].map((_, i) => (
        <div key={i} className="h-4 bg-gray-200 rounded w-full mb-2 last:mb-0" />
      ))}
    </div>
  );
}

export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("bg-white rounded-lg border border-gray-200 p-6", className)}>
      <div className="animate-pulse space-y-4">
        <div className="h-6 bg-gray-200 rounded w-1/3"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="animate-pulse space-y-3">
      {/* Header */}
      <div className="flex space-x-4 py-2">
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/6"></div>
      </div>
      {/* Rows */}
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="flex items-center space-x-4 py-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-3 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
          <div className="h-4 bg-gray-200 rounded w-20"></div>
          <div className="h-8 w-8 bg-gray-200 rounded"></div>
        </div>
      ))}
    </div>
  );
}

export function StatsSkeleton() {
  return (
    <div className="grid gap-3 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
      
      {/* Content */}
      <div className="space-y-4 md:space-y-6">
        <CardSkeleton />
        <StatsSkeleton />
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
} 