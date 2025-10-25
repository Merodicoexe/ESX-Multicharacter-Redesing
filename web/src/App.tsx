"use client"

import CharacterSelection from "./components/CharacterSelection"
import { useState, useEffect } from "react"
import { useNuiEvent } from "./utils/useNuiEvent"
import type { Character, Locale } from "./types/Character"
import { fetchNui } from "./utils/fetchNui"

function App() {
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const [characters, setCharacters] = useState<Character[]>([])
  const [Candelete, setCandelete] = useState<boolean>(false)
  const [MaxAllowedSlot, setMaxAllowedSlot] = useState<number>(0)
  const [locale, setLocale] = useState<Locale>({ char_info_title: "", play: "", title: "" })

  useEffect(() => {
    console.log("[v0] App mounted, sending nuiReady signal")
    fetchNui("nuiReady").catch((err) => {
      console.log("[v0] nuiReady error (expected in browser):", err)
    })
  }, [])

  useNuiEvent("ToggleMulticharacter", (data: any) => {
    console.log("[v0] ToggleMulticharacter event received:", data)
    if (data.show) {
      const validCharacters = data.Characters.filter((char: any) => char !== null)
      const parsedCharacters: Character[] = validCharacters.map((char: any, index: number) => ({
        id: char.id.toString(),
        name: `${char.firstname} ${char.lastname}`,
        birthDate: char.dateofbirth,
        gender: char.sex?.toUpperCase() === "MALE" ? "MALE" : "FEMALE",
        occupation: char.job,
        disabled: char.disabled,
        isActive: index === 0,
        bannedUntil: char.bannedUntil,
      }))

      setIsVisible(true)
      setCharacters(parsedCharacters)
      setCandelete(data.CanDelete)
      setMaxAllowedSlot(data.AllowedSlot)
      setLocale(data.Locale)
    } else {
      setIsVisible(false)
      setCharacters([])
    }
  })

  return (
    isVisible && (
      <CharacterSelection
        initialCharacters={characters}
        Candelete={Candelete}
        MaxAllowedSlot={MaxAllowedSlot}
        locale={locale}
      />
    )
  )
}

export default App
