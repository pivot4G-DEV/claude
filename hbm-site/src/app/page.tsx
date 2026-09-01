import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Hero } from "@/components/hero";
import { Sobre } from "@/components/sobre";
import { Diferenciais } from "@/components/diferenciais";
import { Servicos } from "@/components/servicos";
import { Processo } from "@/components/processo";
import { Portfolio } from "@/components/portfolio";
import { Contato } from "@/components/contato";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="conteudo">
        <Hero />
        <Sobre />
        <Diferenciais />
        <Servicos />
        <Processo />
        <Portfolio />
        <Contato />
      </main>
      <SiteFooter />
    </>
  );
}
