"use client";

import { motion, useReducedMotion } from "framer-motion";
import { EASE_OUT } from "@/lib/motion";

type Token = { text: string; accent?: boolean };

/**
 * Título de entrada contido: um único bloco que assenta com blur→nítido
 * e leve subida — sem cascata palavra a palavra. É o padrão de restrição
 * do design Apple: um efeito por vez, e que assenta rápido.
 */
export function HeadlineReveal({
  tokens,
  className,
  delay = 0.15,
}: {
  tokens: Token[];
  className?: string;
  delay?: number;
}) {
  const prefersReducedMotion = useReducedMotion();

  const content = tokens.map((t, i) => (
    <span key={i} className={t.accent ? "text-brand" : undefined}>
      {t.text}
      {i < tokens.length - 1 ? " " : ""}
    </span>
  ));

  if (prefersReducedMotion) {
    return <h1 className={className}>{content}</h1>;
  }

  return (
    <motion.h1
      className={className}
      initial={{ opacity: 0, y: 18, filter: "blur(14px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.9, ease: EASE_OUT, delay }}
    >
      {content}
    </motion.h1>
  );
}
