import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const codeNext = localFont({
  src: "./../public/fonts/CodeNext-Regular.woff2",
  display: "swap",
  variable: "--font-codenext",
});

export const metadata: Metadata = {
  title: "vslezax // Ярослав Журков",
  description: "Дизайнер и разработчик. Проекты, фото, контакты.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
      <html lang="ru" className={`${codeNext.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
      </html>
  );
}