import type { Metadata } from "next";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { Hero } from "@/components/marketing/Hero";
import { Features } from "@/components/marketing/Features";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { Cta } from "@/components/marketing/Cta";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { FloatingBalls } from "@/components/marketing/FloatingBalls";

export const metadata: Metadata = {
  title: "VSquad — 5-a-Side Fantasy Football",
  description:
    "Draft a 5-a-side squad, compete in live tournaments, and climb the leaderboard. VSquad is fantasy football built for the pace of small-sided play.",
};

export default function MarketingPage() {
  return (
    <div className="relative min-h-svh overflow-hidden">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,255,135,0.08)_0%,transparent_60%)]" />
      <FloatingBalls />
      <MarketingNav />
      <main className="relative">
        <Hero />
        <Features />
        <HowItWorks />
        <Cta />
      </main>
      <MarketingFooter />
    </div>
  );
}
