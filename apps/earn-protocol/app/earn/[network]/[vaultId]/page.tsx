import { type SDKNetwork } from '@summerfi/app-types'
import { redirect } from 'next/navigation'

const RedirectToVaultDetails = ({
  params,
}: {
  params: {
    network: SDKNetwork
    vaultId: string
  }
}) => {
  const { network, vaultId } = params

  // redirect to vault position page
  redirect(`/earn/${network.toLowerCase()}/position/${vaultId}`)
}

export default RedirectToVaultDetails
