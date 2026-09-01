import { Section } from "@/components/section";
import { SectionHeader } from "@/components/section-header";
import { Reveal } from "@/components/reveal";

const STEPS = [
  { n: "01", title: "Briefing", body: "Entendemos seu negócio, seus objetivos e o que o site precisa resolver." },
  { n: "02", title: "Proposta", body: "Você recebe escopo, prazo e valor claros — sem letras miúdas." },
  { n: "03", title: "Desenvolvimento", body: "Design e construção do site, com você acompanhando o andamento." },
  { n: "04", title: "Revisão", body: "Ajustes junto com você até o resultado ficar do jeito certo." },
  { n: "05", title: "Entrega", body: "Site no ar, publicado e pronto para trazer os primeiros contatos." },
];

export function Processo() {
  return (
    <Section id="processo" tone="light">
      <SectionHeader
        eyebrow="Como funciona"
        title="Um processo claro, do início ao fim."
        subhead="Organização e transparência em cada etapa — você sempre sabe o que esperar."
      />

      <div className="mt-16 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-5">
        {STEPS.map((step, i) => (
          <Reveal key={step.n} delay={i * 0.07}>
            <div className="relative">
              <span className="font-display text-3xl font-bold text-brand/25">{step.n}</span>
              <div className="mt-4 h-px w-full bg-border" />
              <h3 className="mt-5 font-display text-lg font-semibold text-ink">{step.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{step.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
