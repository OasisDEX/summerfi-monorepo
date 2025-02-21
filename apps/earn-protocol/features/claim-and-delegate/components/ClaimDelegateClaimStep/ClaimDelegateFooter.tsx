import { type FC } from 'react'
import { Button, Text, WithArrow } from '@summerfi/app-earn-ui'
import { type SDKChainId } from '@summerfi/app-types'
import Link from 'next/link'

import { ClaimDelegateTxStatuses } from '@/features/claim-and-delegate/types'

import classNames from './ClaimDelegateClaimStep.module.scss'

interface ClaimDelegateFooterProps {
  claimStatus: ClaimDelegateTxStatuses | undefined
  hasSumrOnSatelliteChains: boolean
  hasSumrOnHubChain: boolean
  hideButtonArrow: boolean
  sumrToClaim: number
  claimOnChainId: SDKChainId
  clientChainId: SDKChainId
  disableBridgeButton: boolean
  resolvedWalletAddress: string
  userWalletAddress?: string
  onBack: () => void
  onAccept: () => void
}

const getButtonText = (
  status: ClaimDelegateTxStatuses | undefined,
  claimOnChainId: SDKChainId,
  clientChainId: SDKChainId,
) => {
  switch (status) {
    case ClaimDelegateTxStatuses.PENDING:
      return 'Claiming...'
    case ClaimDelegateTxStatuses.COMPLETED:
      return 'Continue'
    case ClaimDelegateTxStatuses.FAILED:
      return claimOnChainId !== clientChainId ? 'Switch Network' : 'Retry'
    default:
      return claimOnChainId !== clientChainId ? 'Switch Network' : 'Claim'
  }
}

const ClaimButton = ({
  claimStatus,
  hideButtonArrow,
  onAccept,
  claimOnChainId,
  clientChainId,
  disabled,
}: {
  claimStatus: ClaimDelegateTxStatuses | undefined
  hideButtonArrow: boolean
  onAccept: () => void
  claimOnChainId: SDKChainId
  clientChainId: SDKChainId
  disabled: boolean
}) => (
  <Button
    variant="primarySmall"
    style={
      !hideButtonArrow
        ? {
            paddingRight: 'var(--general-space-32)',
          }
        : {}
    }
    onClick={onAccept}
    disabled={disabled}
  >
    <WithArrow
      style={{ color: 'var(--earn-protocol-secondary-100)' }}
      variant="p3semi"
      as="p"
      hideArrow={hideButtonArrow}
      isLoading={claimStatus === ClaimDelegateTxStatuses.PENDING}
    >
      {getButtonText(claimStatus, claimOnChainId, clientChainId)}
    </WithArrow>
  </Button>
)

export const ClaimDelegateFooter: FC<ClaimDelegateFooterProps> = ({
  claimStatus,
  hasSumrOnSatelliteChains,
  hasSumrOnHubChain,
  hideButtonArrow,
  sumrToClaim,
  claimOnChainId,
  clientChainId,
  disableBridgeButton,
  resolvedWalletAddress,
  userWalletAddress,
  onBack,
  onAccept,
}) => {
  const isButtonDisabled =
    claimStatus === ClaimDelegateTxStatuses.PENDING ||
    (sumrToClaim === 0 && claimStatus !== ClaimDelegateTxStatuses.COMPLETED) ||
    (!hasSumrOnHubChain && claimStatus === ClaimDelegateTxStatuses.COMPLETED) ||
    userWalletAddress?.toLowerCase() !== resolvedWalletAddress.toLowerCase()

  return (
    <div className={classNames.footerWrapper}>
      <Button variant="secondaryMedium" onClick={onBack}>
        <Text variant="p3semi" as="p">
          Back
        </Text>
      </Button>

      {(claimStatus !== ClaimDelegateTxStatuses.COMPLETED ||
        (!hasSumrOnSatelliteChains && claimStatus === ClaimDelegateTxStatuses.COMPLETED)) && (
        <ClaimButton
          claimStatus={claimStatus}
          hideButtonArrow={hideButtonArrow}
          onAccept={onAccept}
          claimOnChainId={claimOnChainId}
          clientChainId={clientChainId}
          disabled={isButtonDisabled}
        />
      )}

      <div className={classNames.bridgeButtonWrapper}>
        <Button variant="secondaryMedium" onClick={onAccept}>
          <Text variant="p3semi" as="p">
            <WithArrow
              variant="p3semi"
              as="span"
              reserveSpace
              style={{ color: 'var(--earn-protocol-secondary-60)' }}
            >
              Skip
            </WithArrow>
          </Text>
        </Button>
        {hasSumrOnSatelliteChains && claimStatus === ClaimDelegateTxStatuses.COMPLETED && (
          <Link href={`/bridge/${resolvedWalletAddress}?via=claim&source_chain=${claimOnChainId}`}>
            <Button variant="primaryMedium" disabled={disableBridgeButton}>
              Bridge
            </Button>
          </Link>
        )}
      </div>
      <Text variant="p3semi" as="p">
        <WithArrow>Bridge</WithArrow>
      </Text>
    </div>
  )
}
