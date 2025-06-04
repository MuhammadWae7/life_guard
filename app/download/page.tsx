"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AnimatedSection } from "@/components/animated-section"
import { useLanguage } from "@/contexts/language-context"
import { Download, Smartphone, Star, Shield, Zap } from "lucide-react"

export default function DownloadPage() {
  const { t } = useLanguage()

  const features = [
    { icon: Smartphone, title: t("mobileOptimized"), description: t("mobileOptimizedDesc") },
    { icon: Shield, title: t("securePrivate"), description: t("securePrivateDesc") },
    { icon: Zap, title: t("realTimeSync"), description: t("realTimeSyncDesc") },
  ]

  return (
    <div className="container mx-auto px-4 py-24">
      <AnimatedSection className="text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl mb-4">{t("downloadTitle")}</h1>
        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">{t("downloadDescription")}</p>
      </AnimatedSection>

      <div className="max-w-4xl mx-auto">
        <div className="grid gap-8 lg:grid-cols-2 items-center">
          <AnimatedSection delay={0.2}>
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-sm">
                  {t("version")} 1.0.0
                </Badge>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-sm text-muted-foreground ml-2">4.8 (1,234 {t("reviews")})</span>
                </div>
              </div>

              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{feature.title}</h3>
                      <p className="text-muted-foreground text-sm">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <Button size="lg" className="w-full text-lg">
                  <Download className="w-5 h-5 mr-2" />
                  {t("downloadButton")}
                </Button>
                <p className="text-center text-muted-foreground text-sm">{t("comingSoon")}</p>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.4}>
            <Card className="bg-gradient-to-br from-primary/5 to-secondary/5">
              <CardContent className="p-8">
                <div className="aspect-[9/16] bg-muted rounded-2xl flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <Smartphone className="w-16 h-16 mx-auto text-primary" />
                    <div>
                      <h3 className="font-semibold text-lg">LifeGuard Mobile</h3>
                      <p className="text-muted-foreground">Health monitoring on the go</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>

        <AnimatedSection delay={0.6} className="mt-16">
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-6 text-center">{t("appFeatures")}</h2>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Smartphone className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{t("realTimeMonitoring")}</h3>
                  <p className="text-muted-foreground text-sm">{t("realTimeDesc")}</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{t("healthAlerts")}</h3>
                  <p className="text-muted-foreground text-sm">{t("healthAlertsDesc")}</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{t("dataAnalytics")}</h3>
                  <p className="text-muted-foreground text-sm">{t("dataAnalyticsDesc")}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>
      </div>
    </div>
  )
}
