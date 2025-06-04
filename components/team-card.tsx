"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { User } from "lucide-react"

interface TeamMember {
  name: string
  role: string
  initials: string
}

interface TeamCardProps {
  member: TeamMember
  index: number
}

export function TeamCard({ member, index }: TeamCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <Card className="h-full hover:shadow-lg transition-shadow duration-300">
        <CardContent className="p-6 text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
            <User className="w-10 h-10 text-primary" />
          </div>
          <h3 className="font-semibold text-lg mb-2">{member.name}</h3>
          <Badge variant="secondary" className="text-sm">
            {member.role}
          </Badge>
        </CardContent>
      </Card>
    </motion.div>
  )
}
