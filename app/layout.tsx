import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/contexts/language-context"
import { AuthProvider } from "@/contexts/auth-context"
import { Navigation } from "@/components/navigation"
import { PWAInstall } from "@/components/pwa-install"
import { MouseFollower } from "@/components/mouse-follower"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "LifeGuard - Health Monitoring Platform",
  description:
    "Advanced health monitoring platform using Arduino Uno to read vital signs and provide real-time health alerts",
  keywords: ["health", "monitoring", "arduino", "vital signs", "medical", "IoT"],
  authors: [{ name: "LifeGuard Team" }],
  creator: "LifeGuard Team",
  publisher: "LifeGuard",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://lifeguard-app.com",
    title: "LifeGuard - Health Monitoring Platform",
    description: "Advanced health monitoring platform using Arduino Uno technology",
    siteName: "LifeGuard",
  },
  twitter: {
    card: "summary_large_image",
    title: "LifeGuard - Health Monitoring Platform",
    description: "Advanced health monitoring platform using Arduino Uno technology",
  },
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="LifeGuard" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={true}
          storageKey="lifeguard-theme"
          disableTransitionOnChange
        >
          <LanguageProvider>
            <AuthProvider>
              <Navigation />
              <main className="min-h-screen">{children}</main>
              <PWAInstall />
              <MouseFollower />
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </body>
    </html>
  )
}
