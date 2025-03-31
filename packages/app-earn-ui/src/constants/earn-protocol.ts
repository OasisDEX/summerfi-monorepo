import { SDKNetwork } from '@summerfi/app-types'
import dayjs from 'dayjs'

export const SUMR_CAP = 1000000000
export const RAYS_TO_SUMR_CONVERSION_RATE = 2.26 // 1 RAY = 2.26 SUMR

export const networkWarnings: {
  [key in SDKNetwork]?: {
    message: string
    enabled: boolean
  }
} = {
  [SDKNetwork.SonicMainnet]: {
    message: 'Sonic is a new network. It has been live for less than 6 months.',
    enabled: dayjs().isBefore(dayjs('2024-12-18').add(6, 'months')),
  },
}
