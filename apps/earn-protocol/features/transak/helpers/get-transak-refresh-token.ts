import { transakPublicApiKey } from '@/features/transak/consts'
import { type TransakRefreshTokenResponse } from '@/features/transak/types'

export const getTransakRefreshToken = async (): Promise<
  TransakRefreshTokenResponse | undefined
> => {
  try {
    const response = await fetch(`/api/transak/refresh-token?partnerApiKey=${transakPublicApiKey}`)

    return await response.json()
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to generate transak access token', error)

    return undefined
  }
}
