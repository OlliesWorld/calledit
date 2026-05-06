import type { Metadata } from "next";
import { Bebas_Neue, DM_Sans, DM_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "@/styles/globals.css";
import { siteConfig } from "@/config/site";

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas",
  weight: "400",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  weight: ["400", "500"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  icons: {
    icon: '/ollie_toon.ico',
    apple: '/logo.png',
  },
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
};

// Check if Clerk is configured
const isClerkConfigured = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content = (
    <html lang="en">
      <body
        className={`${bebasNeue.variable} ${dmSans.variable} ${dmMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );

  // Wrap with ClerkProvider only if configured
  if (isClerkConfigured) {
    return <ClerkProvider>{content}</ClerkProvider>;
  }

  return content;
}
