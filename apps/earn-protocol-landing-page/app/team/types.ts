import { type StaticImageData } from 'next/image'

export type TeamListItem = {
  image: StaticImageData
  name: string
  role: string
  socialLinks?: {
    twitter?: string
    linkedin?: string
  }
}
