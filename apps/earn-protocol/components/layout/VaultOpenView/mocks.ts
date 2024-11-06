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
