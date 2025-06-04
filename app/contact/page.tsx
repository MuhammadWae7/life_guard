"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { AnimatedSection } from "@/components/animated-section"
import { useLanguage } from "@/contexts/language-context"
import { Mail, Send } from "lucide-react"

export default function ContactPage() {
  const { t } = useLanguage()

  return (
    <div className="container mx-auto px-4 py-24">
      <AnimatedSection className="text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl mb-4">{t("contactTitle")}</h1>
        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">{t("contactDescription")}</p>
      </AnimatedSection>

      <div className="max-w-2xl mx-auto">
        <AnimatedSection delay={0.2}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                {t("contactTitle")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center p-6 bg-muted rounded-lg">
                <Mail className="w-12 h-12 mx-auto mb-4 text-primary" />
                <p className="text-lg font-medium mb-2">{t("email")}</p>
                <a href="mailto:lifeguard.team@example.com" className="text-primary hover:underline text-lg">
                  lifeguard.team@example.com
                </a>
              </div>

              <form className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Input placeholder="Your Name" />
                  <Input type="email" placeholder={t("emailPlaceholder")} />
                </div>
                <Input placeholder="Subject" />
                <Textarea placeholder="Your Message" rows={6} />
                <Button type="submit" className="w-full">
                  <Send className="w-4 h-4 mr-2" />
                  {t("sendMessage")}
                </Button>
              </form>
            </CardContent>
          </Card>
        </AnimatedSection>
      </div>
    </div>
  )
}
