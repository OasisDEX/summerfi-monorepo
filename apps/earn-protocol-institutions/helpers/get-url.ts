import { type SDKVaultishType } from '@summerfi/app-types'
import { sdkNetworkToHumanNetwork, supportedSDKNetwork } from '@summerfi/app-utils'

export const getInstitutionVaultUrl = ({
  institutionName,
  vault,
  page,
}: {
  institutionName: string
  vault: SDKVaultishType
  page?: string
}): string => {
  return `/${institutionName}/vaults/${sdkNetworkToHumanNetwork(
    supportedSDKNetwork(vault.protocol.network),
  )}/${vault.id}/${page ?? 'overview'}`
}
export const getInstitutionUrl = ({
  institutionName,
  tab,
}: {
  institutionName: string
  tab?: string
}): string => {
  return `/${institutionName}/${tab ?? 'overview'}`
}
