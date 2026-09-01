"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { fadeUp, viewport } from "@/lib/motion";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li";
};

/**
 * Revela o conteúdo com um leve fade + subida ao entrar na tela.
 * Roda uma única vez por elemento e é neutralizado quando o usuário
 * prefere movimento reduzido (o CSS global já zera as durações nesse caso,
 * isto apenas evita depender de transform em quem não quer animação).
 */
export function Reveal({ children, delay = 0, className, as = "div" }: RevealProps) {
  const prefersReducedMotion = useReducedMotion();
  const Component = motion[as];

  return (
    <Component
      className={className}
      initial={prefersReducedMotion ? undefined : "hidden"}
      whileInView={prefersReducedMotion ? undefined : "show"}
      viewport={viewport}
      variants={fadeUp}
      transition={{ delay }}
    >
      {children}
    </Component>
  );
}
