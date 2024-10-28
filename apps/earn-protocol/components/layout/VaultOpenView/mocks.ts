import { type UserActivityRawData } from '@/components/organisms/UserActivity/UserActivity'
import { type VaultExposureRawData } from '@/components/organisms/VaultExposure/VaultExposure'

export const vaultExposureRawData: VaultExposureRawData[] = [
  {
    vault: {
      label: 'MKR Blended',
      primaryToken: 'USDC',
      secondaryToken: 'DAI',
    },
    allocation: '0.32',
    currentApy: '0.103',
    liquidity: '43000000',
    type: 'Fixed yield',
  },
  {
    vault: {
      label: 'MKR Blended',
      primaryToken: 'USDC',
      secondaryToken: 'DAI',
    },
    allocation: '0.32',
    currentApy: '0.103',
    liquidity: '43000000',
    type: 'Isolated landing',
  },
  {
    vault: {
      label: 'MKR Blended',
      primaryToken: 'USDC',
      secondaryToken: 'DAI',
    },
    allocation: '0.32',
    currentApy: '0.103',
    liquidity: '43000000',
    type: 'Lending',
  },
  {
    vault: {
      label: 'MKR Blended',
      primaryToken: 'USDC',
      secondaryToken: 'DAI',
    },
    allocation: '0.32',
    currentApy: '0.103',
    liquidity: '43000000',
    type: 'Basic Trading',
  },
]

export const userActivityRawData: UserActivityRawData[] = [
  {
    balance: '120000',
    amount: '123123',
    numberOfDeposits: '13',
    time: '1727385013506',
    earningStreak: {
      link: '/',
      label: 'View',
    },
  },
  {
    balance: '1420000',
    amount: '321321',
    numberOfDeposits: '9',
    time: '1727585013506',
    earningStreak: {
      link: '/',
      label: 'View',
    },
  },
]

export const detailsLinks = [
  {
    label: 'How it all works',
    id: 'how-it-works',
  },
  {
    label: 'Advanced yield data',
    id: 'advanced-yield-data',
  },
  {
    label: 'Yield sources',
    id: 'yield-sources',
  },
  {
    label: 'Security',
    id: 'security',
  },
  {
    label: 'FAQ',
    id: 'faq',
  },
]
