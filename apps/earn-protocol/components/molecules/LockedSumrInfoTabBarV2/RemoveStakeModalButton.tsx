import { type ChangeEvent, type FC, useCallback, useMemo, useState } from 'react'
import { useChain } from '@account-kit/react'
import {
  Alert,
  Badge,
  Button,
  Card,
  Input,
  LoadingSpinner,
  MobileDrawer,
  Modal,
  SDKChainIdToAAChainMap,
  SkeletonLine,
  Text,
  useAmount,
  useMobileCheck,
  WithArrow,
} from '@summerfi/app-earn-ui'
import { NetworkIds, SupportedNetworkIds } from '@summerfi/app-types'
import { formatPercent } from '@summerfi/app-utils'
import BigNumber from 'bignumber.js'

import { PendingTransactionsList } from '@/components/molecules/PendingTransactionsList/PendingTransactionsList'
import { useDeviceType } from '@/contexts/DeviceContext/DeviceContext'
import { SUMR_DECIMALS } from '@/features/bridge/constants/decimals'
import { useUnstakeV2SumrTransaction } from '@/features/claim-and-delegate/hooks/use-unstake-sumr-transaction'
import { useHandleInputChangeEvent } from '@/hooks/use-mixpanel-event'

import removeStakeModalContentStyles from '@/components/molecules/LockedSumrInfoTabBarV2/LockedSumrInfoTabBarV2.module.css'

const percentageButtons = [0.25, 0.5, 0.75, 1]

const RemoveStakeModal: FC<{
  stakedAmount: bigint
  userWalletAddress?: string
  userStakeIndex: bigint
  refetchStakingData: () => Promise<void>
  handleOpenClose: () => void
  penaltyPercentage?: number
}> = ({
  stakedAmount,
  userWalletAddress,
  userStakeIndex,
  refetchStakingData,
  handleOpenClose,
  penaltyPercentage,
}) => {
  const { chain, setChain } = useChain()
  const inputChangeHandler = useHandleInputChangeEvent()

  const isCorrectNetwork = chain.id === SupportedNetworkIds.Base
  const { onBlur, onFocus, manualSetAmount, amountDisplay, amountRaw, amountParsed } = useAmount({
    tokenDecimals: SUMR_DECIMALS,
    initialAmount: new BigNumber(stakedAmount).div(new BigNumber(10).pow(SUMR_DECIMALS)).toFixed(2),
    inputChangeHandler,
    inputName: 'unstake-sumr-amount',
  })

  const {
    transactionQueue,
    triggerNextTransaction,
    isLoadingTransactions,
    isSendingTransaction,
    buttonLabel,
  } = useUnstakeV2SumrTransaction({
    amount: amountParsed.toString(),
    userAddress: userWalletAddress,
    userStakeIndex,
    refetchStakingData,
    onAllTransactionsComplete: handleOpenClose,
  })

  const handleInputChange = (ev: ChangeEvent<HTMLInputElement>) => {
    if (ev.target.value) {
      if (
        new BigNumber(ev.target.value).isGreaterThan(
          new BigNumber(stakedAmount).div(new BigNumber(10).pow(SUMR_DECIMALS)),
        )
      ) {
        manualSetAmount(
          new BigNumber(stakedAmount).div(new BigNumber(10).pow(SUMR_DECIMALS)).toFixed(2),
        )

        return
      }
      manualSetAmount(ev.target.value)
    } else {
      manualSetAmount('')
    }
  }

  const handleRemoveStake = useCallback(async () => {
    if (!isCorrectNetwork) {
      setChain({ chain: SDKChainIdToAAChainMap[SupportedNetworkIds.Base] })

      return
    }
    await triggerNextTransaction()
  }, [isCorrectNetwork, setChain, triggerNextTransaction])

  const receivedAmount = useMemo(() => {
    if (penaltyPercentage) {
      return new BigNumber(amountParsed)
        .minus(
          new BigNumber(
            new BigNumber(amountParsed)
              .multipliedBy(new BigNumber(penaltyPercentage).div(new BigNumber(100)))
              .toFixed(2),
          ),
        )
        .toFixed(2)
    }

    return amountParsed.toFixed(2)
  }, [amountParsed, penaltyPercentage])

  return (
    <Card variant="cardSecondary" style={{ maxWidth: '446px' }}>
      <div className={removeStakeModalContentStyles.removeStakeModalContent}>
        <Text
          as="h5"
          variant="h5"
          style={{ marginBottom: 'var(--general-space-20)', textAlign: 'center' }}
        >
          Remove stake #{userStakeIndex.toString()}
        </Text>
        <Text variant="p3" style={{ textAlign: 'center' }}>
          Enter the amount of $SUMR you wish to unstake.
        </Text>
        <Text variant="p3" style={{ marginBottom: 'var(--general-space-20)', textAlign: 'center' }}>
          You can unstake up to{' '}
          <strong>
            {new BigNumber(stakedAmount).div(new BigNumber(10).pow(SUMR_DECIMALS)).toFixed(2)}{' '}
            $SUMR.
          </strong>
        </Text>
        <Input
          placeholder="0.00"
          variant="dark"
          inputWrapperStyles={{
            textAlign: 'center',
          }}
          value={amountDisplay}
          onChange={handleInputChange}
          onFocus={onFocus}
          onBlur={onBlur}
        />
        <div className={removeStakeModalContentStyles.percentageButtons}>
          {percentageButtons.map((item) => (
            <Badge
              value={`${item * 100}%`}
              key={item}
              disabled={isLoadingTransactions || isSendingTransaction}
              onClick={() => {
                const calculatedValue = new BigNumber(stakedAmount)
                  .div(new BigNumber(10).pow(SUMR_DECIMALS))
                  .multipliedBy(item)
                  .toFixed(2)

                manualSetAmount(calculatedValue)
              }}
              isActive={
                amountRaw ===
                new BigNumber(stakedAmount)
                  .div(new BigNumber(10).pow(SUMR_DECIMALS))
                  .multipliedBy(item)
                  .toFixed(2)
              }
            />
          ))}
        </div>
        {penaltyPercentage ? (
          <Alert
            variant="warning"
            noIcon
            error={
              <>
                Unstaking before the lock period ends will incur a penalty of{' '}
                {penaltyPercentage ? `${formatPercent(penaltyPercentage, { precision: 2 })}` : ''}.
                You will receive ~{receivedAmount}&nbsp;$SUMR.
              </>
            }
          />
        ) : null}
        {transactionQueue && !isLoadingTransactions ? (
          <PendingTransactionsList
            chainId={NetworkIds.BASEMAINNET}
            transactions={transactionQueue}
            style={{
              marginTop: '2px',
            }}
          />
        ) : (
          <SkeletonLine
            width="100%"
            height="26px"
            style={{
              margin: '13px 0 16px 0',
            }}
          />
        )}
        <Button
          variant="primarySmall"
          style={{ marginTop: '8px' }}
          disabled={isLoadingTransactions || isSendingTransaction || !transactionQueue}
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          onClick={
            isLoadingTransactions || isSendingTransaction || !transactionQueue
              ? undefined
              : handleRemoveStake
          }
        >
          {!buttonLabel || isSendingTransaction ? <LoadingSpinner /> : buttonLabel}
        </Button>
      </div>
    </Card>
  )
}

