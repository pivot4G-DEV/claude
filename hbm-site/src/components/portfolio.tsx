import { Section } from "@/components/section";
import { SectionHeader } from "@/components/section-header";
import { Reveal } from "@/components/reveal";

const CARDS = [
  { bars: [70, 45], accent: 40 },
  { bars: [55, 60, 35], accent: 50 },
  { bars: [65, 40], accent: 30 },
];

export function Portfolio() {
  return (
    <Section id="portfolio" tone="surface">
      <SectionHeader
        eyebrow="Portfólio"
        title="Nossos primeiros projetos estão a caminho."
        subhead="Este espaço vai reunir os sites que estamos construindo agora. Enquanto isso, prefira falar direto com a gente."
      />

      <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {CARDS.map((card, i) => (
          <Reveal key={i} delay={i * 0.08}>
            <div className="group relative overflow-hidden rounded-[24px] border border-black/[0.06] bg-paper p-6 shadow-[0_1px_2px_rgba(16,20,31,0.04)]">
              <span className="absolute right-5 top-5 rounded-full border border-black/[0.08] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.06em] text-ink-faint">
                Em breve
              </span>

              <div className="mt-10 space-y-3">
                {card.bars.map((w, j) => (
                  <div
                    key={j}
                    className="h-2.5 rounded-full bg-ink/[0.08]"
                    style={{ width: `${w}%` }}
                  />
                ))}
              </div>
              <div
                className="mt-5 h-8 rounded-full bg-ink/[0.06]"
                style={{ width: `${card.accent}%` }}
              />
              <div className="mt-8 grid grid-cols-2 gap-2.5">
                <div className="aspect-[4/3] rounded-lg bg-ink/[0.04]" />
                <div className="aspect-[4/3] rounded-lg bg-ink/[0.04]" />
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.3}>
        <div className="mt-12 flex justify-center">
          <a
            href="#contato"
            className="inline-flex items-center gap-1 text-[15px] font-medium text-brand"
          >
            Ver exemplos em andamento
            <span aria-hidden>›</span>
          </a>
        </div>
      </Reveal>
    </Section>
  );
}
