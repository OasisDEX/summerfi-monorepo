import { type TeamListItem } from '@/app/team/types'

import andreiImage from '@/public/img/team/andrei.png'
import anthonyImage from '@/public/img/team/anthony.png'
import chrisImage from '@/public/img/team/chris.png'
import joeImage from '@/public/img/team/joe.png'
import jordanImage from '@/public/img/team/jordan.png'

export const teamList: TeamListItem[] = [
  {
    image: chrisImage,
    name: 'Chris Bradbury',
    role: 'CEO',
    socialLinks: {
      twitter: 'https://x.com/chrisbducky',
      linkedin: 'https://www.linkedin.com/in/chris-bradbury-summer',
    },
  },
  {
    image: andreiImage,
    name: 'Andrei David',
    role: 'CTO',
    socialLinks: {
      twitter: 'https://x.com/AndreiDavid',
      linkedin: 'https://www.linkedin.com/in/andreidavid',
    },
  },
  {
    image: anthonyImage,
    name: 'Anthony Fernandez',
    role: 'Head of business development',
    socialLinks: {
      linkedin: 'https://www.linkedin.com/in/anthony-fernandez-36a732a6',
    },
  },
  {
    image: joeImage,
    name: 'Joe Clark',
    role: 'CFO',
    socialLinks: {
      linkedin: 'https://www.linkedin.com/in/joe-clark-215a226',
    },
  },
  {
    image: jordanImage,
    name: 'Jordan Jackson',
    role: 'Product Lead',
    socialLinks: {
      twitter: 'https://x.com/samehueasyou',
      linkedin: 'https://www.linkedin.com/company/summerfi/',
    },
  },
]
