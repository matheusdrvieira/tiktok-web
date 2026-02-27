import type { Metadata } from "next";
import { Providers } from "@/components/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Quizzio Creator Hub",
  description: "Plataforma de automação e publicação para Quizzio.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="font-mono antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
