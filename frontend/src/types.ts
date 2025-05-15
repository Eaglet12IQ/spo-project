export interface User {
  id: number
  username: string
  email: string
}

export interface Profile {
  id: number
  username: string
  avatar_url: string
  country: string
  first_name: string
  last_name: string
  middle_name: string
  collections: Collection[]
}

export interface Stamp {
  id: string
  name: string
  country: string
  year: number
  image_url: string
}

export interface StampFilter {
  search: string
  country: string
  yearFrom: number | null
  yearTo: number | null
  themes: string[]
  rarity: string
}

export interface Collection {
  id: string
  name: string
  description: string
  photo_url: string
}

export interface Collector {
  id: string
  username: string
  name: string
  avatar: string
  bio: string
  location: string
  memberSince: string
  collectionCount: number
  stampCount: number
  specialties: string[]
  following: number
  followers: number
  featured: boolean
}