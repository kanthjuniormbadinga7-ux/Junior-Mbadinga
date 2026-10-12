import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Junior Mbadinga — Motion Designer & Créateur Audiovisuel",
  description:
    "Portfolio de Junior Mbadinga, Motion Designer & Créateur Audiovisuel basé à Libreville, Gabon. Motion Design 2D, réalisation, montage, sound design et streaming live.",
  keywords: [
    "Junior Mbadinga",
    "Motion Designer",
    "Créateur Audiovisuel",
    "Libreville",
    "Gabon",
    "Motion Design 2D",
    "Audiovisuel",
    "Réalisation",
    "Montage",
    "Sound Design",
  ],
  authors: [{ name: "Junior Mbadinga" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "Junior Mbadinga — Motion Designer & Créateur Audiovisuel",
    description:
      "Portfolio de Junior Mbadinga, Motion Designer & Créateur Audiovisuel basé à Libreville, Gabon.",
    siteName: "Junior Mbadinga Portfolio",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Junior Mbadinga — Motion Designer & Créateur Audiovisuel",
    description:
      "Portfolio de Junior Mbadinga, Motion Designer & Créateur Audiovisuel basé à Libreville, Gabon.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${montserrat.variable} font-montserrat antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
