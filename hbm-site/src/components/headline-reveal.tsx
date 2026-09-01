"use client";

import { motion, useReducedMotion } from "framer-motion";
import { EASE_OUT } from "@/lib/motion";

type Token = { text: string; accent?: boolean };

const WORD_DELAY = 0.05;
const BASE_DELAY = 0.35;

/**
 * Título de entrada em "cortina": cada palavra sobe para dentro do
 * lugar, escondida atrás de uma máscara (overflow-hidden), em vez de
 * simplesmente aparecer. É o mesmo efeito usado em sites premium de
 * agência/produto para dar peso ao primeiro impacto.
 */
export function HeadlineReveal({ tokens, className }: { tokens: Token[]; className?: string }) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return (
      <h1 className={className}>
        {tokens.map((t, i) => (
          <span key={i} className={t.accent ? "text-brand" : undefined}>
            {t.text}{" "}
          </span>
        ))}
      </h1>
    );
  }

  return (
    <h1 className={className}>
      {tokens.map((t, i) => (
        <span key={i} className="inline-block overflow-hidden pb-1 align-bottom">
          <motion.span
            className={`inline-block ${t.accent ? "text-brand" : ""}`}
            initial={{ y: "110%" }}
            animate={{ y: "0%" }}
            transition={{
              duration: 0.85,
              ease: EASE_OUT,
              delay: BASE_DELAY + i * WORD_DELAY,
            }}
          >
            {t.text}
            {i < tokens.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </h1>
  );
}
