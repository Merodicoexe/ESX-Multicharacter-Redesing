"use client"

import React from "react"
import { useState } from "react"
import { Plus } from "lucide-react"
import type { Character, Locale } from "../types/Character"
import CharacterCard from "./CharacterCard"
import CharacterInfo from "./CharacterInfo"
import { fetchNui } from "../utils/fetchNui"

interface CharacterSelectionProps {
  initialCharacters: Character[]
  Candelete: boolean
  MaxAllowedSlot: number
  locale: Locale
}

const CharacterSelection: React.FC<CharacterSelectionProps> = ({
  initialCharacters,
  Candelete,
  MaxAllowedSlot,
  locale,
}) => {
  const [characters, setCharacters] = useState<Character[]>(initialCharacters)
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(
    characters.find((char) => char.isActive) || null,
  )

  const handleSelectCharacter = (id: string) => {
    if (selectedCharacter?.id === id) return

    const updatedCharacters = characters.map((char) => ({
      ...char,
      isActive: char.id === id,
    }))

    setCharacters(updatedCharacters)
    setSelectedCharacter(updatedCharacters.find((char) => char.id === id) || null)
    fetchNui("SelectCharacter", { id: id })
  }

  const PlayCharacter = () => {
    fetchNui("PlayCharacter")
  }

  const handleCreateCharacter = () => {
    fetchNui("CreateCharacter")
  }

  const handleDeleteCharacter = (id: string) => {
    const updatedCharactersRaw = characters.filter((char) => char.id !== id)

    fetchNui("DeleteCharacter")

    if (updatedCharactersRaw.length > 0) {
      const updatedCharacters = updatedCharactersRaw.map((char, index) => ({
        ...char,
        isActive: index === 0,
      }))

      setCharacters(updatedCharacters)
      setSelectedCharacter(updatedCharacters[0])
    } else {
      setCharacters([])
      setSelectedCharacter(null)
      handleCreateCharacter()
    }
  }

  const allSlots = [...characters]
  const emptySlots = MaxAllowedSlot - characters.length
  for (let i = 0; i < emptySlots; i++) {
    allSlots.push(null as any)
  }

  return (
    <div className="h-screen bg-background text-foreground flex flex-col animate-slideIn relative">
      <div className="absolute top-12 left-1/2 -translate-x-1/2">
        <div className="bg-card border-2 border-primary rounded-xl px-12 py-5 shadow-lg shadow-primary/20">
          <h1 className="text-3xl font-bold text-card-foreground tracking-wide uppercase">{locale.select_character}</h1>
        </div>
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
        <div className="flex items-center gap-6">
          {allSlots.map((character, index) => (
            <React.Fragment key={character?.id || `empty-${index}`}>
              {character ? (
                <CharacterCard
                  character={character}
                  onSelect={handleSelectCharacter}
                  onDelete={handleDeleteCharacter}
                  isAllowedtoDelete={Candelete}
                  showInfo={false}
                  PlayCharacter={PlayCharacter}
                  locale={locale}
                />
              ) : (
                <button
                  className="w-[280px] h-[120px] rounded-lg border-2 border-dashed border-border hover:border-primary bg-card hover:bg-card/80 flex items-center justify-center gap-3 text-muted-foreground hover:text-primary transition-all"
                  onClick={handleCreateCharacter}
                >
                  <Plus size={24} />
                  <span className="font-medium text-lg">{locale.create_character}</span>
                </button>
              )}
              {index < allSlots.length - 1 && <div className="h-24 w-px bg-border mx-2" />}
            </React.Fragment>
          ))}
        </div>
      </div>

      {selectedCharacter && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 pr-8">
          <CharacterInfo character={selectedCharacter} locale={locale} />
        </div>
      )}
    </div>
  )
}

export default CharacterSelection
