"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, PhoneCall } from "lucide-react";
import { DURATION, EASE_OUT, staggerContainer } from "@/lib/motion";
import { HeroPanel } from "@/components/hero-panel";

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: DURATION.slow, ease: EASE_OUT } },
};

export function Hero() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section id="topo" className="relative overflow-hidden pt-36 pb-24 md:pt-44 md:pb-32">
      {/* Textura de fundo: grade sutil + glow suave da cor da marca, sem gradiente chapado */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(16,20,31,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(16,20,31,0.035)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_40%,transparent_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-40 -z-10 h-[32rem] w-[32rem] rounded-full bg-brand/[0.08] blur-3xl"
      />

      <div className="container-hbm grid grid-cols-1 items-center gap-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
        <motion.div
          initial={prefersReducedMotion ? undefined : "hidden"}
          animate={prefersReducedMotion ? undefined : "show"}
          variants={staggerContainer(0.12, 0.1)}
        >
          <motion.p
            variants={item}
            className="mb-6 inline-flex max-w-full items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-brand sm:text-xs sm:tracking-[0.14em]"
          >
            Desenvolvimento de sites para empresas
          </motion.p>

          <motion.h1
            variants={item}
            className="text-balance font-display text-[2.75rem] font-semibold leading-[1.05] tracking-tight text-ink sm:text-6xl lg:text-[3.6rem]"
          >
            O site da sua empresa devia estar{" "}
            <span className="text-brand">trazendo clientes</span> — não só existindo.
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-7 max-w-xl text-balance text-lg leading-relaxed text-ink-soft"
          >
            A HBM projeta e constrói sites profissionais que passam credibilidade,
            organizam sua presença digital e transformam visitantes em contato real.
            Design, tecnologia e estratégia a serviço do seu negócio.
          </motion.p>

          <motion.div variants={item} className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#contato"
              className="group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-brand"
            >
              Agendar uma conversa
              <ArrowRight
                size={16}
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </a>
            <a
              href="#processo"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-transparent px-6 py-3.5 text-sm font-medium text-ink transition-colors duration-200 hover:border-ink"
            >
              <PhoneCall size={16} className="text-ink-faint" />
              Ver como funciona
            </a>
          </motion.div>

          <motion.dl
            variants={item}
            className="mt-14 grid max-w-lg grid-cols-3 gap-6 border-t border-border pt-7"
          >
            {[
              ["Design", "+ tecnologia"],
              ["Processo", "estruturado"],
              ["Suporte", "direto, sem burocracia"],
            ].map(([title, desc]) => (
              <div key={title}>
                <dt className="font-display text-sm font-semibold text-ink">{title}</dt>
                <dd className="mt-1 text-xs leading-snug text-ink-faint">{desc}</dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        <HeroPanel />
      </div>
    </section>
  );
}
