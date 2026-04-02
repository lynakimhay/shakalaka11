import { Suspense } from "react";
import HomeClient from "./HomeClient";

// Professional loading component
function HomeLoading() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="h-16 bg-black/50 backdrop-blur-sm border-b border-white/10" />
      <div className="p-4 max-w-[1400px] mx-auto">
        <div className="mb-8">
          <div className="h-8 w-32 bg-zinc-800 rounded-full mb-3 animate-pulse" />
          <div className="flex flex-wrap gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-10 w-20 bg-zinc-800 rounded-full animate-pulse" />
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] bg-zinc-800 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<HomeLoading />}>
      <HomeClient />
    </Suspense>
  );
}