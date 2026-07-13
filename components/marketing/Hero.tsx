"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlassPitch } from "@/components/marketing/GlassPitch";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-40 pb-24 md:pt-48 md:pb-32">
      <div className="pointer-events-none absolute top-0 left-1/2 h-175 w-175 -translate-x-1/2 -translate-y-1/3 rounded-full bg-[radial-gradient(ellipse,rgba(0,255,135,0.12)_0%,transparent_70%)] blur-[64px]" />

      <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-16 px-6 lg:grid-cols-[1.1fr_1fr] lg:gap-10">
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-accent">
              5-a-side Fantasy Football
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-6 text-[clamp(40px,6vw,64px)] leading-[1.02] font-black tracking-tight text-white"
          >
            Build your five.
            <br />
            <span className="text-accent [text-shadow:0_0_60px_rgba(0,255,135,0.4)]">
              Own the pitch.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 max-w-xl text-lg text-white/70"
          >
            Draft a 5-a-side squad from the world&apos;s best, go head-to-head in live
            tournaments, and climb the leaderboard as real match events unfold.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-9 flex flex-col items-center gap-3 sm:flex-row"
          >
            <Button
              render={<Link href="/home" />}
              size="lg"
              className="h-12 rounded-full px-8 text-base shadow-[0_0_40px_rgba(0,255,135,0.35)]"
            >
              Get Started
            </Button>
            <Button
              render={<a href="#how-it-works" />}
              variant="outline"
              size="lg"
              className="h-12 rounded-full border-white/15 bg-transparent px-8 text-base text-white hover:bg-white/5"
            >
              See how it works
            </Button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <GlassPitch />
        </motion.div>
      </div>
    </section>
  );
}
