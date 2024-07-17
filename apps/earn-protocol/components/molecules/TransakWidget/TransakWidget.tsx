import { useChain, useSmartAccountClient, useUser } from '@alchemy/aa-alchemy/react'
import { Button } from '@summerfi/app-ui'

import { accountType } from '@/providers/AlchemyAccountsProvider/config'
import { getTransakConfig } from '@/transak/config'

export const TransakWidget = () => {
  // eventually account-kit client, or EOA
  const { client } = useSmartAccountClient({
    type: accountType,
  })
  const { chain } = useChain()
  const user = useUser()

  if (!client) {
    return null
  }

  const handleOpen = () => {
    const transak = getTransakConfig({
      config: {
        walletAddress: client.account.address,
        network: chain.name.toLowerCase(),
        email: user?.email,
      },
    })

    transak.init()
  }

  return (
    <Button variant="primarySmall" onClick={handleOpen} style={{ width: 'fit-content' }}>
      Transak On/Off-Ramp
    </Button>
  )
}
