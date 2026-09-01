"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { EASE_OUT } from "@/lib/motion";

const NAV_LINKS = [
  { href: "#sobre", label: "Sobre" },
  { href: "#diferenciais", label: "Diferenciais" },
  { href: "#servicos", label: "Serviços" },
  { href: "#processo", label: "Processo" },
  { href: "#portfolio", label: "Portfólio" },
];

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
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,border-color] duration-300 ${
        scrolled
          ? "border-b border-border/80 bg-paper/85 shadow-[0_1px_0_rgba(16,20,31,0.04)] backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="container-hbm flex items-center justify-between py-4">
        <Link
          href="#topo"
          className="font-display text-xl font-semibold tracking-tight text-ink"
          onClick={() => setMenuOpen(false)}
        >
          HBM
        </Link>

        <nav className="hidden items-center gap-9 md:flex" aria-label="Navegação principal">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="group relative text-sm font-medium text-ink-soft transition-colors duration-200 hover:text-ink"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-brand transition-[width] duration-300 ease-out group-hover:w-full" />
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
          <a
            href="#contato"
            className="inline-flex items-center justify-center rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-brand"
          >
            Falar com a HBM
          </a>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink md:hidden"
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            id="mobile-menu"
            aria-label="Navegação mobile"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: EASE_OUT }}
            className="border-t border-border bg-paper px-6 pb-8 pt-2 md:hidden"
          >
            <ul className="flex flex-col divide-y divide-border">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="block py-4 text-base font-medium text-ink"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <a
              href="#contato"
              onClick={() => setMenuOpen(false)}
              className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-ink px-5 py-3 text-sm font-medium text-white"
            >
              Falar com a HBM
            </a>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
