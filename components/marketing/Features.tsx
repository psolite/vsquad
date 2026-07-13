"use client";

import { motion } from "framer-motion";
import { Users, Zap, Trophy, ShieldCheck } from "lucide-react";
import { GlassPanel } from "@/components/marketing/GlassPanel";
import { OrbitingBalls } from "@/components/marketing/OrbitingBalls";

const features = [
  {
    icon: Users,
    title: "Draft your five",
    description:
      "Pick a goalkeeper, two defenders and two forwards from the tournament's full player pool within a fixed salary cap.",
  },
  {
    icon: Zap,
    title: "Live scoring",
    description:
      "Every goal, save and card updates your squad's score the moment it happens on the pitch.",
  },
  {
    icon: Trophy,
    title: "Tournaments & leagues",
    description:
      "Climb the global leaderboard or create a private league and go head-to-head with friends.",
  },
  {
    icon: ShieldCheck,
    title: "Provably yours",
    description:
      "Your squad is secured on-chain, so no one can quietly edit the record after the whistle blows.",
  },
];

export function Features() {
  return (
    <section id="features" className="relative px-6 py-24 md:py-32">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-xl text-center"
        >
          <OrbitingBalls />
          <h2 className="text-[clamp(28px,4vw,40px)] font-black tracking-tight text-white">
            Everything you need to compete
          </h2>
          <p className="mt-3 text-white/60">
            A fantasy game built for the pace of 5-a-side football.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <GlassPanel className="h-full p-6 transition-colors hover:border-accent/30 hover:bg-white/6">
                <div className="flex size-11 items-center justify-center rounded-xl border border-accent/20 bg-accent/10 text-accent">
                  <feature.icon className="size-5" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-white">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">
                  {feature.description}
                </p>
              </GlassPanel>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
