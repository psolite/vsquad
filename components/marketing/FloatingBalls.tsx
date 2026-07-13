"use client";

import { motion } from "framer-motion";

function Ball({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className}>
      <circle cx="12" cy="12" r="11" fill="white" fillOpacity="0.92" stroke="black" strokeOpacity="0.18" strokeWidth="0.5" />
      <path
        d="M12 6.2l3.7 2.7-1.4 4.3h-4.6L8.3 8.9 12 6.2z"
        fill="black"
        fillOpacity="0.7"
      />
      <path
        d="M12 2.4v3.8M6.6 8.9L3.3 7.8M17.4 8.9l3.3-1.1M9.7 13.2l-2 3.6M14.3 13.2l2 3.6"
        stroke="black"
        strokeOpacity="0.35"
        strokeWidth="0.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

const balls = [
  { size: 26, top: "10%", left: "6%", duration: 24, delay: 0, path: [0, 60, -20, 30, 0], pathY: [0, -60, 40, -30, 0] },
  { size: 16, top: "72%", left: "90%", duration: 30, delay: 2, path: [0, -50, 30, -20, 0], pathY: [0, 40, -60, 20, 0] },
  { size: 20, top: "42%", left: "48%", duration: 34, delay: 4, path: [0, 30, -60, 40, 0], pathY: [0, -30, 20, -50, 0] },
  { size: 14, top: "88%", left: "18%", duration: 26, delay: 1, path: [0, 40, -30, 50, 0], pathY: [0, -20, -50, 10, 0] },
  { size: 22, top: "18%", left: "82%", duration: 28, delay: 3, path: [0, -40, 20, -30, 0], pathY: [0, 50, -20, 30, 0] },
];

export function FloatingBalls() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden opacity-20">
      {balls.map((ball, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ top: ball.top, left: ball.left, width: ball.size, height: ball.size }}
          animate={{ x: ball.path, y: ball.pathY, rotate: [0, 180, 360, 540, 720] }}
          transition={{ duration: ball.duration, delay: ball.delay, repeat: Infinity, ease: "easeInOut" }}
        >
          <Ball className="h-full w-full drop-shadow-[0_0_10px_rgba(0,255,135,0.3)]" />
        </motion.div>
      ))}
    </div>
  );
}
