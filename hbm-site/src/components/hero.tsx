"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { DURATION, EASE_OUT } from "@/lib/motion";
import { HeroPanel } from "@/components/hero-panel";
import { HeadlineReveal } from "@/components/headline-reveal";

const HEADLINE = [
  { text: "O site da sua empresa" },
  { text: "devia estar" },
  { text: "trazendo clientes.", accent: true },
];

export function Hero() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section id="topo" className="relative overflow-hidden pt-44 pb-8 md:pt-56">
      {/* Glow ambiente, centrado atrás do título — deriva bem devagar, quase parada */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-24 -z-10 h-[36rem] w-[60rem] -translate-x-1/2 rounded-full bg-brand/[0.07] blur-[100px]"
        animate={
          prefersReducedMotion
            ? undefined
            : { x: ["-1%", "1.5%", "-1%"], scale: [1, 1.06, 1] }
        }
        transition={
          prefersReducedMotion ? undefined : { duration: 22, repeat: Infinity, ease: "easeInOut" }
        }
      />

      <div className="container-hbm flex flex-col items-center text-center">
        <motion.p
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 10 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: DURATION.slow, ease: EASE_OUT }}
          className="text-[15px] font-medium text-brand"
        >
          Desenvolvimento de sites para empresas
        </motion.p>

        <HeadlineReveal
          tokens={HEADLINE}
          className="mt-4 max-w-4xl text-balance font-display text-[2.75rem] font-bold leading-[1.05] tracking-[-0.02em] text-ink sm:text-6xl lg:text-[4.75rem]"
        />

        <motion.p
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 10 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: DURATION.slow, ease: EASE_OUT, delay: 0.55 }}
          className="mt-6 max-w-xl text-balance text-[1.2rem] leading-relaxed text-ink-soft"
        >
          Sites profissionais que passam credibilidade, organizam sua presença
          digital e transformam visitantes em contato real.
        </motion.p>

        <motion.div
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 10 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: DURATION.slow, ease: EASE_OUT, delay: 0.7 }}
          className="mt-9 flex flex-col items-center gap-5 sm:flex-row sm:gap-8"
        >
          <a
            href="#contato"
            className="inline-flex items-center justify-center rounded-full bg-brand px-7 py-3.5 text-[15px] font-semibold text-white transition-[background-color,transform,opacity] duration-200 ease-out hover:bg-brand-hover active:scale-[0.97] active:opacity-80"
          >
            Agendar uma conversa
          </a>
          <a
            href="#processo"
            className="group inline-flex items-center gap-0.5 text-[15px] font-medium text-brand"
          >
            Ver como funciona
            <ChevronRight
              size={16}
              className="transition-transform duration-200 ease-out group-hover:translate-x-0.5"
            />
          </a>
        </motion.div>

        <HeroPanel />
      </div>
    </section>
  );
}
