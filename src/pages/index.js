// import Header from "@/partials/Header";
import TotalAssets from "@/partials/charts/TotalAssets";
import Proportion from "@/partials/charts/Proportion";
import Daily from "@/partials/charts/Daily";
import Cumulative from "@/partials/charts/Cumulative";
import AssetItems from "@/partials/charts/AssetItems";
import dynamic from "next/dynamic";

const Header = dynamic(() => import("@/partials/Header"), {
  ssr: false,
});
const Insight = dynamic(() => import("@/partials/Insights"), {
  ssr: false,
});
export default function Home() {
  return (
    <main className="max-w-screen-2xl my-0 mx-auto py-16">
      <Header />
      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 grid grid-cols-2 gap-8">
          <div className="col-span-2">
            <TotalAssets />
          </div>
          <Daily />
          <Cumulative />
          <div className="col-span-2">
            <AssetItems />
          </div>
        </div>
        <div>
          <Proportion />
          <div className="mt-8">
            <Insight />
          </div>
        </div>
      </div>
    </main>
  );
}
