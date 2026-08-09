import { Suspense } from "react";
import HomeClient from "./HomeClient";
import { HomeSectionsSkeleton } from "@/src/components/MovieCardSkeleton";

function HomeLoading() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="h-[64px] sm:h-[76px] bg-black" />
      <div className="pb-10 pt-5">
        <HomeSectionsSkeleton />
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
