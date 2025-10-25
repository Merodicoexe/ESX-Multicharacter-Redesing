export interface Character {
  id: string
  name: string
  birthDate: string
  gender: "MALE" | "FEMALE"
  occupation: string
  isActive?: boolean
  disabled?: boolean
  bannedUntil?: number
}

export interface Locale {
  char_info_title: string
  play: string
  title: string
  create_character: string
  delete_character: string
  select_character: string
}
