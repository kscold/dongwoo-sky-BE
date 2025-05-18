'use client';

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/reset.css";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

// metadata export 제거
// export const metadata: Metadata = {
//   title: "동우스카이 | 최신 스카이 장비, 신속하고 안전한 작업",
//   description: "동우스카이는 전국 어디든 신속하게 출동하는 최신 스카이 장비 임대 서비스를 제공합니다. 안전하고 효율적인 고소 작업을 경험하세요.",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={inter.variable}>
      <body>
        {children}
      </body>
    </html>
  );
}
