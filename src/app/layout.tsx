import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MUSIC Backstage | Artist Dashboard",
  description: "Track your releases, direct-to-fan sales, and fan engagement",
  metadataBase: new URL("https://music.celsiusaray.com"),
  icons: {
    icon: [{ url: "/favicon.ico", sizes: "any" }],
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "MUSIC Backstage | Artist Dashboard",
    description: "Track your releases, direct-to-fan sales, and fan engagement",
    url: "https://music.celsiusaray.com",
    siteName: "MUSIC Backstage",
    images: [
      {
        url: "/images/android-chrome-512x512.png",
        width: 512,
        height: 512,
        alt: "MUSIC Backstage Logo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "MUSIC Backstage | Artist Dashboard",
    description: "Track your releases, direct-to-fan sales, and fan engagement",
    images: ["/images/android-chrome-512x512.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} bg-background min-h-screen font-sans antialiased`}
      >
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
