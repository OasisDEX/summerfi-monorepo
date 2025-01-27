import { type Dispatch, type FC, useCallback, useEffect } from 'react'
import { useSigner, useSignMessage, useSmartAccountClient, useUser } from '@account-kit/react'
import { Button, Card, Text, WithArrow } from '@summerfi/app-earn-ui'
import { type TOSSignMessage, useTermsOfService } from '@summerfi/app-tos'
import { TOSStatus } from '@summerfi/app-types'
import Link from 'next/link'

import { accountType } from '@/account-kit/config'
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
import { useUserWallet } from '@/hooks/use-user-wallet'
import { useVisibleParagraph } from '@/hooks/use-visible-paragraph'

import classNames from './ClaimDelegateAcceptanceStep.module.scss'

interface ClaimDelegateAcceptanceStepProps {
  state: ClaimDelegateState
  dispatch: Dispatch<ClaimDelegateReducerAction>
}

export const ClaimDelegateAcceptanceStep: FC<ClaimDelegateAcceptanceStepProps> = ({
  state,
  dispatch,
}) => {
  const user = useUser()
  const { userWalletAddress } = useUserWallet()
  const { client } = useSmartAccountClient({ type: accountType })
  const { signMessageAsync } = useSignMessage({
    client,
  })
  const signer = useSigner()
  const { activeParagraph, paragraphRefs } = useVisibleParagraph()
  const { clientChainId } = useClientChainId()
  const signMessage: TOSSignMessage = useCallback(
    async (data: string) => {
      if (user?.type === 'eoa') {
        return await signMessageAsync({ message: data })
      }
      // different handling for SCA, since signMessageAsync returns signature string
      // that is completely different from signer.signMessage
      else return await signer?.signMessage(data)
    },
    [signer, user?.type],
  )

  const tosState = useTermsOfService({
    signMessage,
    chainId: clientChainId,
    walletAddress: user?.address,
    isGnosisSafe: true,
    version: 'sumr_version-27.01.2025',
    cookiePrefix: 'sumr-claim-token',
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
      <ol>
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
            <Text
              as="p"
              variant="p3"
              style={{
                color: activeParagraph === idx ? 'white' : 'var(--earn-protocol-secondary-60)',
                cursor: 'pointer',
              }}
            >
              {idx + 1}. {item.label}
            </Text>
          </li>
        ))}
      </ol>

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
                Reject terms
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
              {isLoading || tosState.status === TOSStatus.DONE ? 'Loading...' : 'Accept & Sign'}
            </WithArrow>
          </Button>
        </div>
      </div>
    </div>
  )
}
