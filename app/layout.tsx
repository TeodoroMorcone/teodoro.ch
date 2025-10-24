import type {Metadata} from "next";
import type {ReactNode} from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Teodoro Morcone Nachhilfe",
  description:
    "Professionelle Mathematik-Nachhilfe für Gymiprüfung, BMS/HMS/FMS und laufende Betreuung.",
  icons: {
    icon: "/images/64x64.png",
    apple: "/images/64x64.png",
    shortcut: "/images/64x64.png",
  },
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({children}: RootLayoutProps) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body className="min-h-screen bg-surface text-primary antialiased transition-colors duration-200 ease-soft-sine dark:bg-primary dark:text-surface">
        {children}
      </body>
    </html>
  );
}
