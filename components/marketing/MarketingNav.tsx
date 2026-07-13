import Link from "next/link";
import { Button } from "@/components/ui/button";

const links = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#faq", label: "FAQ" },
];

export function MarketingNav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
      <nav className="flex w-full max-w-5xl items-center justify-between rounded-2xl border border-white/10 bg-white/4 px-5 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
        <Link href="/" className="flex items-center gap-2 select-none">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="" className="h-7 w-7 object-contain" />
          <span className="text-lg font-black tracking-tight text-white">
            V<span className="text-accent [text-shadow:0_0_24px_rgba(0,255,135,0.5)]">SQUAD</span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-white/70 transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </div>

        <Button render={<Link href="/home" />} size="sm" className="rounded-full px-4">
          Get Started
        </Button>
      </nav>
    </header>
  );
}
