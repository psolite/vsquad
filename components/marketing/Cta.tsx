"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { GlassPanel } from "@/components/marketing/GlassPanel";

export function Cta() {
  return (
    <section className="relative px-6 py-24 md:py-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-3xl"
      >
        <GlassPanel className="overflow-hidden px-8 py-14 text-center sm:px-16">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,255,135,0.12)_0%,transparent_70%)]" />
          <div className="relative z-10">
            <h2 className="text-[clamp(26px,4vw,38px)] font-black tracking-tight text-white">
              Ready to build your five?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-white/60">
              Draft your squad in minutes and join the next tournament before kickoff.
            </p>
            <Button
              render={<Link href="/home" />}
              size="lg"
              className="mt-8 h-12 rounded-full px-8 text-base shadow-[0_0_40px_rgba(0,255,135,0.35)]"
            >
              Get Started
            </Button>
          </div>
        </GlassPanel>
      </motion.div>
    </section>
  );
}
