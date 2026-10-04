import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

// Khai báo font Playfair Display hỗ trợ tiếng Việt cho tiêu đề
const playfair = Playfair_Display({
  subsets: ["latin", "vietnamese"],
  variable: "--font-serif",
  display: "swap",
});

// Khai báo font Inter hỗ trợ tiếng Việt cho văn bản chính
const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Our Story — Kỷ niệm của chúng ta",
  description: "Một góc nhỏ lưu giữ những ngày tháng đẹp nhất của hai người.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" className={`${playfair.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}