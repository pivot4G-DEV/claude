import { Reveal } from "@/components/reveal";

type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  subhead?: string;
  tone?: "light" | "dark";
  align?: "center" | "left";
};

/**
 * Fórmula de seção reaproveitada em todo o site: rótulo pequeno na cor
 * da marca, título grande, um parágrafo curto de apoio. Mesma hierarquia
 * em todas as seções para o site ler como um sistema, não blocos soltos.
 */
export function SectionHeader({
  eyebrow,
  title,
  subhead,
  tone = "light",
  align = "center",
}: SectionHeaderProps) {
  const textAlign = align === "center" ? "text-center items-center mx-auto" : "text-left items-start";
  const eyebrowColor = tone === "dark" ? "text-brand-on-dark" : "text-brand";
  const titleColor = tone === "dark" ? "text-dark-text" : "text-ink";
  const subheadColor = tone === "dark" ? "text-dark-muted" : "text-ink-soft";

  return (
    <div className={`flex max-w-2xl flex-col ${textAlign}`}>
      <Reveal>
        <p className={`text-[15px] font-medium ${eyebrowColor}`}>{eyebrow}</p>
      </Reveal>
      <Reveal delay={0.08}>
        <h2
          className={`mt-3 text-balance font-display text-[2.25rem] font-bold leading-[1.08] tracking-[-0.015em] sm:text-5xl ${titleColor}`}
        >
          {title}
        </h2>
      </Reveal>
      {subhead && (
        <Reveal delay={0.16}>
          <p className={`mt-5 text-balance text-lg leading-relaxed ${subheadColor}`}>{subhead}</p>
        </Reveal>
      )}
    </div>
  );
}
