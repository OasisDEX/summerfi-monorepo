import { SupportedSDKNetworks } from '@summerfi/app-types'
import dayjs from 'dayjs'

export const SUMR_CAP = 1000000000

export const networkWarnings: {
  [key in SupportedSDKNetworks]?: {
    message: string
    enabled: boolean
  }
} = {
  [SupportedSDKNetworks.SonicMainnet]: {
    message: 'Sonic is a new network. It has been live for less than 6 months.',
    enabled: dayjs().isBefore(dayjs('2024-12-18').add(6, 'months')),
  },
}
