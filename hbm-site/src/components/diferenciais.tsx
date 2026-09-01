import { Section } from "@/components/section";
import { SectionHeader } from "@/components/section-header";
import { Reveal } from "@/components/reveal";

const ITEMS = [
  {
    n: "01",
    title: "Design, tecnologia e estratégia",
    body: "Não entregamos só código bonito. Cada decisão de design serve a um objetivo do seu negócio — não é estética por estética.",
    span: "md:col-span-2",
  },
  {
    n: "02",
    title: "Processo estruturado",
    body: "Você sabe exatamente o que esperar em cada etapa, do briefing à entrega.",
    span: "",
  },
  {
    n: "03",
    title: "Site como ferramenta de negócio",
    body: "Pensado para gerar contato e conversão — não só para ficar bonito parado.",
    span: "",
  },
  {
    n: "04",
    title: "Cresce com você",
    body: "Quando fizer sentido, evoluímos o site com automação, integrações e IA.",
    span: "",
  },
  {
    n: "05",
    title: "Atendimento direto",
    body: "Você fala com quem faz o trabalho, sem burocracia de agência grande.",
    span: "",
  },
];

export function Diferenciais() {
  return (
    <Section id="diferenciais" tone="light">
      <SectionHeader
        eyebrow="Por que a HBM"
        title="Feito para durar, não só para lançar."
        subhead="Cinco motivos pelos quais empresas escolhem trabalhar com a gente."
      />

      <div className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-3">
        {ITEMS.map((item, i) => (
          <Reveal key={item.n} delay={i * 0.06} className={item.span}>
            <div className="group h-full rounded-[28px] border border-black/[0.06] bg-surface p-8 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-white/60 hover:bg-white/50 hover:shadow-[0_20px_50px_-24px_rgba(16,20,31,0.22)] hover:backdrop-blur-xl hover:backdrop-saturate-[1.8] md:p-9">
              <span className="font-display text-sm font-semibold text-ink/20">{item.n}</span>
              <h3 className="mt-5 font-display text-xl font-semibold tracking-[-0.01em] text-ink">
                {item.title}
              </h3>
              <p className="mt-2.5 max-w-md text-[15px] leading-relaxed text-ink-soft">{item.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
