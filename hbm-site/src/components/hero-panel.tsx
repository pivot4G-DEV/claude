"use client";

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import type { PointerEvent } from "react";
import { EASE_OUT } from "@/lib/motion";

/**
 * Composição gráfica do hero: uma representação abstrata de "um site bem
 * construído" (não uma captura de tela real — ainda não há cases). Reage
 * de leve ao mouse em telas grandes e flutua sutilmente; nada disso roda
 * quando o usuário prefere movimento reduzido.
 */
export function HeroPanel() {
  const prefersReducedMotion = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-40, 40], [4, -4]), {
    stiffness: 150,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(x, [-40, 40], [-4, 4]), {
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
      initial={prefersReducedMotion ? undefined : { opacity: 0, scale: 0.96, y: 16 }}
      animate={prefersReducedMotion ? undefined : { opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.25 }}
      className="relative mx-auto w-full max-w-md lg:mx-0 lg:max-w-none"
      style={{ perspective: 1200 }}
    >
      {/* Barra decorativa que quebra o retângulo do card — assimetria deliberada */}
      <div
        aria-hidden
        className="absolute -left-4 -top-4 h-24 w-24 rounded-2xl bg-brand/10 sm:-left-6 sm:-top-6 sm:h-32 sm:w-32"
      />

      <motion.div
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        animate={
          prefersReducedMotion
            ? undefined
            : { y: [0, -10, 0] }
        }
        transition={
          prefersReducedMotion
            ? undefined
            : { duration: 7, repeat: Infinity, ease: "easeInOut" }
        }
        className="relative rounded-2xl border border-border bg-paper p-2 shadow-[var(--shadow-lifted)]"
      >
        {/* Barra de topo estilo janela do navegador */}
        <div className="flex items-center gap-1.5 rounded-t-xl px-3 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-surface-2" />
          <span className="h-2.5 w-2.5 rounded-full bg-surface-2" />
          <span className="h-2.5 w-2.5 rounded-full bg-surface-2" />
        </div>

        <div className="space-y-5 rounded-xl bg-surface p-6">
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
              <div
                key={i}
                className="aspect-square rounded-lg border border-border bg-paper"
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Cartão flutuante de prova secundária, sobreposto ao card principal */}
      <motion.div
        initial={prefersReducedMotion ? undefined : { opacity: 0, x: -16, y: 16 }}
        animate={prefersReducedMotion ? undefined : { opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.6 }}
        className="absolute -bottom-6 -left-6 hidden items-center gap-3 rounded-xl border border-border bg-paper p-4 shadow-[var(--shadow-soft)] sm:flex"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-tint text-sm font-semibold text-brand">
          ↑
        </span>
        <div>
          <p className="font-display text-sm font-semibold text-ink">Mais contatos</p>
          <p className="text-xs text-ink-faint">um site pensado para converter</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
