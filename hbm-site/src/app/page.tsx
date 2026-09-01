import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Hero } from "@/components/hero";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="conteudo">
        <Hero />
        {/* Próximas seções: Sobre, Diferenciais, Serviços, Processo, Portfólio, Contato */}
      </main>
      <SiteFooter />
    </>
  );
}
