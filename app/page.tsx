"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AnimatedSection } from "@/components/animated-section"
import { useLanguage } from "@/contexts/language-context"
import { motion } from "framer-motion"
import { Heart, Shield, BarChart3, Smartphone, Zap, Users, ArrowRight, Activity } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const { t } = useLanguage()

  const features = [
    {
      icon: Activity,
      title: t("realTimeMonitoring"),
      description: t("realTimeDesc"),
    },
    {
      icon: Shield,
      title: t("intelligentAlerts"),
      description: t("intelligentDesc"),
    },
    {
      icon: BarChart3,
      title: t("comprehensiveDashboard"),
      description: t("dashboardDesc"),
    },
  ]

  return (
    <>
      <head>
        <title>{t("homePageTitle")}</title>
        <meta name="description" content={t("homePageDescription")} />
      </head>
      <div className="flex flex-col">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5">
          <div className="absolute inset-0 bg-grid-pattern opacity-5" />
          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center space-y-8 text-center">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-4"
              >
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  {t("heroTitle")}
                </h1>
                <p className="text-xl text-muted-foreground sm:text-2xl md:text-3xl font-medium">
                  {t("heroSubtitle")}
                </p>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="mx-auto max-w-[700px] text-muted-foreground md:text-xl"
              >
                {t("heroDescription")}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Button size="lg" className="text-lg px-8" asChild aria-label={t("getStartedAriaLabel")}>
                  <Link href="/download">
                    {t("getStarted")}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8" asChild aria-label={t("learnMoreAriaLabel")}>
                  <Link href="/about">{t("learnMore")}</Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-muted/50">
          <div className="container px-4 md:px-6">
            <AnimatedSection className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
                {t("featuresTitle")}
              </h2>
            </AnimatedSection>

            <div className="grid gap-8 md:grid-cols-3">
              {features.map((feature, index) => (
                <AnimatedSection key={index} delay={index * 0.2}>
                  <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <CardContent className="p-8 text-center">
                      <div className="w-16 h-16 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
                        <feature.icon className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-24">
          <div className="container px-4 md:px-6">
            <div className="grid gap-8 md:grid-cols-4 text-center">
              {[
                { icon: Heart, value: "24/7", label: t("monitoring") },
                { icon: Users, value: "1000+", label: t("users") },
                { icon: Zap, value: "99.9%", label: t("uptime") },
                { icon: Smartphone, value: t("realTimeMonitoring"), label: t("alerts") },
              ].map((stat, index) => (
                <AnimatedSection key={index} delay={index * 0.1}>
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <stat.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold">{stat.value}</div>
                      <div className="text-muted-foreground">{stat.label}</div>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-primary text-primary-foreground">
          <div className="container px-4 md:px-6 text-center">
            <AnimatedSection>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">{t("readyToStart")}</h2>
              <p className="mx-auto max-w-[600px] text-primary-foreground/80 md:text-xl mb-8">{t("joinThousands")}</p>
              <Button size="lg" variant="secondary" className="text-lg px-8" asChild>
                <Link href="/download">
                  {t("getStarted")}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </AnimatedSection>
          </div>
        </section>
      </div>
    </>
  )
}
