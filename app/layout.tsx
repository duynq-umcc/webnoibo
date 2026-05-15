import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
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
      <body className={`${font.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProviderWrapper>
            <TooltipProvider>{children}</TooltipProvider>
          </AuthProviderWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
