import { type ReactNode } from 'react'
import { type StaticImageData } from 'next/image'

export type TeamListItem = {
  image: StaticImageData
  name: string
  role: string
  description: ReactNode
  socialLinks?: {
    twitter?: string
    linkedin?: string
  }
}
