import { Section } from "@/components/section";
import { Reveal } from "@/components/reveal";

export function Sobre() {
  return (
    <Section id="sobre" tone="surface">
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <Reveal>
          <p className="text-[15px] font-medium text-brand">Sobre a HBM</p>
        </Reveal>

        <Reveal delay={0.08}>
          <p className="mt-5 text-balance font-display text-[1.85rem] font-semibold leading-[1.25] tracking-[-0.01em] text-ink sm:text-4xl">
            Empresas sérias merecem um site que representa o tamanho do
            trabalho que fazem.
          </p>
        </Reveal>

        <Reveal delay={0.16}>
          <p className="mt-7 max-w-xl text-balance text-lg leading-relaxed text-ink-soft">
            A HBM existe para resolver isso. Unimos design, tecnologia e
            estratégia para construir a presença digital da sua empresa —
            pensada para gerar confiança, organizar sua imagem online e
            transformar visitantes em contato real. Não somos uma fábrica de
            sites: cada decisão de design serve a um objetivo do seu negócio.
          </p>
        </Reveal>

        <Reveal delay={0.24}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm font-medium text-ink-faint">
            <span>Design</span>
            <span aria-hidden className="h-1 w-1 rounded-full bg-ink-faint/50" />
            <span>Tecnologia</span>
            <span aria-hidden className="h-1 w-1 rounded-full bg-ink-faint/50" />
            <span>Estratégia</span>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
