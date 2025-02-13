import { type SDKNetwork } from '@summerfi/app-types'
import { redirect } from 'next/navigation'

const RedirectToVaultDetails = async (
  props: {
    params: Promise<{
      network: SDKNetwork
      vaultId: string
    }>
  }
) => {
  const params = await props.params;
  const { network, vaultId } = params

  // redirect to vault position page
  redirect(`/${network.toLowerCase()}/position/${vaultId}`)
}

export default RedirectToVaultDetails
