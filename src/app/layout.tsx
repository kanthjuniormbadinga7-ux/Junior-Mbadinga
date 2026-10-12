import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Junior Mbadinga — Motion Designer & Créateur Audiovisuel",
  description:
    "Portfolio de Junior Mbadinga, Motion Designer & Créateur Audiovisuel basé à Libreville, Gabon.",
  keywords: [
    "Junior Mbadinga",
    "Motion Designer",
    "Créateur Audiovisuel",
    "Libreville",
    "Gabon",
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
        className={`${fraunces.variable} ${manrope.variable} font-sans antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
