"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { EASE_OUT, SPRING } from "@/lib/motion";
import { Logo } from "@/components/logo";

const NAV_LINKS = [
  { href: "#sobre", label: "Sobre" },
  { href: "#diferenciais", label: "Diferenciais" },
  { href: "#servicos", label: "Serviços" },
  { href: "#processo", label: "Processo" },
  { href: "#portfolio", label: "Portfólio" },
];

const GLASS =
  "bg-[var(--glass-bg)] shadow-[var(--glass-shadow)] backdrop-blur-xl backdrop-saturate-[1.8]";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Trava o scroll do body quando o menu mobile está aberto.
  useEffect(() => {
    document.documentElement.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      {/* Scroll edge: o conteúdo passa por baixo da ilha flutuante, este
          véu de desfoque separa as duas camadas — como no HIG. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 z-40 h-28 backdrop-blur-md"
        style={{
          maskImage: "linear-gradient(to bottom, black 25%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 25%, transparent 100%)",
          background: "linear-gradient(to bottom, rgba(255,255,255,0.65), transparent)",
        }}
      />

      <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 md:pt-5">
        <motion.div
          animate={{
            paddingInline: scrolled ? 6 : 8,
            paddingBlock: scrolled ? 6 : 8,
          }}
          transition={SPRING}
          className={`flex w-full max-w-3xl items-center justify-between gap-2 rounded-full ${GLASS}`}
        >
          <Link
            href="#topo"
            className="flex items-center gap-2 rounded-full py-1.5 pl-3 pr-3"
            onClick={() => setMenuOpen(false)}
          >
            <Logo className="h-7 w-auto" />
            <span className="font-display text-base font-semibold tracking-tight text-ink">
              HBM
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Navegação principal">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-full px-3.5 py-2 text-[13px] font-medium text-ink/75 transition-colors duration-200 ease-out hover:text-ink"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <a
            href="#contato"
            className="hidden shrink-0 items-center justify-center rounded-full bg-brand px-5 py-2.5 text-[13px] font-semibold text-white transition-[background-color,transform,opacity] duration-200 ease-out hover:bg-brand-hover active:scale-[0.97] active:opacity-80 md:inline-flex"
          >
            Falar com a HBM
          </a>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink transition-transform active:scale-90 md:hidden"
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </motion.div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            id="mobile-menu"
            aria-label="Navegação mobile"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.25, ease: EASE_OUT }}
            className={`fixed inset-x-4 top-[4.75rem] z-40 rounded-3xl ${GLASS} p-2 md:hidden`}
          >
            <ul className="flex flex-col">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-2xl px-4 py-3.5 text-base font-medium text-ink active:bg-black/[0.04]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <a
              href="#contato"
              onClick={() => setMenuOpen(false)}
              className="mt-1 flex items-center justify-center rounded-2xl bg-brand px-5 py-3.5 text-sm font-semibold text-white active:scale-[0.97] active:opacity-80"
            >
              Falar com a HBM
            </a>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
