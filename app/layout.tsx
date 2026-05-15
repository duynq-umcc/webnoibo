import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { AuthProviderWrapper } from "@/components/providers/AuthProvider";
import "./globals.css";

const font = Plus_Jakarta_Sans({
  subsets: ["latin", "vietnamese"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "webnoibo - Phòng Khám BV ĐH Y Dược 1",
  description:
    "Hệ thống quản lý nội bộ - Phòng Khám Bệnh Viện Đại Học Y Dược 1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        {/* Prevents flash of wrong theme during SSR hydration */}
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('webnoibo-theme')||'system',s=t==='system'?window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light':t;document.documentElement.classList.add(s);document.documentElement.style.colorScheme=s;}catch(e){document.documentElement.classList.add('light');}})()`,
          }}
        />
      </head>
      <body suppressHydrationWarning className={`${font.variable} font-sans antialiased`}>
        <ThemeProvider>
          <AuthProviderWrapper>
            <TooltipProvider>{children}</TooltipProvider>
          </AuthProviderWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
