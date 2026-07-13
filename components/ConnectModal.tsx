"use client";

import { useEffect, useRef } from "react";
import { Wallet } from "lucide-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useAccountId } from "@/lib/useAccountId";
import { useConnectModalStore } from "@/store/connectModalStore";
import GoogleLoginButton from "@/components/GoogleLoginButton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function ConnectModal() {
  const isOpen = useConnectModalStore((s) => s.isOpen);
  const close = useConnectModalStore((s) => s.close);
  const { setVisible: setWalletModalVisible } = useWalletModal();
  const { id: accountId } = useAccountId();
  const wasOpen = useRef(false);

  // Dismiss automatically the moment the user actually becomes signed in,
  // however that happened — connecting a wallet or finishing Google sign-in.
  useEffect(() => {
    if (isOpen) wasOpen.current = true;
    if (wasOpen.current && accountId && isOpen) {
      wasOpen.current = false;
      close();
    }
  }, [accountId, isOpen, close]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && close()}>
      <DialogContent className="border border-white/10 p-6 sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-lg font-black text-white">Connect to VSquad</DialogTitle>
          <DialogDescription className="text-white/60">
            Connect a wallet or sign in with Google to save and lock in your squad.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-stretch gap-4 pt-1">
          <Button
            size="lg"
            className="h-11 gap-2 rounded-xl text-sm"
            onClick={() => {
              close();
              setWalletModalVisible(true);
            }}
          >
            <Wallet className="size-4" />
            Connect Wallet
          </Button>

          <div className="flex items-center gap-2.5">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">or</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <div className="flex justify-center [&>button]:w-full [&>button]:justify-center">
            <GoogleLoginButton />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
