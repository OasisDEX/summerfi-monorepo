import { type TeamListItem } from '@/app/team/types'

import andreiImage from '@/public/img/team/andrei.png'
import anthonyImage from '@/public/img/team/anthony.png'
import chrisImage from '@/public/img/team/chris.png'
import joeImage from '@/public/img/team/joe.png'
import jordanImage from '@/public/img/team/jordan.png'
import konradImage from '@/public/img/team/konrad.png'

export const teamList: TeamListItem[] = [
  {
    image: chrisImage,
    name: 'Chris Bradbury',
    role: 'CEO',
    socialLinks: {
      twitter: '#',
      linkedin: '#',
    },
  },
  {
    image: andreiImage,
    name: 'Andrei David',
    role: 'CTO',
    socialLinks: {
      twitter: '#',
      linkedin: '#',
    },
  },
  {
    image: anthonyImage,
    name: 'Anthony Fernandez',
    role: 'Head of business development',
    socialLinks: {
      twitter: '#',
      linkedin: '#',
    },
  },
  {
    image: joeImage,
    name: 'Joe Clark',
    role: 'CFO',
    socialLinks: {
      twitter: '#',
      linkedin: '#',
    },
  },
  {
    image: jordanImage,
    name: 'Jordan Jackson',
    role: 'Product Lead',
    socialLinks: {
      twitter: '#',
      linkedin: '#',
    },
  },
  {
    image: konradImage,
    name: 'Konrad Kloch',
    role: 'Smart Contract Engineer',
    socialLinks: {
      twitter: '#',
      linkedin: '#',
    },
  },
]
