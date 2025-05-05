export interface User {
  id: string
  username: string
  email: string
  name: string
  avatar: string
  bio: string
  location: string
  memberSince: string
  collectionCount: number
  stampCount: number
  following: number
  followers: number
}

export interface Stamp {
  id: string
  title: string
  image: string
  country: string
  year: number
  denomination: string
  color: string
  condition: string
  description: string
  rarity: string
  themes: string[]
  dimensions: string
  perforations: string
  catalogNumber: string
  estimatedValue: number
  collectionId: string
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
  title: string
  description: string
  coverImage: string
  ownerId: string
  createdAt: string
  updatedAt: string
  isPublic: boolean
  theme: string
  stampCount: number
  featured: boolean
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