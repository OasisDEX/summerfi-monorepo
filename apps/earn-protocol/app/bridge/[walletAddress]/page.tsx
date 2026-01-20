import { sumrNetApyConfigCookieName } from '@summerfi/app-earn-ui'
import { getServerSideCookies, safeParseJson } from '@summerfi/app-utils'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { getCachedConfig } from '@/app/server-handlers/cached/get-config'
import { getSumrBalances } from '@/app/server-handlers/sumr-balances'
import { getCachedSumrPrice } from '@/app/server-handlers/sumr-price'
import { BridgePageViewComponent } from '@/components/layout/BridgePageView/BridgePageViewComponent'
import { type BridgeExternalData } from '@/features/bridge/types'
import { getEstimatedSumrPrice } from '@/helpers/get-estimated-sumr-price'
import { isValidAddress } from '@/helpers/is-valid-address'

type BridgePageProps = {
  params: {
    walletAddress: string
  }
}

const BridgePage = async ({ params }: BridgePageProps) => {
  const [{ walletAddress }, cookieRaw, sumrPrice, config] = await Promise.all([
    params,
    cookies(),
    getCachedSumrPrice(),
    getCachedConfig(),
  ])

  if (!isValidAddress(walletAddress)) {
    redirect('/not-found')
  }
  const [sumrBalances] = await Promise.all([
    getSumrBalances({
      walletAddress,
    }),
  ])

  const externalData: BridgeExternalData = {
    sumrBalances,
  }

  const cookie = cookieRaw.toString()
  const sumrNetApyConfig = safeParseJson(getServerSideCookies(sumrNetApyConfigCookieName, cookie))
  const sumrPriceUsd = getEstimatedSumrPrice({
    config,
    sumrPrice,
    sumrNetApyConfig: sumrNetApyConfig ?? {},
  })

  return (
    <BridgePageViewComponent
      walletAddress={walletAddress}
      externalData={externalData}
      sumrPriceUsd={sumrPriceUsd}
    />
  )
}

export default BridgePage
