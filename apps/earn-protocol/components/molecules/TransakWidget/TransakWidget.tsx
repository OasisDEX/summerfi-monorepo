import { useChain, useUser } from '@account-kit/react'
import { Button } from '@summerfi/app-ui'

import { getTransakConfig } from '@/transak/config'

export const TransakWidget = () => {
  const { chain } = useChain()
  const user = useUser()

  if (!user) {
    return null
  }

  const handleOpen = () => {
    const transak = getTransakConfig({
      config: {
        walletAddress: user.address,
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
