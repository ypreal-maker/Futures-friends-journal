import type { Metadata } from "next";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "Cinematic Journal | Private Collection",
  description: "A private archive of instants.",
  // 💡 아래 주소를 본인의 실제 Vercel 배포 주소로 변경해 주세요!
  metadataBase: new URL("https://futures-friends-journal.vercel.app/"), 
  openGraph: {
    title: "Cinematic Journal",
    description: "A private archive of instants. Each frame a sentence.",
    url: "/",
    siteName: "Cinematic Journal",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cinematic Journal",
    description: "A private archive of instants.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <AuthProvider>
            <SmoothScroll>{children}</SmoothScroll>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
