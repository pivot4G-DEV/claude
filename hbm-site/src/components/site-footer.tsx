export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface py-10">
      <div className="container-hbm flex flex-col items-center justify-between gap-4 text-sm text-ink-faint sm:flex-row">
        <span className="font-display font-semibold text-ink">HBM</span>
        <p>© {new Date().getFullYear()} HBM. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}
