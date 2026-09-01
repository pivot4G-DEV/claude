import type { Variants } from "framer-motion";

/**
 * Escala de movimento da HBM — calibrada no padrão Apple HIG/Liquid Glass:
 * curva física, assentamento rápido, sem bounce em revelações de scroll.
 * Reaproveitada em todo o site para que as transições pareçam parte de
 * um mesmo sistema, não efeitos soltos.
 */
export const EASE_OUT = [0.28, 0.11, 0.32, 1] as const; // --ease-apple

export const SPRING = { type: "spring", stiffness: 340, damping: 30 } as const;

export const DURATION = {
  fast: 0.2,
  base: 0.4,
  slow: 0.8,
} as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
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
