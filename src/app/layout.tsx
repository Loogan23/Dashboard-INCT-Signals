import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dashboard de Publicações | INCT Signals",
  description:
    "Dashboard interativo com todos os artigos e publicações do INCT Signals – Processamento de Sinais, Comunicações, Sensoriamento e Vigilância.",
  keywords: ["INCT Signals", "publicações", "artigos", "UFC", "ITA", "UFRGS", "PUCRS", "UNIPAMPA"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-[#08172D] text-slate-100 min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
