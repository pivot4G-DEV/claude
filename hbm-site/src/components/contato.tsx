"use client";

import { motion, useReducedMotion } from "framer-motion";
import { MessageCircle, Mail } from "lucide-react";
import { DURATION, EASE_OUT } from "@/lib/motion";

// TODO(HBM): troque pelo WhatsApp e e-mail reais antes de publicar.
const WHATSAPP_URL = "https://wa.me/55SEUNUMEROAQUI?text=Ol%C3%A1%2C%20vim%20pelo%20site%20e%20quero%20conversar";
const EMAIL = "contato@hbm.com.br";

export function Contato() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section id="contato" className="relative overflow-hidden bg-dark py-28 md:py-40">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -z-0 h-[36rem] w-[60rem] -translate-x-1/2 rounded-full bg-brand/[0.14] blur-[110px]"
      />

      <div className="container-hbm relative flex flex-col items-center text-center">
        <motion.p
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 10 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: DURATION.slow, ease: EASE_OUT }}
          className="text-[15px] font-medium text-brand-on-dark"
        >
          Fale com a HBM
        </motion.p>

        <motion.h2
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 18, filter: "blur(10px)" }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.1 }}
          className="mt-4 max-w-3xl text-balance font-display text-[2.75rem] font-bold leading-[1.05] tracking-[-0.02em] text-dark-text sm:text-6xl"
        >
          Vamos construir o site que sua empresa merece.
        </motion.h2>

        <motion.p
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 10 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: DURATION.slow, ease: EASE_OUT, delay: 0.25 }}
          className="mt-6 max-w-lg text-balance text-lg leading-relaxed text-dark-muted"
        >
          Sem burocracia. Chame a gente e vamos entender o que sua empresa
          precisa.
        </motion.p>

        <motion.div
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 10 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: DURATION.slow, ease: EASE_OUT, delay: 0.4 }}
          className="mt-10 flex flex-col items-center gap-5 sm:flex-row sm:gap-8"
        >
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3.5 text-[15px] font-semibold text-white transition-[background-color,transform,opacity] duration-200 ease-out hover:bg-brand-hover active:scale-[0.97] active:opacity-80"
          >
            <MessageCircle size={17} />
            Chamar no WhatsApp
          </a>
          <a
            href={`mailto:${EMAIL}`}
            className="inline-flex items-center gap-2 text-[15px] font-medium text-dark-text/85 transition-colors duration-200 ease-out hover:text-dark-text"
          >
            <Mail size={16} />
            {EMAIL}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
