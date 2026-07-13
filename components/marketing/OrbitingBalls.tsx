"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Ball } from "@/components/marketing/Ball";

const TRACK_HEIGHT = 26;
const BALL_COUNT = 8;

interface Runner {
  id: number;
  size: number;
  duration: number;
  delay: number;
  top: number;
}

export function OrbitingBalls() {
  const runners = useMemo<Runner[]>(
    () =>
      Array.from({ length: BALL_COUNT }, (_, i) => {
        const size = 12 + Math.random() * 10; // 12px – 22px
        return {
          id: i,
          size,
          duration: 18 + Math.random() * 14, // each ball crosses the screen at its own speed
          delay: -Math.random() * 30, // random starting point along the loop
          top: Math.random() * (TRACK_HEIGHT - size), // always fully inside the track
        };
      }),
    []
  );

  return (
    <div
      className="relative left-1/2 right-1/2 mb-4 ml-[-50vw] mr-[-50vw] w-screen overflow-hidden"
      style={{ height: TRACK_HEIGHT }}
    >
      {runners.map((r) => (
        <motion.div
          key={r.id}
          className="absolute"
          style={{ top: r.top, width: r.size, height: r.size }}
          animate={{ left: ["-5%", "105%"] }}
          transition={{ duration: r.duration, repeat: Infinity, ease: "linear", delay: r.delay }}
        >
          <div className="h-full w-full rounded-full shadow-[0_0_10px_3px_rgba(0,255,135,0.45)]">
            <Ball className="h-full w-full" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
