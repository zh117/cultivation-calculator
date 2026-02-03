import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "修仙世界观量化计算器",
  description: "检测修仙小说世界观数值的自洽性和崩坏风险",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  );
}
