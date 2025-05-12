import { type Dispatch, type FC, useEffect } from 'react'
import { useUser } from '@account-kit/react'
import { Button, Card, Text, useMobileCheck, WithArrow } from '@summerfi/app-earn-ui'
import { useTermsOfService } from '@summerfi/app-tos'
import { TOSStatus } from '@summerfi/app-types'
import Link from 'next/link'

import { type AccountKitSupportedNetworks, SDKChainIdToAAChainMap } from '@/account-kit/config'
import { AccountKitAccountType } from '@/account-kit/types'
import { TermsOfServiceCookiePrefix, TermsOfServiceVersion } from '@/constants/terms-of-service'
import { useDeviceType } from '@/contexts/DeviceContext/DeviceContext'
import {
  airdropToS,
  claimDelegateTerms,
} from '@/features/claim-and-delegate/components/ClaimDelegateAcceptanceStep/terms'
import {
  type ClaimDelegateReducerAction,
  type ClaimDelegateState,
  ClaimDelegateSteps,
} from '@/features/claim-and-delegate/types'
import { PortfolioTabs } from '@/features/portfolio/types'
import { useClientChainId } from '@/hooks/use-client-chain-id'
import { usePublicClient } from '@/hooks/use-public-client'
import { useTermsOfServiceSigner } from '@/hooks/use-terms-of-service-signer'
import { useUserWallet } from '@/hooks/use-user-wallet'
import { useVisibleParagraph } from '@/hooks/use-visible-paragraph'

import classNames from './ClaimDelegateAcceptanceStep.module.css'

interface ClaimDelegateAcceptanceStepProps {
  state: ClaimDelegateState
  dispatch: Dispatch<ClaimDelegateReducerAction>
}

export const ClaimDelegateAcceptanceStep: FC<ClaimDelegateAcceptanceStepProps> = ({
  state,
  dispatch,
}) => {
  const { deviceType } = useDeviceType()
  const { isMobile } = useMobileCheck(deviceType)
  const user = useUser()
  const { userWalletAddress } = useUserWallet()
  const { activeParagraph, paragraphRefs } = useVisibleParagraph()
  const { clientChainId } = useClientChainId()

  const signTosMessage = useTermsOfServiceSigner()

  const { publicClient } = usePublicClient({
    chain: SDKChainIdToAAChainMap[clientChainId as AccountKitSupportedNetworks],
  })

  const tosState = useTermsOfService({
    publicClient,
    signMessage: signTosMessage,
    chainId: clientChainId,
    walletAddress: user?.address,
    isSmartAccount: user?.type === AccountKitAccountType.SCA,
    version: TermsOfServiceVersion.SUMR_CLAIM_TOKEN_VERSION,
    cookiePrefix: TermsOfServiceCookiePrefix.SUMR_CLAIM_TOKEN,
    host: '/earn',
    type: 'sumrAirdrop',
  })

  useEffect(() => {
    if (
      tosState.status === TOSStatus.WAITING_FOR_ACCEPTANCE ||
      tosState.status === TOSStatus.WAITING_FOR_ACCEPTANCE_UPDATED
    ) {
      tosState.action()
    }

    // since this was added, continue btn handling is not longer needed
    if (tosState.status === TOSStatus.DONE) {
      dispatch({ type: 'update-step', payload: ClaimDelegateSteps.CLAIM })
    }
  }, [tosState, dispatch])

  const handleAccept = () => {
    if ('action' in tosState) {
      tosState.action()
    } else {
      // eslint-disable-next-line no-console
      console.warn('TOS - No action available')
    }
  }

  const isLoading =
    [
      TOSStatus.INIT,
      TOSStatus.LOADING,
      TOSStatus.WAITING_FOR_ACCEPTANCE,
      TOSStatus.WAITING_FOR_ACCEPTANCE_UPDATED,
    ].includes(tosState.status) && !!userWalletAddress
  const isDisabled =
    state.walletAddress.toLowerCase() !== userWalletAddress?.toLowerCase() || isLoading

  return (
    <div className={classNames.claimDelegateAcceptanceStepWrapper}>
      <div className={classNames.tabListWrapper}>
        <ol className={classNames.tabList}>
          {claimDelegateTerms.map((item, idx) => (
            <li
              key={idx}
              onClick={() => {
                paragraphRefs.current[idx]?.scrollIntoView({
                  behavior: 'smooth',
                  block: 'center',
                })
              }}
            >
              <div className={classNames.termItem} data-active={activeParagraph === idx}>
                <Text as="p" variant="p3semi">
                  {idx + 1}.
                </Text>
                <Text
                  as="p"
                  variant="p3semi"
                  className={classNames.termText}
                  style={{
                    color: activeParagraph === idx ? 'white' : 'var(--earn-protocol-secondary-60)',
                  }}
                >
                  {item.label}
                </Text>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className={classNames.mainContentWrapper}>
        <Card className={classNames.cardWrapper}>
          <div className={classNames.cardContentWrapper}>
            <div className={classNames.airDrop}>
              <Text as="p" variant="p2" style={{ textAlign: 'center' }}>
                {airdropToS.header}
              </Text>
              <Text as="p" variant="p3">
                {airdropToS.lastRevised}
              </Text>
              <Text as="p" variant="p3">
                {airdropToS.content}
              </Text>
            </div>
            {claimDelegateTerms.map((item, index) => (
              <Text
                as="div"
                variant="p3"
                key={`content-${index}`}
                ref={(element: HTMLParagraphElement | null) => {
                  paragraphRefs.current[index] = element
                }}
              >
                {item.content}
              </Text>
            ))}
          </div>
        </Card>
        <div className={classNames.footerWrapper}>
          <Link href={`/portfolio/${state.walletAddress}?tab=${PortfolioTabs.REWARDS}`}>
            <Button variant="secondarySmall">
              <Text variant="p3semi" as="p">
                {isMobile ? 'Reject' : 'Reject terms'}
              </Text>
            </Button>
          </Link>
          <Button
            variant="primarySmall"
            style={{ paddingRight: isLoading ? undefined : 'var(--general-space-32)' }}
            onClick={handleAccept}
            // disiabled when done to avoid button text flickering just before automatic change of step to claim
            disabled={isDisabled || tosState.status === TOSStatus.DONE}
          >
            <WithArrow
              style={{ color: 'var(--earn-protocol-secondary-100)' }}
              variant="p3semi"
              as="p"
              isLoading={isLoading || tosState.status === TOSStatus.DONE}
            >
              {/* Loading... when done to avoid button text flickering just before automatic change of step to claim  */}
              {isLoading || tosState.status === TOSStatus.DONE
                ? 'Loading...'
                : isMobile
                  ? 'Accept'
                  : 'Accept & Sign'}
            </WithArrow>
          </Button>
        </div>
      </div>
    </div>
  )
}
