"use client";

import { motion } from "framer-motion";

const formation = [
  { label: "GK", top: "82%", left: "50%", color: "#facc15", delay: 0 },
  { label: "DEF", top: "58%", left: "26%", color: "#60a5fa", delay: 0.15 },
  { label: "DEF", top: "58%", left: "74%", color: "#60a5fa", delay: 0.3 },
  { label: "FWD", top: "24%", left: "34%", color: "#f87171", delay: 0.45 },
  { label: "FWD", top: "24%", left: "66%", color: "#f87171", delay: 0.6 },
];

export function GlassPitch() {
  return (
    <div className="relative mx-auto aspect-4/3 w-full max-w-md rounded-3xl border border-white/10 bg-white/4 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
      <div className="absolute inset-4 rounded-2xl border border-accent/20" />
      <div className="absolute top-1/2 left-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/20" />
      <div className="absolute top-1/2 left-4 right-4 h-px bg-accent/15" />

      {formation.map((player, i) => (
        <motion.div
          key={i}
          className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1"
          style={{ top: player.top, left: player.left }}
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: player.delay }}
        >
          <span
            className="block size-3.5 rounded-full shadow-[0_0_16px_var(--glow)]"
            style={{ background: player.color, ["--glow" as string]: player.color }}
          />
          <span className="text-[9px] font-bold tracking-widest text-white/50 uppercase">
            {player.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
