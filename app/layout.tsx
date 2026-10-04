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
  // Bắt buộc khai báo domain của bạn để Next.js ghép thành URL tuyệt đối cho ảnh
  metadataBase: new URL("https://love-memory-1234.vercel.app"),

  title: "Our Story — Kỷ niệm của chúng ta",
  description: "Một góc nhỏ lưu giữ những ngày tháng đẹp nhất của hai người.",

  // Cấu hình xem trước link cho Facebook, Zalo, Discord,...
  openGraph: {
    title: "Our Story — Kỷ niệm của chúng ta",
    description: "Một góc nhỏ lưu giữ những ngày tháng đẹp nhất của hai người.",
    url: "https://love-memory-1234.vercel.app",
    siteName: "Our Story",
    images: [
      {
        url: "https://i.pinimg.com/736x/43/a4/62/43a462ff19b82db9da99caeef4e11e5a.jpg", // Đường dẫn file ảnh trong thư mục public/
        width: 1200,
        height: 630,
        alt: "Our Story Preview",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },

  // Cấu hình riêng cho Discord / Twitter card
  twitter: {
    card: "summary_large_image",
    title: "Our Story — Kỷ niệm của chúng ta",
    description: "Một góc nhỏ lưu giữ những ngày tháng đẹp nhất của hai người.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" className={`${playfair.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}