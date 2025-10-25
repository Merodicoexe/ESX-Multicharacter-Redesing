"use client"

import type React from "react"
import { useState, useEffect } from "react"
import type { Character, Locale } from "../types/Character"
import { User, Play, Trash2 } from "lucide-react"

interface CharacterCardProps {
  character: Character
  onSelect: (id: string) => void
  showInfo: boolean
  PlayCharacter: () => void
  onDelete: (id: string) => void
  isAllowedtoDelete: boolean
  locale: Locale
}

const CharacterCard: React.FC<CharacterCardProps> = ({
  character,
  onSelect,
  PlayCharacter,
  onDelete,
  isAllowedtoDelete,
  locale,
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(0)

  useEffect(() => {
    if (character.bannedUntil) {
      const updateTimer = () => {
        const now = Math.floor(Date.now() / 1000)
        const remaining = Math.max(0, Math.ceil((character.bannedUntil! - now) / 60))
        setTimeLeft(remaining)
      }

      updateTimer()
      const interval = setInterval(updateTimer, 1000)

      return () => clearInterval(interval)
    }
  }, [character.bannedUntil])

  const isBanned = character.bannedUntil && timeLeft > 0

  return (
    <div
      className={`
        w-[280px] group relative rounded-lg overflow-hidden transition-all cursor-pointer
        ${
          character.isActive
            ? "bg-card border-2 border-primary shadow-lg shadow-primary/20 h-[140px]"
            : "bg-card border-2 border-border hover:border-primary/50 h-[120px]"
        }
        ${isBanned ? "opacity-60" : ""}
      `}
      onClick={() => !isBanned && onSelect(character.id)}
    >
      <div className="p-5 h-full flex flex-col">
        <div className="flex items-center gap-4 mb-4">
          <div
            className={`
            flex items-center justify-center w-14 h-14 rounded-lg flex-shrink-0
            ${character.isActive ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}
          `}
          >
            <User size={28} />
          </div>

          <div className="flex-1 min-w-0">
            <h3
              className={`
              font-semibold text-lg truncate
              ${character.isActive ? "text-card-foreground" : "text-muted-foreground group-hover:text-card-foreground"}
            `}
            >
              {character.name}
            </h3>
            {isBanned && <p className="text-xs text-red-500 mt-1">Zabanováno na {timeLeft} min</p>}
          </div>
        </div>

        {character.isActive && (
          <div className="flex gap-3 mt-auto">
            <button
              className={`
                flex-1 h-12 rounded-lg flex items-center justify-center gap-2 transition-all font-medium text-base
                ${
                  character.disabled || isBanned
                    ? "bg-secondary text-muted-foreground cursor-not-allowed"
                    : "bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95"
                }
              `}
              onClick={(e) => {
                e.stopPropagation()
                if (!isBanned) PlayCharacter()
              }}
              disabled={character.disabled || isBanned}
            >
              <Play size={18} fill="currentColor" />
              <span>{locale.play}</span>
            </button>
            {isAllowedtoDelete && !isBanned && (
              <button
                className="w-12 h-12 rounded-lg bg-secondary text-card-foreground hover:bg-red-500 hover:text-white flex items-center justify-center transition-all active:scale-95"
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(character.id)
                }}
                title={locale.delete_character}
              >
                <Trash2 size={20} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default CharacterCard
