import { useCallback, useMemo } from 'react'
import { useChain, useUser } from '@account-kit/react'
import { useUserWallet } from '@summerfi/app-earn-ui'
import { type EarnProtocolTransactionEventProps } from '@summerfi/app-types'
import { debounce } from 'lodash-es'
import { usePathname } from 'next/navigation'

import { EarnProtocolEvents } from '@/helpers/mixpanel'

export const useHandleTooltipOpenEvent = () => {
  const pathname = usePathname()
  const user = useUser()
  const { userWalletAddress: walletAddress, isLoadingAccount } = useUserWallet()
  const { chain } = useChain()

  const userData = !isLoadingAccount
    ? { walletAddress, connectionMethod: user?.type, network: chain.name }
    : {}

  return debounce((tooltipName: string) => {
    EarnProtocolEvents.tooltipHovered({
      page: pathname,
      tooltipName: `ep-${tooltipName}`,
      ...userData,
    })
  }, 500)
}

export const useHandleButtonClickEvent = () => {
  const pathname = usePathname()
  const user = useUser()
  const { userWalletAddress: walletAddress, isLoadingAccount } = useUserWallet()
  const { chain } = useChain()

  const userData = !isLoadingAccount
    ? { walletAddress, connectionMethod: user?.type, network: chain.name }
    : {}

  return debounce((buttonName: string) => {
    EarnProtocolEvents.buttonClicked({
      page: pathname,
      buttonName: `ep-${buttonName}`,
      ...userData,
    })
  }, 500)
}

export const useHandleTransactionEvent = () => {
  const pathname = usePathname()
  const user = useUser()
  const { userWalletAddress: walletAddress, isLoadingAccount } = useUserWallet()
  const { chain } = useChain()

  const userData = !isLoadingAccount
    ? { walletAddress, connectionMethod: user?.type, network: chain.name }
    : {}

  return debounce(
    ({
      transactionType,
      txEvent,
      vaultSlug,
      txHash,
      result,
    }: {
      transactionType: EarnProtocolTransactionEventProps['transactionType']
      vaultSlug?: EarnProtocolTransactionEventProps['vaultSlug']
      txHash?: EarnProtocolTransactionEventProps['txHash']
      result?: EarnProtocolTransactionEventProps['result']
      txEvent:
        | 'transactionSimulated'
        | 'transactionSubmitted'
        | 'transactionConfirmed'
        | 'transactionSuccess'
        | 'transactionFailure'
    }) => {
      const eventHandler = EarnProtocolEvents[txEvent]

      eventHandler({
        page: pathname,
        transactionType,
        vaultSlug,
        txHash,
        result,
        ...userData,
      })
    },
    500,
  )
}

export const useHandleDropdownChangeEvent = () => {
  const pathname = usePathname()
  const user = useUser()
  const { userWalletAddress: walletAddress, isLoadingAccount } = useUserWallet()
  const { chain } = useChain()

  const userData = useMemo(() => {
    return !isLoadingAccount
      ? { walletAddress, connectionMethod: user?.type, network: chain.name }
      : {}
  }, [chain.name, isLoadingAccount, user?.type, walletAddress])

  const handleEvent = useCallback(
    ({ inputName, value }: { inputName: string; value: string }) => {
      EarnProtocolEvents.dropdownChanged({
        page: pathname,
        dropdownName: `ep-${inputName}`,
        value,
        ...userData,
      })
    },
    [pathname, userData],
  )

  return useMemo(() => debounce(handleEvent, 500), [handleEvent])
}

export const useHandleInputChangeEvent = () => {
  const pathname = usePathname()
  const user = useUser()
  const { userWalletAddress: walletAddress, isLoadingAccount } = useUserWallet()
  const { chain } = useChain()

  const userData = useMemo(() => {
    return !isLoadingAccount
      ? { walletAddress, connectionMethod: user?.type, network: chain.name }
      : {}
  }, [chain.name, isLoadingAccount, user?.type, walletAddress])

  const handleEvent = useCallback(
    ({ inputName, value }: { inputName: string; value: string }) => {
      EarnProtocolEvents.inputChanged({
        page: pathname,
        inputName: `ep-${inputName}`,
        value,
        ...userData,
      })
    },
    [pathname, userData],
  )

  return useMemo(() => debounce(handleEvent, 500), [handleEvent])
}
