"use client";
import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAccountId } from "@/lib/useAccountId";
import { useSquadStore, isComplete } from "@/store/squadStore";
import type { SlotId } from "@/types";
import Pitch from "@/components/Pitch";
import FlagImg from "@/components/FlagImg";
import Spinner, { LoadingState } from "@/components/Spinner";
import { squadApi } from "@/lib/api/squadApi";

const posBg: Record<string, string> = {
  GK: "rgba(234,179,8,0.15)",
  DEF: "rgba(59,130,246,0.15)",
  FWD: "rgba(239,68,68,0.15)",
};
const posColor: Record<string, string> = {
  GK: "#facc15",
  DEF: "#60a5fa",
  FWD: "#f87171",
};

export default function MySquadPage() {
  const { id: accountId, ready: accountReady } = useAccountId();
  const router = useRouter();
  const {
    squad,
    squadName,
    locked,
    setSquadName,
    lockSquad,
    resetSquad,
    loadSquad,
  } = useSquadStore();

  const complete = isComplete(squad);

  const [showPickModal, setShowPickModal] = useState(false);

  // Local store is in-memory only — if it's empty (fresh session, direct nav,
  // or a refresh), pull the saved squad from the server before deciding there
  // isn't one.
  const loadQuery = useQuery({
    queryKey: ["squad", accountId],
    queryFn: () => squadApi.get(accountId!),
    enabled: !complete && !!accountId,
    retry: false,
  });
  const checkingServer = loadQuery.isLoading;
  const loadError =
    loadQuery.isError &&
    !(loadQuery.error instanceof Error && loadQuery.error.message === "Squad not found")
      ? loadQuery.error instanceof Error
        ? loadQuery.error.message
        : "Failed to load squad"
      : null;

  useEffect(() => {
    if (loadQuery.data) {
      loadSquad(loadQuery.data.squad, loadQuery.data.squadName, loadQuery.data.locked);
    }
  }, [loadQuery.data, loadSquad]);

  useEffect(() => {
    if (!loadQuery.isError) return;
    const err = loadQuery.error;
    if (err instanceof Error && err.message === "Squad not found") return;
    console.error("[my-squad] failed to load squad", accountId, err);
  }, [loadQuery.isError, loadQuery.error, accountId]);

  const saveMutation = useMutation({
    mutationFn: (opts: { locked: boolean }) => squadApi.save(accountId!, squadName, squad, opts.locked),
    onError: (err) => console.error("[my-squad] failed to save squad", accountId, err),
  });
  const saving = saveMutation.isPending;
  const saved = saveMutation.isSuccess;
  const saveError = saveMutation.isError
    ? saveMutation.error instanceof Error
      ? saveMutation.error.message
      : "Save failed"
    : null;

  // Squad was just completed this session (not loaded from the server) — persist it once on mount.
  const autoSaveTriggered = useRef(false);
  useEffect(() => {
    if (!complete || !accountId || autoSaveTriggered.current) return;
    autoSaveTriggered.current = true;
    saveMutation.mutate({ locked });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (accountReady && !accountId) {
    router.push("/");
    return null;
  }
  if (checkingServer) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-0 bg-bg">
        <LoadingState label="Loading your squad…" marginTop="mt-0" />
      </div>
    );
  }
  if (loadError) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 min-h-0 bg-bg p-6 text-center">
        <p className="text-[#f87171] text-[13px]">
          Couldn&apos;t load your saved squad: {loadError}
        </p>
        <p className="text-white/70 text-[11px]">
          Account: {accountId ? `${accountId.slice(0, 4)}…${accountId.slice(-4)}` : "—"}
        </p>
        <a href="/squad" className="text-accent text-xs font-bold">
          Build your squad →
        </a>
      </div>
    );
  }
  if (!complete) {
    router.push("/squad");
    return null;
  }

  async function handleLock() {
    if (!accountId) return;
    lockSquad();
    try {
      await saveMutation.mutateAsync({ locked: true });
      toast.success("Squad locked in!");
    } catch {
      // error already surfaced via saveError / logged in saveMutation's onError
    }
  }

  function handleEdit() {
    setShowPickModal(false);
    router.push("/squad");
  }

  async function handleDeleteAndNew() {
    setShowPickModal(false);
    if (accountId) {
      try {
        await squadApi.delete(accountId);
      } catch {
        /* not yet saved — fine */
      }
    }
    resetSquad();
    toast("Squad cleared", { icon: "🗑️" });
    router.push("/squad");
  }

  const noop = (_slot: SlotId) => {};
  const totalGoals = Object.values(squad).reduce(
    (s, p) => s + (p?.goals ?? 0),
    0,
  );
  const totalCaps = Object.values(squad).reduce(
    (s, p) => s + (p?.caps ?? 0),
    0,
  );

  return (
    <div className="flex-1 flex flex-col overflow-hidden min-h-0 bg-bg">
      <div className="flex items-center justify-between flex-wrap gap-2.5 py-3 px-6 shrink-0 border-b border-white/7 bg-white/2">
        <div>
          <h2 className="text-white font-black text-[13px] uppercase tracking-[0.12em] m-0">
            My Squad
          </h2>
          <p className="text-white/70 text-[11px] mt-0.5 tracking-wider">
            World Cup 2026 · 5-a-side
          </p>
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          {saveError && (
            <span className="text-[#f87171] text-[11px]">
              {saveError}
            </span>
          )}
          {saving && (
            <span className="inline-flex items-center gap-1.25 text-white/70 text-[11px]">
              <Spinner size={11} />
              Saving…
            </span>
          )}
          {saved && !saving && !saveError && (
            <span className="text-accent/60 text-[11px]">
              Saved
            </span>
          )}
          <div className="flex items-center gap-1.75">
            <div
              className={`w-1.75 h-1.75 rounded-full ${
                locked ? "bg-accent shadow-[0_0_6px_#00FF87]" : "bg-[#facc15] shadow-[0_0_6px_#facc15]"
              }`}
            />
            <span
              className={`text-[11px] font-black uppercase tracking-widest ${
                locked ? "text-accent" : "text-[#facc15]"
              }`}
            >
              {locked ? "Locked" : "Draft"}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden min-h-0 max-[860px]:flex-col max-[860px]:overflow-y-auto">
        <div className="w-[42%] shrink-0 border-r border-white/7 p-4 min-h-0 flex flex-col max-[860px]:w-full max-[860px]:h-95 max-[860px]:flex-none max-[860px]:border-r-0 max-[860px]:border-b">
          <div className="flex-1 min-h-0">
            <Pitch squad={squad} selectedSlot={null} onSlotClick={noop} />
          </div>
        </div>

        <div className="flex-1 flex flex-col overflow-y-auto min-h-0 max-[860px]:flex-none max-[860px]:h-auto max-[860px]:overflow-visible py-5 px-6 gap-4.5">
          <div>
            <label className="block mb-2 text-white/70 text-[10px] font-bold uppercase tracking-[0.12em]">
              Squad Name
            </label>
            {!locked ? (
              <input
                type="text"
                placeholder="My Dream Squad..."
                value={squadName}
                onChange={(e) => setSquadName(e.target.value)}
                maxLength={30}
                className="w-full box-border bg-white/5 border border-white/10 rounded-[10px] py-2.5 px-3.5 text-white text-[15px] font-bold outline-none focus:border-accent/40"
              />
            ) : (
              <p className="text-accent text-lg font-black uppercase tracking-[0.06em] m-0">
                {squadName || "—"}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-2 text-white/70 text-[10px] font-bold uppercase tracking-[0.12em]">
              Players
            </label>
            <div className="flex flex-col gap-1.5">
              {(["gk", "def1", "def2", "fwd1", "fwd2"] as SlotId[]).map(
                (id) => {
                  const p = squad[id];
                  if (!p) return null;
                  return (
                    <div
                      key={id}
                      className="flex items-center gap-3 bg-white/4 border border-white/7 rounded-xl py-2.5 px-3.5"
                    >
                      <FlagImg country={p.country} size={24} shape="rect" />
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-bold text-[13px] m-0 whitespace-nowrap overflow-hidden text-ellipsis">
                          {p.name}
                        </p>
                        <p className="text-white/70 text-[11px] mt-0.5">
                          {p.country}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-0.75 shrink-0">
                        <span
                          className="py-0.5 px-2 rounded-[5px] text-[10px] font-black tracking-[0.06em] uppercase"
                          style={{
                            background: posBg[p.position],
                            color: posColor[p.position],
                          }}
                        >
                          {p.position}
                        </span>
                        <span className="text-white/70 text-[10px]">
                          {p.goals}G · {p.caps} caps
                        </span>
                      </div>
                    </div>
                  );
                },
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 max-[480px]:grid-cols-1 gap-2">
            {[
              { value: totalGoals, label: "Total Goals" },
              { value: totalCaps, label: "Total Caps" },
            ].map(({ value, label }) => (
              <div
                key={label}
                className="bg-white/4 border border-white/7 rounded-xl p-3.5 text-center"
              >
                <div className="text-accent text-[26px] font-black leading-none">
                  {value}
                </div>
                <div className="text-white/70 text-[10px] uppercase tracking-widest mt-[5px]">
                  {label}
                </div>
              </div>
            ))}
          </div>

          {!locked ? (
            <div className="flex gap-2.5">
              <button
                onClick={() => setShowPickModal(true)}
                className="flex-1 p-3 rounded-[10px] border border-white/15 bg-transparent text-white/70 font-bold text-xs uppercase tracking-widest cursor-pointer transition-colors hover:border-white/35 hover:text-white"
              >
                Change Squad
              </button>
              <button
                onClick={handleLock}
                disabled={saving}
                className={`flex-1 p-3 rounded-[10px] border-none text-bg font-black text-xs uppercase tracking-widest transition-colors ${
                  saving ? "bg-accent/50 cursor-default" : "bg-accent hover:bg-accent-hover cursor-pointer"
                }`}
              >
                {saving ? "Saving…" : "Lock In"}
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowPickModal(true)}
              className="w-full p-3 rounded-[10px] border border-white/15 bg-transparent text-white/70 font-bold text-xs uppercase tracking-widest cursor-pointer transition-colors hover:border-white/35 hover:text-white"
            >
              Pick a New Squad
            </button>
          )}
        </div>
      </div>

      {showPickModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setShowPickModal(false)}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-[6px]" />
          <div
            className="relative z-10 w-full max-w-95 bg-panel border border-white/10 rounded-[20px] pt-7 px-6 pb-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowPickModal(false)}
              className="absolute top-3.5 right-3.5 bg-white/7 border-none cursor-pointer w-8 h-8 rounded-full text-white/70 text-sm font-bold flex items-center justify-center"
            >
              ✕
            </button>
            <h3 className="text-white font-black text-base uppercase tracking-[0.08em] mt-0 mb-1.5">
              What would you like to do?
            </h3>
            <p className="text-white/70 text-[13px] mt-0 mb-6 leading-normal">
              Edit your current squad or wipe it and start fresh.
            </p>
            <button
              onClick={handleEdit}
              className="w-full py-3.5 px-4 mb-2.5 rounded-xl border border-white/12 bg-white/4 cursor-pointer text-left flex items-center gap-3.5 transition-colors hover:border-accent/35"
            >
              <div className="w-9.5 h-9.5 rounded-[10px] bg-accent/10 border border-accent/25 flex items-center justify-center shrink-0">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#00FF87"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </div>
              <div>
                <p className="text-white font-extrabold text-[13px] mt-0 mb-0.5 uppercase tracking-[0.06em]">
                  Edit Squad
                </p>
                <p className="text-white/70 text-[11px] m-0">
                  Swap or change players in your current squad
                </p>
              </div>
            </button>
            <button
              onClick={handleDeleteAndNew}
              className="w-full py-3.5 px-4 rounded-xl border border-white/12 bg-white/4 cursor-pointer text-left flex items-center gap-3.5 transition-colors hover:border-[#ef4444]/45"
            >
              <div className="w-9.5 h-9.5 rounded-[10px] bg-[#ef4444]/10 border border-[#ef4444]/25 flex items-center justify-center shrink-0">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#f87171"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                  <path d="M10 11v6M14 11v6" />
                  <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                </svg>
              </div>
              <div>
                <p className="text-[#f87171] font-extrabold text-[13px] mt-0 mb-0.5 uppercase tracking-[0.06em]">
                  Delete &amp; Select New
                </p>
                <p className="text-white/70 text-[11px] m-0">
                  Remove your squad and pick 5 new players
                </p>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
