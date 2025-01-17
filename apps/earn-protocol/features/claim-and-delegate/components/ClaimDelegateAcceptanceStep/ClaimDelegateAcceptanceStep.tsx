import { type Dispatch, type FC, useCallback, useEffect } from 'react'
import { useSigner, useSignMessage, useSmartAccountClient, useUser } from '@account-kit/react'
import { Button, Card, Text, WithArrow } from '@summerfi/app-earn-ui'
import { type TOSSignMessage, useTermsOfService } from '@summerfi/app-tos'
import { TOSStatus } from '@summerfi/app-types'
import Link from 'next/link'

import { accountType } from '@/account-kit/config'
import { claimDelegateTerms } from '@/features/claim-and-delegate/components/ClaimDelegateAcceptanceStep/terms'
import {
  type ClaimDelegateReducerAction,
  type ClaimDelegateState,
  ClaimDelegateSteps,
} from '@/features/claim-and-delegate/types'
import { PortfolioTabs } from '@/features/portfolio/types'
import { useUserWallet } from '@/hooks/use-user-wallet'
import { useVisibleParagraph } from '@/hooks/useVisibleParagraph'

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
    chainId: 1,
    walletAddress: user?.address,
    isGnosisSafe: false,
    version: 'sumr_version-16.01.2026',
    cookiePrefix: 'sumr-claim-token',
    host: '/earn',
  })

  useEffect(() => {
    if (
      tosState.status === TOSStatus.WAITING_FOR_ACCEPTANCE ||
      tosState.status === TOSStatus.WAITING_FOR_ACCEPTANCE_UPDATED
    ) {
      tosState.action()
    }
  }, [tosState])

  const handleAccept = () => {
    if (tosState.status === TOSStatus.DONE) {
      dispatch({ type: 'update-step', payload: ClaimDelegateSteps.CLAIM })
    }

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
            {claimDelegateTerms.map((item, index) => (
              <Text
                as="p"
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
            disabled={isDisabled}
          >
            <WithArrow
              style={{ color: 'var(--earn-protocol-secondary-100)' }}
              variant="p3semi"
              as="p"
              withAnimated={!isLoading}
            >
              {tosState.status === TOSStatus.DONE
                ? 'Continue'
                : isLoading
                  ? 'Loading...'
                  : 'Accept & Sign'}
            </WithArrow>
          </Button>
        </div>
      </div>
    </div>
  )
}
