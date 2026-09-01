"use client";

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import type { PointerEvent } from "react";
import { EASE_OUT } from "@/lib/motion";

/**
 * Composição gráfica do hero: uma representação abstrata de "um site bem
 * construído" (não uma captura de tela real — ainda não há cases). Reage
 * de leve ao mouse em telas grandes, flutua sutilmente e ganha um brilho
 * de entrada; nada disso roda quando o usuário prefere movimento reduzido.
 */
export function HeroPanel() {
  const prefersReducedMotion = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-40, 40], [5, -5]), {
    stiffness: 150,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(x, [-40, 40], [-5, 5]), {
    stiffness: 150,
    damping: 20,
  });

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
      initial={prefersReducedMotion ? undefined : { opacity: 0, scale: 0.94, y: 20 }}
      animate={prefersReducedMotion ? undefined : { opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.35 }}
      className="relative mx-auto w-full max-w-md lg:mx-0 lg:max-w-none lg:rotate-[-1.25deg]"
      style={{ perspective: 1400 }}
    >
      {/* Barra decorativa que quebra o retângulo do card — assimetria deliberada */}
      <div
        aria-hidden
        className="absolute -left-5 -top-5 h-28 w-28 rounded-2xl bg-brand/[0.12] sm:-left-7 sm:-top-7 sm:h-36 sm:w-36"
      />

      <motion.div
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        animate={prefersReducedMotion ? undefined : { y: [0, -12, 0] }}
        transition={prefersReducedMotion ? undefined : { duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand/25 via-border to-border p-px shadow-[var(--shadow-lifted)]"
      >
        <div className="relative overflow-hidden rounded-[calc(1rem+1px)] bg-paper">
          {/* Brilho que varre o card uma vez na entrada */}
          {!prefersReducedMotion && (
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-transparent via-white/60 to-transparent"
              style={{ mixBlendMode: "overlay" }}
              initial={{ x: "-120%" }}
              animate={{ x: "160%" }}
              transition={{ duration: 1.4, ease: EASE_OUT, delay: 1.1 }}
            />
          )}

          {/* Barra de topo estilo janela do navegador */}
          <div className="flex items-center gap-1.5 border-b border-border/70 px-4 py-3.5">
            <span className="h-2.5 w-2.5 rounded-full bg-surface-2" />
            <span className="h-2.5 w-2.5 rounded-full bg-surface-2" />
            <span className="h-2.5 w-2.5 rounded-full bg-surface-2" />
          </div>

          <div className="space-y-5 bg-surface p-6">
            <div className="flex items-center justify-between">
              <div className="h-2.5 w-24 rounded-full bg-ink/15" />
              <div className="flex gap-2">
                <div className="h-2.5 w-10 rounded-full bg-ink/10" />
                <div className="h-2.5 w-10 rounded-full bg-ink/10" />
              </div>
            </div>

            <div className="space-y-2.5 pt-4">
              <div className="h-4 w-4/5 rounded-full bg-ink/20" />
              <div className="h-4 w-3/5 rounded-full bg-ink/20" />
            </div>
            <div className="h-2.5 w-full rounded-full bg-ink/[0.08]" />
            <div className="h-2.5 w-5/6 rounded-full bg-ink/[0.08]" />

            <div className="h-9 w-40 rounded-full bg-brand" />

            <div className="grid grid-cols-3 gap-3 pt-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="aspect-square rounded-lg border border-border bg-paper" />
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Cartão flutuante de prova secundária, sobreposto ao card principal */}
      <motion.div
        initial={prefersReducedMotion ? undefined : { opacity: 0, x: -16, y: 16 }}
        animate={prefersReducedMotion ? undefined : { opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.75 }}
        className="absolute -bottom-7 -left-7 hidden items-center gap-3 rounded-xl border border-border bg-paper p-4 shadow-[var(--shadow-soft)] sm:flex"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-tint text-sm font-semibold text-brand">
          ↑
        </span>
        <div>
          <p className="font-display text-sm font-semibold text-ink">Mais contatos</p>
          <p className="text-xs text-ink-faint">um site pensado para converter</p>
        </div>
      </motion.div>

      {/* Segundo cartão flutuante, no canto oposto — reforça a assimetria da composição */}
      <motion.div
        initial={prefersReducedMotion ? undefined : { opacity: 0, x: 16, y: -16 }}
        animate={prefersReducedMotion ? undefined : { opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.95 }}
        className="absolute -right-4 -top-6 hidden items-center gap-2 rounded-full border border-border bg-paper py-2 pl-2 pr-4 shadow-[var(--shadow-soft)] sm:flex"
      >
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink text-[11px] font-semibold text-white">
          ✓
        </span>
        <p className="text-xs font-medium text-ink">Feito sob medida</p>
      </motion.div>
    </motion.div>
  );
}
