const LINKS = [
  { href: "#sobre", label: "Sobre" },
  { href: "#diferenciais", label: "Diferenciais" },
  { href: "#servicos", label: "Serviços" },
  { href: "#processo", label: "Processo" },
  { href: "#portfolio", label: "Portfólio" },
  { href: "#contato", label: "Contato" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-black/[0.08] bg-surface">
      <div className="container-hbm flex flex-col gap-6 py-10 text-[13px] text-ink-faint sm:flex-row sm:items-center sm:justify-between">
        <span className="font-display text-[13px] font-semibold text-ink-soft">HBM</span>

        <nav aria-label="Navegação do rodapé">
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="transition-colors duration-200 hover:text-ink">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <p>© {new Date().getFullYear()} HBM. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}
