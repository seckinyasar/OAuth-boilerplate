import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { Inter } from "next/font/google";
import { auth } from "../../auth";
import { SessionErrorHandler } from "@/components/widgets/Session-error-handler";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  fallback: ["system"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased `}>
        <SessionProvider session={session}>
          <SessionErrorHandler />
          <ThemeProvider defaultTheme="system" enableSystem>
            {children}
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