export const RemoveStakeModalButton: FC<{
  amount: bigint
  userWalletAddress?: string
  userStakeIndex: bigint
  refetchStakingData: () => Promise<void>
  penaltyPercentage?: number
}> = ({ amount, userWalletAddress, userStakeIndex, refetchStakingData, penaltyPercentage }) => {
  const { isSettingChain } = useChain()
  const { deviceType } = useDeviceType()
  const { isMobileOrTablet } = useMobileCheck(deviceType)
  const [isOpen, setIsOpen] = useState(false)

  const handleOpenClose = useCallback(() => {
    setIsOpen((prev) => !prev)
  }, [])

  const button = useMemo(() => {
    if (!userWalletAddress) {
      return (
        <Button variant="unstyled" style={{ pointerEvents: 'none' }}>
          <WithArrow
            variant="p4semi"
            style={{ marginRight: '8px', color: 'var(--color-text-primary-disabled)' }}
          >
            Remove stake
          </WithArrow>
        </Button>
      )
    }

    if (isSettingChain) {
      return (
        <Button variant="unstyled" disabled>
          <Text as="p" variant="p4semi" style={{ color: 'var(--earn-protocol-primary-100)' }}>
            <LoadingSpinner size={18} />
          </Text>
        </Button>
      )
    }

    return (
      <Button variant="unstyled" onClick={handleOpenClose}>
        <WithArrow variant="p4semi" style={{ marginRight: '8px' }}>
          Remove stake
        </WithArrow>
      </Button>
    )
  }, [handleOpenClose, isSettingChain, userWalletAddress])

  return (
    <>
      {button}
      {isMobileOrTablet ? (
        <MobileDrawer isOpen={isOpen} onClose={handleOpenClose} height="auto">
          <RemoveStakeModal
            stakedAmount={amount}
            userStakeIndex={userStakeIndex}
            userWalletAddress={userWalletAddress}
            refetchStakingData={refetchStakingData}
            handleOpenClose={handleOpenClose}
            penaltyPercentage={penaltyPercentage}
          />
        </MobileDrawer>
      ) : (
        <Modal openModal={isOpen} closeModal={handleOpenClose} noScroll>
          <RemoveStakeModal
            stakedAmount={amount}
            userStakeIndex={userStakeIndex}
            userWalletAddress={userWalletAddress}
            refetchStakingData={refetchStakingData}
            handleOpenClose={handleOpenClose}
            penaltyPercentage={penaltyPercentage}
          />
        </Modal>
      )}
    </>
  )
}
