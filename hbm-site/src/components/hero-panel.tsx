"use client";

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import type { PointerEvent } from "react";
import { EASE_OUT, SPRING } from "@/lib/motion";

/**
 * Visual do hero: uma representação abstrata de "um site bem construído"
 * (não uma captura real — ainda não há cases). Um único elemento, sem
 * badges extras, sem cor decorativa — só o cartão, com uma resposta
 * física e discreta ao mouse.
 */
export function HeroPanel() {
  const prefersReducedMotion = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-60, 60], [3.5, -3.5]), SPRING);
  const rotateY = useSpring(useTransform(x, [-60, 60], [-3.5, 3.5]), SPRING);

  function handlePointerMove(e: PointerEvent<HTMLDivElement>) {
    if (prefersReducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  }

  function handlePointerLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 28 }}
      animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.85 }}
      className="relative mt-16 w-full max-w-5xl md:mt-20"
      style={{ perspective: 1600 }}
    >
      <motion.div
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative overflow-hidden rounded-[28px] border border-black/[0.06] bg-paper shadow-[0_24px_70px_-20px_rgba(16,20,31,0.22)]"
      >
        {/* Brilho especular que varre o card uma vez na entrada */}
        {!prefersReducedMotion && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-transparent via-white/70 to-transparent"
            style={{ mixBlendMode: "overlay" }}
            initial={{ x: "-120%" }}
            animate={{ x: "160%" }}
            transition={{ duration: 1.3, ease: EASE_OUT, delay: 1.4 }}
          />
        )}

        {/* Barra de topo estilo janela do navegador */}
        <div className="flex items-center gap-1.5 border-b border-black/[0.05] px-5 py-4">
          <span className="h-2.5 w-2.5 rounded-full bg-black/[0.08]" />
          <span className="h-2.5 w-2.5 rounded-full bg-black/[0.08]" />
          <span className="h-2.5 w-2.5 rounded-full bg-black/[0.08]" />
        </div>

        <div className="space-y-6 bg-surface p-8 md:p-10">
          <div className="flex items-center justify-between">
            <div className="h-2.5 w-28 rounded-full bg-ink/15" />
            <div className="flex gap-2">
              <div className="h-2.5 w-10 rounded-full bg-ink/10" />
              <div className="h-2.5 w-10 rounded-full bg-ink/10" />
            </div>
          </div>

          <div className="space-y-3 pt-6">
            <div className="h-5 w-3/5 rounded-full bg-ink/20" />
            <div className="h-5 w-2/5 rounded-full bg-ink/20" />
          </div>
          <div className="h-2.5 w-4/5 rounded-full bg-ink/[0.08]" />

          <div className="h-10 w-44 rounded-full bg-brand" />

          <div className="grid grid-cols-3 gap-4 pt-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="aspect-[4/3] rounded-2xl border border-black/[0.05] bg-paper" />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Único cartão flutuante — prova secundária, monocromático */}
      <motion.div
        initial={prefersReducedMotion ? undefined : { opacity: 0, y: 12 }}
        animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE_OUT, delay: 1.15 }}
        className="absolute -bottom-6 left-8 hidden items-center gap-3 rounded-2xl border border-black/[0.06] bg-paper/90 p-4 shadow-[0_12px_32px_-12px_rgba(16,20,31,0.2)] backdrop-blur-md sm:flex"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-xs font-semibold text-white">
          ✓
        </span>
        <div>
          <p className="font-display text-sm font-semibold text-ink">Feito sob medida</p>
          <p className="text-xs text-ink-faint">um site pensado para converter</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
