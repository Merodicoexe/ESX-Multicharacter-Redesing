"use client"

import type React from "react"
import { Calendar, User2, Briefcase } from "lucide-react"
import type { Character, Locale } from "../types/Character"

interface CharacterInfoProps {
  character: Character
  locale: Locale
}

const CharacterInfo: React.FC<CharacterInfoProps> = ({ character, locale }) => {
  if (!character) return null

  return (
    <div className="animate-slideDown">
      <div className="bg-card rounded-xl p-6 border-2 border-primary shadow-2xl shadow-primary/20 w-80">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold">{character.name}</h2>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3 p-4 bg-secondary rounded-lg">
            <Calendar className="text-muted-foreground flex-shrink-0" size={20} />
            <span className="text-sm font-medium">{character.birthDate}</span>
          </div>

          <div className="flex items-center gap-3 p-4 bg-secondary rounded-lg">
            <User2 className="text-muted-foreground flex-shrink-0" size={20} />
            <span className="text-sm font-medium">{character.gender}</span>
          </div>

          <div className="flex items-center gap-3 p-4 bg-secondary rounded-lg">
            <Briefcase className="text-muted-foreground flex-shrink-0" size={20} />
            <span className="text-sm font-medium">{character.occupation}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CharacterInfo
