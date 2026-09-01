"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, PhoneCall } from "lucide-react";
import { DURATION, EASE_OUT, staggerContainer } from "@/lib/motion";
import { HeroPanel } from "@/components/hero-panel";
import { HeadlineReveal } from "@/components/headline-reveal";

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: DURATION.slow, ease: EASE_OUT } },
};

const HEADLINE = [
  { text: "O" },
  { text: "site" },
  { text: "da" },
  { text: "sua" },
  { text: "empresa" },
  { text: "devia" },
  { text: "estar" },
  { text: "trazendo", accent: true },
  { text: "clientes.", accent: true },
];

export function Hero() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section id="topo" className="relative overflow-hidden pt-36 pb-28 md:pt-48 md:pb-40">
      {/* Textura de fundo: grade sutil com deriva lenta + dois glows da cor da marca para dar profundidade */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(16,20,31,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(16,20,31,0.04)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_75%_60%_at_50%_0%,#000_40%,transparent_100%)]"
        animate={prefersReducedMotion ? undefined : { backgroundPosition: ["0px 0px", "56px 56px"] }}
        transition={prefersReducedMotion ? undefined : { duration: 26, repeat: Infinity, ease: "linear" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-52 -top-52 -z-10 h-[36rem] w-[36rem] rounded-full bg-brand/[0.10] blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-56 -z-10 h-80 w-80 rounded-full bg-brand/[0.06] blur-3xl"
      />

      <div className="container-hbm grid grid-cols-1 items-center gap-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
        <motion.div
          initial={prefersReducedMotion ? undefined : "hidden"}
          animate={prefersReducedMotion ? undefined : "show"}
          variants={staggerContainer(0.12, 0.1)}
        >
          <motion.p
            variants={item}
            className="mb-7 inline-flex max-w-full items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-brand sm:text-xs sm:tracking-[0.14em]"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand/60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand" />
            </span>
            Desenvolvimento de sites para empresas
          </motion.p>

          <HeadlineReveal
            tokens={HEADLINE}
            className="text-balance font-display text-[3rem] font-semibold leading-[1.02] tracking-tight text-ink sm:text-6xl lg:text-[4rem] xl:text-[4.5rem]"
          />

          <motion.p
            variants={item}
            className="mt-8 max-w-xl text-balance text-lg leading-relaxed text-ink-soft"
          >
            A HBM projeta e constrói sites profissionais que passam credibilidade,
            organizam sua presença digital e transformam visitantes em contato real.
            Design, tecnologia e estratégia a serviço do seu negócio.
          </motion.p>

          <motion.div variants={item} className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#contato"
              className="group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand hover:shadow-[0_12px_28px_-10px_rgba(51,74,130,0.55)]"
            >
              Agendar uma conversa
              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </a>
            <a
              href="#processo"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-transparent px-6 py-3.5 text-sm font-medium text-ink transition-all duration-300 hover:-translate-y-0.5 hover:border-ink hover:shadow-[0_12px_28px_-14px_rgba(16,20,31,0.35)]"
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

      {/* Indicador de rolagem — presença sutil, some quando o usuário prefere menos movimento */}
      {!prefersReducedMotion && (
        <div className="pointer-events-none absolute inset-x-0 bottom-8 hidden justify-center md:flex">
          <div className="flex flex-col items-center gap-3 text-ink-faint">
            <span className="text-[10px] font-medium uppercase tracking-[0.2em]">Role para ver mais</span>
            <span className="relative h-9 w-px overflow-hidden bg-border">
              <motion.span
                className="absolute inset-x-0 top-0 h-3 bg-brand"
                animate={{ y: ["-100%", "150%"] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              />
            </span>
          </div>
        </div>
      )}
    </section>
  );
}
