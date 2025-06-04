"use client"

import { TeamCard } from "@/components/team-card"
import { AnimatedSection } from "@/components/animated-section"
import { useLanguage } from "@/contexts/language-context"

export default function AboutPage() {
  const { t } = useLanguage()

  const teamMembers = [
    { name: "MW", role: t("backEndDeveloper"), initials: "MW" },
    { name: "MF", role: t("uxuiDesigner"), initials: "MF" },
    { name: "MN", role: t("frontEndDeveloper"), initials: "MN" },
    { name: "MAW", role: t("frontEndDeveloper"), initials: "MAW" },
    { name: "MAL", role: t("applicationDeveloper"), initials: "MAL" },
    { name: "AA", role: t("arduinoDeveloper"), initials: "AA" },
    { name: "AR", role: t("frontEndDeveloper"), initials: "AR" },
    { name: "AM", role: t("arduinoDeveloper"), initials: "AM" },
  ]

  return (
    <div className="container mx-auto px-4 py-24">
      <AnimatedSection className="text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl mb-4">{t("aboutTitle")}</h1>
        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">{t("aboutDescription")}</p>
      </AnimatedSection>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {teamMembers.map((member, index) => (
          <TeamCard key={member.name} member={member} index={index} />
        ))}
      </div>
    </div>
  )
}
