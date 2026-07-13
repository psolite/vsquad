"use client";
import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Wallet, Pencil, Trash2, Trophy, Target } from "lucide-react";
import { useAccountId } from "@/lib/useAccountId";
import { useSquadStore, isComplete } from "@/store/squadStore";
import { useConnectModalStore } from "@/store/connectModalStore";
import type { SlotId } from "@/types";
import Pitch from "@/components/Pitch";
import FlagImg from "@/components/FlagImg";
import Spinner, { LoadingState } from "@/components/Spinner";
import { squadApi } from "@/lib/api/squadApi";
import { scoresApi } from "@/lib/api/scoresApi";
import { randomSquadName } from "@/lib/randomSquadName";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

const fadeUp = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
};

export default function MySquadPage() {
  const { id: accountId } = useAccountId();
  const router = useRouter();
  const openConnectModal = useConnectModalStore((s) => s.open);
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

  const pointsQuery = useQuery({
    queryKey: ["points", accountId, "today"],
    queryFn: () => scoresApi.points(accountId!, "today"),
    enabled: !!accountId,
    retry: false,
  });
  const todayPoints = pointsQuery.data ?? {};

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
    mutationFn: (opts: { locked: boolean; name?: string }) =>
      squadApi.save(accountId!, opts.name ?? squadName, squad, opts.locked),
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
  // If the user never typed a name, give them a random one rather than saving it blank.
  const autoSaveTriggered = useRef(false);
  useEffect(() => {
    if (!complete || !accountId || autoSaveTriggered.current) return;
    autoSaveTriggered.current = true;
    const name = squadName.trim() || randomSquadName();
    if (name !== squadName) setSquadName(name);
    saveMutation.mutate({ locked, name });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    const name = squadName.trim() || randomSquadName();
    if (name !== squadName) setSquadName(name);
    lockSquad();
    try {
      await saveMutation.mutateAsync({ locked: true, name });
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
  const players = (["gk", "def1", "def2", "fwd1", "fwd2"] as SlotId[])
    .map((id) => squad[id])
    .filter(Boolean) as NonNullable<(typeof squad)["gk"]>[];
  const totalGoals = players.reduce((s, p) => s + (p.goals ?? 0), 0);
  const totalCaps  = players.reduce((s, p) => s + (p.caps ?? 0), 0);
  const totalToday = players.reduce((s, p) => s + (todayPoints[p.id] ?? 0), 0);

  return (
    <div className="h-full overflow-y-auto bg-bg">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex items-center justify-between flex-wrap gap-2.5 py-3 px-6 border-b border-white/7 bg-white/2 sticky top-0 z-10 backdrop-blur-sm"
      >
        <div>
          <h2 className="text-white font-black text-[13px] uppercase tracking-[0.12em] m-0">
            My Squad
          </h2>
          <p className="text-white/70 text-[11px] mt-0.5 tracking-wider">
            5-a-Side Fantasy Football
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {saveError && <span className="text-[#f87171] text-[11px]">{saveError}</span>}
          {saving && (
            <span className="inline-flex items-center gap-1.25 text-white/70 text-[11px]">
              <Spinner size={11} />
              Saving…
            </span>
          )}
          {saved && !saving && !saveError && <span className="text-accent/60 text-[11px]">Saved</span>}

          <div className="flex items-center gap-1.75">
            <div
              className={`w-1.75 h-1.75 rounded-full ${
                locked ? "bg-accent shadow-[0_0_6px_#00FF87]" : "bg-[#facc15] shadow-[0_0_6px_#facc15]"
              }`}
            />
            <span className={`text-[11px] font-black uppercase tracking-widest ${locked ? "text-accent" : "text-[#facc15]"}`}>
              {locked ? "Locked" : "Draft"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 rounded-lg border-white/15 bg-transparent text-white/70 hover:bg-white/5 hover:text-white"
              onClick={() => setShowPickModal(true)}
            >
              <Pencil className="size-3.5" />
              {locked ? "Pick New" : "Change"}
            </Button>
            {!locked && (
              accountId ? (
                <Button size="sm" className="rounded-lg" onClick={handleLock} disabled={saving}>
                  {saving ? "Saving…" : "Lock In"}
                </Button>
              ) : (
                <Button size="sm" className="gap-1.5 rounded-lg" onClick={openConnectModal}>
                  <Wallet className="size-3.5" />
                  Connect to Lock In
                </Button>
              )
            )}
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-[1.2fr_1fr] max-[900px]:grid-cols-1 gap-4.5 p-6">

        <motion.div
          {...fadeUp}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="bg-white/2 border border-white/7 rounded-2xl p-5.5"
        >
          <div className="mb-4">
            {!locked ? (
              <input
                type="text"
                placeholder="My Dream Squad..."
                value={squadName}
                onChange={(e) => setSquadName(e.target.value)}
                maxLength={30}
                className="w-full box-border bg-white/5 border border-white/10 rounded-[10px] py-2.5 px-3.5 text-white text-[17px] font-black outline-none focus:border-accent/40"
              />
            ) : (
              <p className="text-accent text-xl font-black uppercase tracking-[0.06em] m-0">
                {squadName || "Unnamed Squad"}
              </p>
            )}
          </div>

          <div className="mb-3 flex items-center justify-between">
            <p className="text-white/70 text-[9.5px] font-extrabold uppercase tracking-[0.2em]">Starting Five</p>
            <span className="bg-accent/10 border border-accent/20 text-accent text-[10px] font-extrabold py-1 px-2.5 rounded-full uppercase tracking-widest">1-2-2</span>
          </div>

          <div className="relative rounded-2xl border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.05)_0%,transparent_60%)] p-2.5">
            <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(ellipse_at_top,rgba(0,255,135,0.1)_0%,transparent_70%)]" />
            <div className="relative h-100 max-[640px]:h-80 rounded-xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
              <Pitch squad={squad} selectedSlot={null} onSlotClick={noop} points={accountId ? todayPoints : undefined} readOnly />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="flex flex-col items-center gap-1 py-3 rounded-[10px] bg-accent/5 border border-accent/15">
              <span className="text-accent text-xl font-black leading-none">{accountId ? totalToday : "—"}</span>
              <span className="text-accent/70 text-[9.5px] font-extrabold uppercase tracking-widest">Today</span>
            </div>
            <div className="flex flex-col items-center gap-1 py-3 rounded-[10px] bg-white/4 border border-white/8">
              <span className="text-white text-xl font-black leading-none">{totalGoals}</span>
              <span className="text-white/70 text-[9.5px] font-extrabold uppercase tracking-widest">Goals</span>
            </div>
            <div className="flex flex-col items-center gap-1 py-3 rounded-[10px] bg-white/4 border border-white/8">
              <span className="text-white text-xl font-black leading-none">{totalCaps}</span>
              <span className="text-white/70 text-[9.5px] font-extrabold uppercase tracking-widest">Caps</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          {...fadeUp}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex flex-col gap-4.5"
        >
          <div className="bg-white/2 border border-white/7 rounded-2xl p-5.5">
            <p className="text-white/70 text-[9.5px] font-extrabold uppercase tracking-[0.2em] mb-3.5">Players</p>
            <div className="flex flex-col gap-1.5">
              {players.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.15 + i * 0.05 }}
                  className="flex items-center gap-3 bg-white/4 border border-white/7 rounded-xl py-2.5 px-3.5"
                >
                  <FlagImg country={p.country} size={24} shape="rect" />
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-bold text-[13px] m-0 whitespace-nowrap overflow-hidden text-ellipsis">
                      {p.name}
                    </p>
                    <p className="text-white/70 text-[11px] mt-0.5">{p.country}</p>
                  </div>
                  {accountId && (todayPoints[p.id] ?? 0) > 0 && (
                    <span className="text-accent text-xs font-black shrink-0">+{todayPoints[p.id]}</span>
                  )}
                  <div className="flex flex-col items-end gap-0.75 shrink-0">
                    <span
                      className="py-0.5 px-2 rounded-[5px] text-[10px] font-black tracking-[0.06em] uppercase"
                      style={{ background: posBg[p.position], color: posColor[p.position] }}
                    >
                      {p.position}
                    </span>
                    <span className="text-white/70 text-[10px]">{p.goals}G · {p.caps} caps</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2.5 bg-white/4 border border-white/8 rounded-xl p-3.5">
              <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                <Target size={15} className="text-accent" />
              </div>
              <div>
                <div className="text-white text-lg font-black leading-none">{totalGoals}</div>
                <div className="text-white/70 text-[9.5px] uppercase tracking-widest mt-0.5">Total Goals</div>
              </div>
            </div>
            <div className="flex items-center gap-2.5 bg-white/4 border border-white/8 rounded-xl p-3.5">
              <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                <Trophy size={15} className="text-accent" />
              </div>
              <div>
                <div className="text-white text-lg font-black leading-none">{totalCaps}</div>
                <div className="text-white/70 text-[9.5px] uppercase tracking-widest mt-0.5">Total Caps</div>
              </div>
            </div>
          </div>

          {!locked && !accountId && (
            <div className="rounded-[10px] border border-accent/20 bg-accent/5 p-4 flex items-center justify-between gap-3 flex-wrap">
              <p className="text-accent text-xs font-bold">
                Connect to save and lock in this squad.
              </p>
              <Button size="sm" className="gap-1.5 rounded-lg shrink-0" onClick={openConnectModal}>
                <Wallet className="size-3.5" />
                Connect
              </Button>
            </div>
          )}
        </motion.div>
      </div>

      <Dialog open={showPickModal} onOpenChange={setShowPickModal}>
        <DialogContent className="border border-white/10 p-6 sm:max-w-95">
          <DialogHeader>
            <DialogTitle className="text-base font-black uppercase tracking-[0.08em] text-white">
              What would you like to do?
            </DialogTitle>
            <DialogDescription>Edit your current squad or wipe it and start fresh.</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-2.5 pt-1">
            <button
              onClick={handleEdit}
              className="w-full py-3.5 px-4 rounded-xl border border-white/12 bg-white/4 cursor-pointer text-left flex items-center gap-3.5 transition-colors hover:border-accent/35"
            >
              <div className="w-9.5 h-9.5 rounded-[10px] bg-accent/10 border border-accent/25 flex items-center justify-center shrink-0">
                <Pencil size={16} className="text-accent" />
              </div>
              <div>
                <p className="text-white font-extrabold text-[13px] mt-0 mb-0.5 uppercase tracking-[0.06em]">
                  Edit Squad
                </p>
                <p className="text-white/70 text-[11px] m-0">Swap or change players in your current squad</p>
              </div>
            </button>
            <button
              onClick={handleDeleteAndNew}
              className="w-full py-3.5 px-4 rounded-xl border border-white/12 bg-white/4 cursor-pointer text-left flex items-center gap-3.5 transition-colors hover:border-[#ef4444]/45"
            >
              <div className="w-9.5 h-9.5 rounded-[10px] bg-[#ef4444]/10 border border-[#ef4444]/25 flex items-center justify-center shrink-0">
                <Trash2 size={16} className="text-[#f87171]" />
              </div>
              <div>
                <p className="text-[#f87171] font-extrabold text-[13px] mt-0 mb-0.5 uppercase tracking-[0.06em]">
                  Delete &amp; Select New
                </p>
                <p className="text-white/70 text-[11px] m-0">Remove your squad and pick 5 new players</p>
              </div>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
