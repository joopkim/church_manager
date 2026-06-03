import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "초대교회 소그룹 관리",
  description: "성도, 구역, 사역팀, 소그룹 모임을 관리하는 목양 운영 웹앱",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
