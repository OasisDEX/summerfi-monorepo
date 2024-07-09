import type { WidgetConfig } from '@lifi/widget'

import { networksList } from '@/constants/networks-list-ssr'

export const swapWidgetConfig: WidgetConfig = {
  integrator: 'Summer.fi',
  containerStyle: {
    border: 'none',
    height: '100%',
    maxHeight: '100%',
  },
  appearance: 'light',
  variant: 'default',
  subvariant: 'split',
  theme: {
    palette: {
      background: {
        default: '#fff',
        paper: '#fff',
      },
      primary: {
        main: '#17344f',
      },
    },
    shape: {
      borderRadius: '8px',
      borderRadiusSecondary: '32px',
    },
  },
  hiddenUI: ['walletMenu', 'appearance', 'poweredBy', 'toAddress'],
  chains: {
    allow: networksList.map((network) => network.id),
  },
  bridges: {
    deny: ['polygon', 'omni', 'gnosis', 'hyphen', 'multichain'],
  },
  fee: 0.002,
}
