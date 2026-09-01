import type { ReactNode } from "react";

type SectionProps = {
  id?: string;
  children: ReactNode;
  tone?: "light" | "surface" | "dark";
  className?: string;
};

const TONE_BG: Record<NonNullable<SectionProps["tone"]>, string> = {
  light: "bg-paper",
  surface: "bg-surface",
  dark: "bg-dark",
};

/**
 * Casca de seção padrão: mesmo ritmo vertical generoso em todas as
 * seções (padrão Apple: 100–150px desktop, 60–80px mobile), tom
 * claro/neutro/escuro para alternar o fundo entre seções.
 */
export function Section({ id, children, tone = "light", className = "" }: SectionProps) {
  return (
    <section id={id} className={`${TONE_BG[tone]} py-24 md:py-36 ${className}`}>
      <div className="container-hbm">{children}</div>
    </section>
  );
}
