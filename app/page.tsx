"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useSquadStore } from "@/store/squadStore";
import { squadApi } from "@/lib/api/squadApi";
import GoogleLoginButton from "@/components/GoogleLoginButton";
import Spinner from "@/components/Spinner";

export default function LandingPage() {
  const { connected, publicKey } = useWallet();
  const router = useRouter();
  const { loadSquad } = useSquadStore();
  const wallet = publicKey?.toBase58() ?? null;
  // Derived, not state: this effect always ends by navigating away, so
  // there's nothing to reset back to false — it's just "are we mid-check".
  const checking = connected && !!publicKey;

  const { data: squadRecord, isSuccess, isError, error } = useQuery({
    queryKey: ["squad", wallet],
    queryFn: () => squadApi.get(wallet!),
    enabled: connected && !!wallet,
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
      console.error("[landing] failed to load squad for wallet", wallet, error);
    }
    router.push("/squad");
  }, [isError, error, router, wallet]);

  return (
    <div
      className="landing-page relative flex flex-col items-center justify-center flex-1 overflow-hidden"
      style={{ minHeight: "100vh" }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(4,8,9,0.15) 0%, rgba(4,8,9,0.25) 40%, rgba(4,8,9,0.7) 100%)",
        }}
      />

      <div
        className="absolute pointer-events-none"
        style={{
          width: "700px",
          height: "350px",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -60%)",
          background:
            "radial-gradient(ellipse, rgba(0,255,135,0.07) 0%, transparent 70%)",
          filter: "blur(48px)",
        }}
      />

      <div
        className="relative z-10 flex flex-col items-center text-center w-full max-w-2xl px-6"
        style={{ gap: "1.25rem" }}
      >
        <div className="inline-flex items-center gap-3">
          <div className="h-px w-10 bg-[#00FF87]/40" />
          <span className="text-[#00FF87] text-xs font-black uppercase tracking-[0.3em]">
            FIFA World Cup 2026™
          </span>
          <div className="h-px w-10 bg-[#00FF87]/40" />
        </div>

        <h1
          className="font-black uppercase leading-none select-none"
          style={{
            fontSize: "clamp(44px, 17vw, 148px)",
            letterSpacing: "-0.03em",
            margin: 0,
          }}
        >
          <span className="text-white">V</span>
          <span
            style={{
              color: "#00FF87",
              textShadow: "0 0 100px rgba(0,255,135,0.4)",
            }}
          >
            SQUAD
          </span>
        </h1>

        <div className="flex flex-col items-center" style={{ gap: "0.5rem" }}>
          <p
            className="text-white/70 font-semibold uppercase"
            style={{
              fontSize: "clamp(12px, 2vw, 15px)",
              letterSpacing: "0.22em",
            }}
          >
            5-a-side Fantasy Football
          </p>
          <div
            className="flex flex-row items-center flex-wrap justify-center"
            style={{ gap: "0.6rem" }}
          >
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
                  style={{
                    color,
                    fontSize: "1rem",
                    fontWeight: 700,
                    lineHeight: 1,
                  }}
                >
                  ·
                </span>
              ) : (
                <span
                  key={i}
                  style={{
                    background: bg,
                    color,
                    border: `1px solid ${border}`,
                    padding: "6px 16px",
                    borderRadius: "999px",
                    fontSize: "11px",
                    fontWeight: 900,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    whiteSpace: "nowrap",
                  }}
                >
                  {label}
                </span>
              ),
            )}
          </div>
        </div>

        <div className="relative" style={{ padding: "0.5rem" }}>
          <div
            className="absolute inset-0 rounded-xl blur-xl opacity-35"
            style={{ background: "#00FF87", transform: "scale(1.15)" }}
          />
          <WalletMultiButton />
          <div className="flex items-center" style={{ gap: "10px", marginTop: "14px" }}>
            <div className="flex-1 h-px bg-white/20" />
            <span
              className="text-white/70 text-[10px] uppercase font-bold"
              style={{ letterSpacing: "0.2em" }}
            >
              or
            </span>
            <div className="flex-1 h-px bg-white/20" />
          </div>
          <div style={{ marginTop: "14px" }}>
            <GoogleLoginButton />
          </div>
          {checking && (
            <div
              className="inline-flex items-center justify-center"
              style={{
                color: "rgba(0,255,135,0.6)",
                fontSize: "11px",
                fontWeight: 700,
                gap: "6px",
                marginTop: "10px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              <Spinner size={12} />
              Loading your squad…
            </div>
          )}
        </div>

        <div className="w-full">
          <div
            className="w-full flex items-center gap-4"
            style={{ marginBottom: "0.75rem" }}
          >
            <div className="flex-1 h-px bg-white/20" />
            <span
              className="text-white/70 text-[10px] uppercase font-bold"
              style={{ letterSpacing: "0.2em" }}
            >
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
                className={`flex flex-col items-center ${i > 0 ? "border-l border-white/20" : ""}`}
                style={{ gap: "0.25rem", padding: "0.25rem 0" }}
              >
                <span
                  className="font-black text-white leading-none"
                  style={{ fontSize: "clamp(26px, 5vw, 40px)" }}
                >
                  {value}
                </span>
                <span
                  className="text-white/70 text-[10px] font-medium uppercase"
                  style={{ letterSpacing: "0.2em" }}
                >
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

      <div
        className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
        style={{
          background: "linear-gradient(to top, rgba(4,8,9,0.6), transparent)",
        }}
      />
    </div>
  );
}
