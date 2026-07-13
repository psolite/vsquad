"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Wallet, ListChecks, Swords, Crown } from "lucide-react";

const steps = [
  {
    icon: Wallet,
    title: "Connect",
    description: "Sign in with your wallet or Google in seconds — no downloads required.",
  },
  {
    icon: ListChecks,
    title: "Draft",
    description: "Build your 5-a-side squad from the tournament's full player pool within the cap.",
  },
  {
    icon: Swords,
    title: "Compete",
    description: "Join a tournament and go head-to-head against squads from around the world.",
  },
  {
    icon: Crown,
    title: "Win",
    description: "Score with real match events as they happen and climb the leaderboard for prizes.",
  },
];

export function HowItWorks() {
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start 0.8", "end 0.55"],
  });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="how-it-works" className="relative px-6 py-24 md:py-32">
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-xl text-center"
        >
          <h2 className="text-[clamp(28px,4vw,40px)] font-black tracking-tight text-white">
            How it works
          </h2>
          <p className="mt-3 text-white/60">
            From sign-up to the leaderboard in four steps.
          </p>
        </motion.div>

        <div ref={trackRef} className="relative mx-auto mt-16 max-w-lg">
          <div className="absolute top-2 bottom-2 left-8 w-px bg-white/10" />
          <motion.div
            style={{ height: lineHeight }}
            className="absolute top-2 left-8 w-px bg-accent shadow-[0_0_12px_rgba(0,255,135,0.6)]"
          />

          <div className="flex flex-col gap-12">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative flex items-start gap-6"
              >
                <div className="relative z-10 flex size-16 shrink-0 items-center justify-center rounded-full border border-accent/30 bg-[#04140f] text-accent shadow-[0_0_24px_rgba(0,255,135,0.25)]">
                  <step.icon className="size-6" />
                  <span className="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-accent text-[10px] font-black text-[#04140f]">
                    {i + 1}
                  </span>
                </div>
                <div className="pt-3 text-left">
                  <h3 className="text-base font-bold text-white">{step.title}</h3>
                  <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-white/60">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
