import Link from 'next/link'

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
    description: (
      <>
        Founder and CEO with a passion for making DeFi <Link href="">accessible to everyone</Link>.
      </>
    ),
    socialLinks: {
      twitter: '#',
      linkedin: '#',
    },
  },
  {
    image: andreiImage,
    name: 'Andrei David',
    role: 'CTO',
    description: (
      <>Blockchain guy with years of experience in building decentralized applications.</>
    ),
    socialLinks: {
      twitter: '#',
      linkedin: '#',
    },
  },
  {
    image: anthonyImage,
    name: 'Anthony Fernandez',
    role: 'Head of business development',
    description: (
      <>Business development native specializing in DeFi partnerships and growth initiatives.</>
    ),
    socialLinks: {
      twitter: '#',
      linkedin: '#',
    },
  },
  {
    image: joeImage,
    name: 'Joe Clark',
    role: 'CFO',
    description: (
      <>Financial expert with a deep understanding of DeFi markets and investment strategies.</>
    ),
    socialLinks: {
      twitter: '#',
      linkedin: '#',
    },
  },
  {
    image: jordanImage,
    name: 'Jordan Jackson',
    role: 'Product Lead',
    description: (
      <>Product manager with a focus on user experience and product innovation in DeFi.</>
    ),
    socialLinks: {
      twitter: '#',
      linkedin: '#',
    },
  },
  {
    image: konradImage,
    name: 'Konrad Kloch',
    role: 'Smart Contract Engineer',
    description: <>Smart contract engineer building secure blockchain solutions.</>,
    socialLinks: {
      twitter: '#',
      linkedin: '#',
    },
  },
]
