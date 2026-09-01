import type { Variants } from "framer-motion";

/**
 * Escala de movimento da HBM.
 * Curva e durações únicas reaproveitadas em todo o site para que as
 * transições pareçam parte de um mesmo sistema, não efeitos soltos.
 */
export const EASE_OUT = [0.16, 1, 0.3, 1] as const;

export const DURATION = {
  fast: 0.2,
  base: 0.5,
  slow: 0.8,
} as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.slow, ease: EASE_OUT },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: DURATION.slow, ease: EASE_OUT },
  },
};

export const staggerContainer = (stagger = 0.12, delayChildren = 0): Variants => ({
  hidden: {},
  show: {
    transition: {
      staggerChildren: stagger,
      delayChildren,
    },
  },
});

export const viewport = { once: true, amount: 0.2, margin: "0px 0px -80px 0px" };
