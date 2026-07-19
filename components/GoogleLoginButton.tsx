"use client";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { usePrivy } from "@privy-io/react-auth";
import { useWallets as useSolanaStandardWallets } from "@privy-io/react-auth/solana";
import { useWallet } from "@solana/wallet-adapter-react";
import Spinner from "@/components/Spinner";

async function post(path: string, body?: unknown) {
  const res = await fetch(path, {
    method: "POST",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error((data as { error?: string }).error ?? `HTTP ${res.status}`);
  }
  return res.json();
}

export default function GoogleLoginButton() {
  const { ready, authenticated, user, login } = usePrivy();
  const { publicKey, connected } = useWallet();
  const { wallets: privySolanaWallets } = useSolanaStandardWallets();
  const synced = useRef<string | null>(null);
  const linkedAddress = useRef<string | null>(null);

  const syncMutation = useMutation({
    mutationFn: () => post("/api/auth/sync"),
    // No redirect here — the app shell hydrates whatever squad is saved
    // server-side as soon as an account id exists, wherever the user happens
    // to be when they connect, so there's nothing to navigate them to.
    onError: (err) => {
      console.error("[auth] failed to sync Privy user", err);
      toast.error("Could not complete sign-in. Please try again.");
    },
  });

  const linkWalletMutation = useMutation({
    mutationFn: (walletAddress: string) =>
      post("/api/auth/link-wallet", { walletAddress }),
    onError: (err) => {
      console.error("[auth] failed to link wallet", err);
      toast.error(
        err instanceof Error
          ? err.message
          : "Could not link your wallet to this account",
      );
    },
  });

  useEffect(() => {
    if (!authenticated || !user) return;
    if (synced.current === user.id) return;
    synced.current = user.id;
    syncMutation.mutate();
    // syncMutation is a new object every render; only re-run when the authenticated user changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated, user]);

  useEffect(() => {
    if (!authenticated || !connected || !publicKey) return;
    linkWalletMutation.mutate(publicKey.toBase58());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated, connected, publicKey]);

  // Same link-and-migrate step, but for the Privy embedded Solana wallet
  // (auto-provisioned for Google-only sign-ins) rather than an external one —
  // this is what actually carries a Google-only user's squad/points/tournament
  // history over to their new real wallet address (lib/db.ts migrateAccountId).
  useEffect(() => {
    // Skip while an external wallet is connected — that one takes priority
    // (useAccountId prefers it too) and already linked itself above; don't
    // fight over `users.wallet_address` with a second, different address.
    if (connected) return;
    const address = privySolanaWallets[0]?.address;
    if (!authenticated || !address || linkedAddress.current === address) return;
    linkedAddress.current = address;
    linkWalletMutation.mutate(address);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated, connected, privySolanaWallets]);

  if (!ready) return null;

  if (authenticated) {
    return (
      <div className="inline-flex items-center justify-center gap-2 text-white/70 text-xs font-bold">
        <Spinner size={14} />
        Signing in…
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => login()}
      className="inline-flex items-center justify-center gap-2.25 bg-white text-black font-bold text-[13px] rounded-[10px] py-2.25 px-4.5 border border-black/15 cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.15)]"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/Google.jpg"
        alt=""
        width={20}
        height={20}
        className="rounded-[3px] block shrink-0"
      />
      Connect with Google
    </button>
  );
}
