import { type Dispatch, type FC, useCallback, useEffect } from 'react'
import { useSigner, useSmartAccountClient, useUser } from '@account-kit/react'
import { Button, Card, Text, WithArrow } from '@summerfi/app-earn-ui'
import { type TOSSignMessage, useTermsOfService } from '@summerfi/app-tos'
import { TOSStatus } from '@summerfi/app-types'
import Link from 'next/link'

import { accountType } from '@/account-kit/config'
import { claimDelegateAcceptanceParagraphs } from '@/features/claim-and-delegate/components/ClaimDelegateAcceptanceStep/config'
import {
  type ClaimDelegateReducerAction,
  type ClaimDelegateState,
  ClaimDelegateSteps,
} from '@/features/claim-and-delegate/types'
import { useSignMessageWithResult } from '@/hooks/use-sign-message-with-results'
import { useUserWallet } from '@/hooks/use-user-wallet'

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
  const { signMessageWithResult } = useSignMessageWithResult(client)
  const signer = useSigner()

  const signMessage: TOSSignMessage = useCallback(
    async (data: string) => {
      // Signer from MM
      if (user?.type === 'eoa') {
        return await signMessageWithResult(data)
      }
      // Signer from Account Kit
      else return await signer?.signMessage(data)
    },
    [signer, user?.type, signMessageWithResult],
  )

  const tosState = useTermsOfService({
    signMessage,
    chainId: 1,
    walletAddress: user?.address,
    isGnosisSafe: false,
    version: 'sumr-version-16.01.2025',
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

  const isLoading = [TOSStatus.INIT, TOSStatus.LOADING].includes(tosState.status)
  const isDisabled =
    state.walletAddress.toLowerCase() !== userWalletAddress?.toLowerCase() || isLoading

  return (
    <div className={classNames.claimDelegateAcceptanceStepWrapper}>
      <ol>
        {claimDelegateAcceptanceParagraphs.map((item, idx) => (
          <li key={idx}>
            <Text as="p" variant="p3" style={{ color: 'var(--earn-protocol-secondary-60)' }}>
              {idx + 1}. {item.label}
            </Text>
          </li>
        ))}
      </ol>
      <div className={classNames.mainContentWrapper}>
        <Card className={classNames.cardWrapper}>
          <div className={classNames.cardContentWrapper}>
            <Text as="p" variant="p3">
              Volutpat nunc mauris quis vitae metus a viverra nulla turpis. Quis hendrerit aenean eu
              id viverra mattis facilisi diam ullamcorper. Diam faucibus sed mauris turpis urna
              tortor dui. Volutpat odio ullamcorper nisi sodales volutpat in tortor metus egestas.
              Cursus sem sit velit tincidunt mus fames blandit nascetur rhoncus. Donec massa id
              suspendisse tortor felis accumsan adipiscing. Sodales in aliquet at sed. Adipiscing
              sapien quisque at adipiscing. Blandit vivamus vitae mi viverra mattis lectus enim
              donec libero. Commodo molestie amet viverra enim in luctus vel. Arcu id aliquam
              molestie ac. Eu aliquet consequat non integer auctor nulla. Scelerisque mi nec
              porttitor mi. Quis in vitae mollis tincidunt congue. Tincidunt ultrices id amet
              volutpat eget fames. Odio eleifend duis amet ac vivamus facilisis. Ullamcorper
              convallis nisi porta varius ullamcorper at enim. Aenean orci sagittis parturient ac
              amet. Donec eget in sagittis vestibulum congue facilisis. Sit tincidunt morbi fusce in
              molestie sed amet vitae. Varius gravida id lacinia habitasse senectus. Orci tempus nam
              cras orci egestas mattis viverra urna. Metus morbi lorem maecenas enim. Sagittis sed
              quis praesent cursus felis cursus. Fringilla tristique non ut enim nunc ac nulla.
              Posuere quis ipsum suspendisse turpis facilisis mus elementum a. Leo faucibus pretium
              facilisis malesuada leo ac bibendum et. Nunc leo vitae pretium diam egestas enim
              justo. Nulla ullamcorper tortor mattis cras lobortis ultricies. Feugiat aliquam quis
              cras ac sed donec. Adipiscing at egestas tempor sit luctus facilisi. Erat euismod
              cursus fermentum elementum egestas felis feugiat. Felis urna tincidunt ultrices
              dignissim. Arcu sit enim et mattis ac. Quam ultrices id suscipit at ac nibh in. Cursus
              integer hendrerit amet diam viverra et malesuada. At aliquet ut pellentesque vulputate
              nec. Metus nunc magna tincidunt nisl quis. Purus eget pellentesque amet mattis.
              Egestas a elementum dignissim quam ultrices sed. Sem neque commodo vivamus ut praesent
              faucibus id tristique eu. Mauris curabitur maecenas neque et. Suspendisse donec porta
              nibh erat maecenas. Fringilla egestas volutpat rhoncus laoreet. Pellentesque interdum
              tristique scelerisque lacus in. Eros feugiat gravida sem integer velit eu varius
              tellus justo. Malesuada auctor morbi dictumst urna tincidunt. Urna vestibulum ornare
              neque gravida molestie et lacus. Nisi morbi scelerisque s. Volutpat nunc mauris quis
              vitae metus a viverra nulla turpis. Quis hendrerit aenean eu id viverra mattis
              facilisi diam ullamcorper. Diam faucibus sed mauris turpis urna tortor dui. Volutpat
              odio ullamcorper nisi sodales volutpat in tortor metus egestas. Cursus sem sit velit
              tincidunt mus fames blandit nascetur rhoncus. Donec massa id suspendisse tortor felis
              accumsan adipiscing. Sodales in aliquet at sed. Adipiscing sapien quisque at
              adipiscing. Blandit vivamus vitae mi viverra mattis lectus enim donec libero. Commodo
              molestie amet viverra enim in luctus vel. Arcu id aliquam molestie ac. Eu aliquet
              consequat non integer auctor nulla. Scelerisque mi nec porttitor mi. Quis in vitae
              mollis tincidunt congue. Tincidunt ultrices id amet volutpat eget fames. Odio eleifend
              duis amet ac vivamus facilisis. Ullamcorper convallis nisi porta varius ullamcorper at
              enim. Aenean orci sagittis parturient ac amet. Donec eget in sagittis vestibulum
              congue facilisis. Sit tincidunt morbi fusce in molestie sed amet vitae. Varius gravida
              id lacinia habitasse senectus. Orci tempus nam cras orci egestas mattis viverra urna.
              Metus morbi lorem maecenas enim. Sagittis sed quis praesent cursus felis cursus.
              Fringilla tristique non ut enim nunc ac nulla. Posuere quis ipsum suspendisse turpis
              facilisis mus elementum a. Leo faucibus pretium facilisis malesuada leo ac bibendum
              et. Nunc leo vitae pretium diam egestas enim justo. Nulla ullamcorper tortor mattis
              cras lobortis ultricies. Feugiat aliquam quis cras ac sed donec. Adipiscing at egestas
              tempor sit luctus facilisi. Erat euismod cursus fermentum elementum egestas felis
              feugiat. Felis urna tincidunt ultrices dignissim. Arcu sit enim et mattis ac. Quam
              ultrices id suscipit at ac nibh in. Cursus integer hendrerit amet diam viverra et
              malesuada. At aliquet ut pellentesque vulputate nec. Metus nunc magna tincidunt nisl
              quis. Purus eget pellentesque amet mattis. Egestas a elementum dignissim quam ultrices
              sed. Sem neque commodo vivamus ut praesent faucibus id tristique eu. Mauris curabitur
              maecenas neque et. Suspendisse donec porta nibh erat maecenas. Fringilla egestas
              volutpat rhoncus laoreet. Pellentesque interdum tristique scelerisque lacus in. Eros
              feugiat gravida sem integer velit eu varius tellus justo. Malesuada auctor morbi
              dictumst urna tincidunt. Urna vestibulum ornare neque gravida molestie et lacus. Nisi
              morbi scelerisque s.
            </Text>
          </div>
        </Card>
        <div className={classNames.footerWrapper}>
          <Link href={`/earn/portfolio/${state.walletAddress}`}>
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
