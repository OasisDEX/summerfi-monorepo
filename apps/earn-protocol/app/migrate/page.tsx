import { type SDKNetwork } from '@summerfi/app-types'
import { aggregateArksPerNetwork, parseServerResponseToClient } from '@summerfi/app-utils'

import { getInterestRates } from '@/app/server-handlers/interest-rates'
import { getVaultsList } from '@/app/server-handlers/sdk/get-vaults-list'
import systemConfigHandler from '@/app/server-handlers/system-config'
import { MigrateLandingPageView } from '@/components/layout/MigrateLandingPageView/MigrateLandingPageView'
import { decorateCustomVaultFields } from '@/helpers/vault-custom-value-helpers'

const MigrateLandingPage = async () => {
  const [{ vaults }, configRaw] = await Promise.all([getVaultsList(), systemConfigHandler()])
  const { config: systemConfig } = parseServerResponseToClient(configRaw)

  const aggregatedArksPerNetwork = aggregateArksPerNetwork(vaults)

  const interestRatesPromises = Object.entries(aggregatedArksPerNetwork).map(
    ([network, { arks }]) =>
      getInterestRates({
        network: network as SDKNetwork,
        arksList: arks,
        justLatestRates: true,
      }),
  )

  const interestRatesResults = await Promise.all(interestRatesPromises)

  const vaultsDecorated = decorateCustomVaultFields({
    vaults,
    systemConfig,
    decorators: {
      arkInterestRatesMap: interestRatesResults.reduce((acc, curr) => {
        return { ...acc, ...curr }
      }, {}),
    },
  })

  return <MigrateLandingPageView vaultsList={vaultsDecorated} />
}

export default MigrateLandingPage
