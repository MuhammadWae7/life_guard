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
import { ErrorBoundary } from "@/components/error-boundary"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "LifeGuard - Health Monitoring System",
  description: "Real-time health monitoring system with Arduino integration",
  keywords: ["health", "monitoring", "arduino", "vital signs", "medical"],
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
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#ffffff",
  manifest: "/manifest.json",
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
      <body className={`${inter.className} fallback-font`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={true}
          storageKey="lifeguard-theme"
          disableTransitionOnChange
        >
          <LanguageProvider>
            <AuthProvider>
              <ErrorBoundary>
                <Navigation />
                <main className="min-h-screen">{children}</main>
                <PWAInstall />
                <MouseFollower />
                <Toaster />
              </ErrorBoundary>
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
        <script src="/sw-register.js" defer></script>
      </body>
    </html>
  )
}
