import { type SDKNetwork } from '@summerfi/app-types'
import { redirect } from 'next/navigation'

const RedirectToVaultDetails = async ({
  params,
}: {
  params: Promise<{
    network: SDKNetwork
    vaultId: string
  }>
}) => {
  const { network, vaultId } = await params

  // redirect to vault position page
  redirect(`/${network.toLowerCase()}/position/${vaultId}`)
}

export default RedirectToVaultDetails
