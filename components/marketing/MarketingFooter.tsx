import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export function MarketingFooter() {
  return (
    <footer className="relative px-6 pt-8 pb-10">
      <div className="mx-auto max-w-5xl">
        <Separator className="bg-white/10" />
        <div className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <Link href="/" className="flex items-center gap-1.5 text-sm font-black tracking-tight text-white select-none">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="" className="h-5 w-5 object-contain" />
            V<span className="text-accent">SQUAD</span>
          </Link>
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} VSquad.
          </p>
          <p className="text-xs font-bold tracking-widest text-white/40 uppercase">
            Powered by TXODDS
          </p>
        </div>
      </div>
    </footer>
  );
}
