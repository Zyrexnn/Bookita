import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bookkita - Tempat Beli Ebook Terlengkap",
  description: "Platform pembelian ebook terlengkap dan terpercaya. Nikmati kemudahan membaca tanpa perlu membawa banyak buku fisik.",
  keywords: ["Bookkita", "ebook", "buku digital", "beli buku", "baca online", "perpustakaan digital"],
  authors: [{ name: "Bookkita Team" }],
  openGraph: {
    title: "Bookkita - Tempat Beli Ebook Terlengkap",
    description: "Platform pembelian ebook terlengkap dan terpercaya. Nikmati kemudahan membaca tanpa perlu membawa banyak buku fisik.",
    url: "https://bookkita.com",
    siteName: "Bookkita",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bookkita - Tempat Beli Ebook Terlengkap",
    description: "Platform pembelian ebook terlengkap dan terpercaya. Nikmati kemudahan membaca tanpa perlu membawa banyak buku fisik.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
