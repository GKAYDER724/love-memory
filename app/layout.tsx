import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Our Story — Kỷ niệm của chúng ta",
  description: "Một góc nhỏ lưu giữ những ngày tháng đẹp nhất của hai người.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
