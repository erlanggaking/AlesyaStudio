import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Alesya Studio - Shopee Live Affiliator Management",
  description:
    "Platform manajemen Shopee Live: riset produk winning, live management, analytics & dashboard.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-background text-foreground`}>
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
