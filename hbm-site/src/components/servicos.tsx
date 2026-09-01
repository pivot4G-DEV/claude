import { Section } from "@/components/section";
import { SectionHeader } from "@/components/section-header";
import { Reveal } from "@/components/reveal";

const INCLUDES = [
  {
    title: "Design sob medida",
    body: "Nada de template genérico — layout, cores e tipografia pensados para a sua marca.",
  },
  {
    title: "Feito para converter",
    body: "Estrutura pensada para transformar quem visita em contato de verdade.",
  },
  {
    title: "Rápido e responsivo",
    body: "Funciona bem em qualquer tela, do celular ao monitor grande, sem travar o carregamento.",
  },
];

export function Servicos() {
  return (
    <Section id="servicos" tone="dark">
      <SectionHeader
        eyebrow="O que fazemos"
        title="Desenvolvimento de sites profissionais para empresas."
        subhead="Um site não é só uma página bonita — é a ferramenta que apresenta sua empresa, gera credibilidade e traz oportunidade de contato."
        tone="dark"
      />

      <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-3">
        {INCLUDES.map((item, i) => (
          <Reveal key={item.title} delay={i * 0.08} className="text-center sm:text-left">
            <h3 className="font-display text-lg font-semibold text-dark-text">{item.title}</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-dark-muted">{item.body}</p>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.3}>
        <div className="mx-auto mt-20 max-w-xl rounded-3xl border border-white/[0.12] bg-white/[0.06] px-7 py-6 text-center backdrop-blur-xl backdrop-saturate-[1.8]">
          <p className="text-[15px] leading-relaxed text-dark-muted">
            Sua empresa já tem site e quer evoluir? Também trabalhamos com{" "}
            <span className="text-dark-text">automação, integrações e IA</span> — quando fizer
            sentido para o seu negócio.
          </p>
        </div>
      </Reveal>
    </Section>
  );
}
