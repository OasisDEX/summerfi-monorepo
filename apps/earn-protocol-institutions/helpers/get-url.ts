import { type SDKVaultishType } from '@summerfi/app-types'
import { sdkNetworkToHumanNetwork, supportedSDKNetwork } from '@summerfi/app-utils'

export const getInstitutionVaultUrl = ({
  institutionId,
  vault,
  page,
}: {
  institutionId: string
  vault: SDKVaultishType
  page?: string
}): string => {
  return `/${institutionId}/vaults/${sdkNetworkToHumanNetwork(
    supportedSDKNetwork(vault.protocol.network),
  )}/${vault.id}/${page ?? 'overview'}`
}
export const getInstitutionUrl = ({
  institutionId,
  tab,
}: {
  institutionId: string
  tab?: string
}): string => {
  return `/${institutionId}/${tab ?? 'overview'}`
}
