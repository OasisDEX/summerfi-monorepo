import { type SDKVaultishType } from '@summerfi/app-types'

import { type GetInterestRatesReturnType } from '@/app/server-handlers/interest-rates'

export const decorateWithArkInterestRatesData = (
  vaults: SDKVaultishType[],
  arkInterestRatesMap: GetInterestRatesReturnType,
) => {
  return vaults.map((vault) => ({
    ...vault,
    customFields: {
      ...vault.customFields,
      arksInterestRates: Object.fromEntries(
        Object.keys(arkInterestRatesMap).map((key) => [
          key,
          arkInterestRatesMap[key].latestInterestRate[0]?.rate[0]?.rate,
        ]),
      ),
    },
  })) as SDKVaultishType[]
}
