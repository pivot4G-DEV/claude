import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import { Grain } from "@/components/grain";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://hbm.com.br"),
  title: {
    default: "HBM — Sites profissionais que geram resultado para sua empresa",
    template: "%s | HBM",
  },
  description:
    "A HBM cria sites profissionais que transformam visitantes em clientes: mais credibilidade, mais contato, mais oportunidades para o seu negócio.",
  keywords: [
    "criação de sites",
    "site profissional para empresa",
    "desenvolvimento web",
    "site institucional",
    "presença digital",
    "HBM",
  ],
  authors: [{ name: "HBM" }],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://hbm.com.br",
    siteName: "HBM",
    title: "HBM — Sites profissionais que geram resultado para sua empresa",
    description:
      "A HBM cria sites profissionais que transformam visitantes em clientes: mais credibilidade, mais contato, mais oportunidades para o seu negócio.",
  },
  twitter: {
    card: "summary_large_image",
    title: "HBM — Sites profissionais que geram resultado para sua empresa",
    description:
      "A HBM cria sites profissionais que transformam visitantes em clientes.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body className="bg-paper font-body text-ink antialiased">
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-sm focus:font-medium focus:text-white"
        >
          Pular para o conteúdo
        </a>
        {children}
        <Grain />
      </body>
    </html>
  );
}
