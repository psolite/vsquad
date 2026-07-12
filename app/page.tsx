"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useSquadStore } from "@/store/squadStore";
import { squadApi } from "@/lib/api/squadApi";
import { useAccountId } from "@/lib/useAccountId";
import GoogleLoginButton from "@/components/GoogleLoginButton";
import Spinner from "@/components/Spinner";

export default function LandingPage() {
  const { id: accountId } = useAccountId();
  const router = useRouter();
  const { loadSquad } = useSquadStore();
  // Derived, not state: this effect always ends by navigating away, so
  // there's nothing to reset back to false — it's just "are we mid-check".
  const checking = !!accountId;

  const { data: squadRecord, isSuccess, isError, error } = useQuery({
    queryKey: ["squad", accountId],
    queryFn: () => squadApi.get(accountId!),
    enabled: !!accountId,
    retry: false,
  });

  useEffect(() => {
    if (!isSuccess || !squadRecord) return;
    loadSquad(squadRecord.squad, squadRecord.squadName, squadRecord.locked);
    router.push("/my-squad");
  }, [isSuccess, squadRecord, router, loadSquad]);

  useEffect(() => {
    if (!isError) return;
    if (!(error instanceof Error) || error.message !== "Squad not found") {
      console.error("[landing] failed to load squad for account", accountId, error);
    }
    router.push("/squad");
  }, [isError, error, router, accountId]);

  return (
    <div className="landing-page relative flex flex-col items-center justify-center flex-1 overflow-hidden h-svh">
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_bottom,rgba(4,8,9,0.15)_0%,rgba(4,8,9,0.25)_40%,rgba(4,8,9,0.7)_100%)]" />

      <div className="absolute pointer-events-none w-175 h-87.5 top-1/2 left-1/2 -translate-x-1/2 translate-y-[-60%] bg-[radial-gradient(ellipse,rgba(0,255,135,0.07)_0%,transparent_70%)] blur-[48px]" />

      <div
        className="relative z-10 flex flex-col items-center text-center w-full max-w-2xl px-6 gap-5 pt-6 pb-9
          [@media(max-height:780px)]:gap-3 [@media(max-height:780px)]:pt-2 [@media(max-height:780px)]:pb-5
          [@media(max-width:480px)]:gap-3 [@media(max-width:480px)]:pt-2 [@media(max-width:480px)]:pb-5"
      >
        <div className="inline-flex items-center gap-3">
          <div className="h-px w-10 bg-accent/40" />
          <span className="text-accent text-xs font-black uppercase tracking-[0.3em]">
            FIFA World Cup 2026™
          </span>
          <div className="h-px w-10 bg-accent/40" />
        </div>

        <h1 className="font-black uppercase leading-none select-none m-0 text-[clamp(40px,13vw,110px)] tracking-[-0.03em]">
          <span className="text-white">V</span>
          <span className="text-accent [text-shadow:0_0_100px_rgba(0,255,135,0.4)]">
            SQUAD
          </span>
        </h1>

        <div className="flex flex-col items-center gap-2">
          <p className="text-white/70 font-semibold uppercase text-[clamp(12px,2vw,15px)] tracking-[0.22em]">
            5-a-side Fantasy Football
          </p>
          <div className="flex flex-row items-center flex-wrap justify-center gap-[0.6rem]">
            {[
              {
                label: "1 GK",
                bg: "rgba(234,179,8,0.2)",
                color: "#facc15",
                border: "rgba(234,179,8,0.3)",
              },
              {
                label: "·",
                bg: "transparent",
                color: "rgba(255,255,255,0.7)",
                border: "transparent",
              },
              {
                label: "2 DEF",
                bg: "rgba(59,130,246,0.2)",
                color: "#60a5fa",
                border: "rgba(59,130,246,0.3)",
              },
              {
                label: "·",
                bg: "transparent",
                color: "rgba(255,255,255,0.7)",
                border: "transparent",
              },
              {
                label: "2 FWD",
                bg: "rgba(239,68,68,0.2)",
                color: "#f87171",
                border: "rgba(239,68,68,0.3)",
              },
            ].map(({ label, bg, color, border }, i) =>
              label === "·" ? (
                <span
                  key={i}
                  className="text-base font-bold leading-none"
                  style={{ color }}
                >
                  ·
                </span>
              ) : (
                <span
                  key={i}
                  className="py-1.5 px-4 rounded-full text-[11px] font-black uppercase tracking-[0.08em] whitespace-nowrap"
                  style={{ background: bg, color, border: `1px solid ${border}` }}
                >
                  {label}
                </span>
              ),
            )}
          </div>
        </div>

        <div className="w-full flex flex-col items-center p-2 max-w-[320px]">
          <div className="relative p-2">
            <div className="absolute inset-0 rounded-xl blur-xl opacity-35 pointer-events-none bg-accent scale-115" />
            <WalletMultiButton />
          </div>
          <div className="w-full flex items-center gap-2.5 mt-3">
            <div className="flex-1 h-px bg-white/20" />
            <span className="text-white/70 text-[10px] uppercase font-bold tracking-[0.2em]">
              or
            </span>
            <div className="flex-1 h-px bg-white/20" />
          </div>
          <div className="mt-3">
            <GoogleLoginButton />
          </div>
          {checking && (
            <div className="inline-flex items-center justify-center gap-1.5 mt-2.5 text-[11px] font-bold tracking-widest uppercase text-accent/60">
              <Spinner size={12} />
              Loading your squad…
            </div>
          )}
        </div>

        <div className="w-full">
          <div className="w-full flex items-center gap-4 mb-3">
            <div className="flex-1 h-px bg-white/20" />
            <span className="text-white/70 text-[10px] uppercase font-bold tracking-[0.2em]">
              Tournament
            </span>
            <div className="flex-1 h-px bg-white/20" />
          </div>
          <div className="w-full grid grid-cols-3">
            {[
              { value: "48", label: "Nations" },
              { value: "104", label: "Matches" },
              { value: "5", label: "Your Squad" },
            ].map(({ value, label }, i) => (
              <div
                key={i}
                className={`flex flex-col items-center gap-1 py-1 ${i > 0 ? "border-l border-white/20" : ""}`}
              >
                <span className="font-black text-white leading-none text-[clamp(26px,5vw,40px)]">
                  {value}
                </span>
                <span className="text-white/70 text-[10px] font-medium uppercase tracking-[0.2em]">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center gap-2 pointer-events-none z-10">
        <span className="text-white/70 text-[10px] uppercase tracking-widest font-medium">
          Powered by
        </span>
        <span className="text-white/70 text-[11px] font-black uppercase tracking-widest">
          TXODDS
        </span>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none bg-[linear-gradient(to_top,rgba(4,8,9,0.6),transparent)]" />
    </div>
  );
}
