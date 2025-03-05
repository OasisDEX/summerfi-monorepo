import { useEffect } from 'react'
import {
  INTERNAL_LINKS,
  type SidebarProps,
  Text,
  useMobileCheck,
  WithArrow,
} from '@summerfi/app-earn-ui'
import { type TOSState, TOSStatus } from '@summerfi/app-types'
import Link from 'next/link'

import { TermsOfServiceCookiePrefix } from '@/constants/terms-of-service'
import { useDeviceType } from '@/contexts/DeviceContext/DeviceContext'

import { useRiskVerification } from './use-risk-verification'

const getPrimaryButtonLabel = (tosState: TOSState) => {
  switch (tosState.status) {
    case TOSStatus.INIT:
    case TOSStatus.WAITING_FOR_SIGNATURE:
    case TOSStatus.WAITING_FOR_ACCEPTANCE:
    case TOSStatus.WAITING_FOR_ACCEPTANCE_UPDATED:
      return 'Agree and sign'
    case TOSStatus.LOADING:
      return 'Signing...'
    case TOSStatus.RETRY:
      return 'Retry'
    // Cases below wont really happen since we are moving to next step automatically
    case TOSStatus.DONE:
      return 'Continue'
    default:
      return 'Continue'
  }
}

export const useTermsOfServiceSidebar = ({
  tosState,
  handleGoBack,
}: {
  tosState: TOSState
  handleGoBack: () => void
}) => {
  const { deviceType } = useDeviceType()
  const { isMobile, isTablet } = useMobileCheck(deviceType)
  const isMobileOrTablet = isMobile || isTablet
  const { checkRisk } = useRiskVerification({ cookiePrefix: TermsOfServiceCookiePrefix.APP_TOKEN })
  const tosStatus = tosState.status
  const tosAction = 'action' in tosState ? tosState.action : undefined

  useEffect(() => {
    if (
      (tosStatus === TOSStatus.WAITING_FOR_ACCEPTANCE ||
        tosStatus === TOSStatus.WAITING_FOR_ACCEPTANCE_UPDATED) &&
      tosAction
    ) {
      tosAction()
    }

    if (tosStatus === TOSStatus.DONE) {
      checkRisk()
    }
  }, [tosStatus, tosAction, checkRisk])

  const tosSidebarProps: SidebarProps = {
    title: 'Terms & Conditions',
    content: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--general-space-16)' }}>
        <Text
          as="p"
          variant="p2"
          style={{
            color: 'var(--earn-protocol-secondary-60)',
            marginTop: 'var(--general-space-32)',
          }}
        >
          By signing the Terms & Conditions, you acknowledge and accept all stated policies and
          requirements. Agreement is mandatory for access and use.
        </Text>
        <Link
          href={`${INTERNAL_LINKS.summerPro}/terms`}
          target="_blank"
          style={{ marginBottom: 'var(--general-space-16)' }}
        >
          <WithArrow withStatic>Terms & Conditions</WithArrow>
        </Link>
      </div>
    ),
    primaryButton: {
      label: getPrimaryButtonLabel(tosState),
      disabled: tosState.status === TOSStatus.LOADING,
      action: () => {
        // eslint-disable-next-line no-unused-expressions
        'action' in tosState && tosState.action()
      },
      loading: tosState.status === TOSStatus.LOADING,
    },
    goBackAction: handleGoBack,
    secondaryButton: {
      label: 'Reject',
      disabled: tosState.status === TOSStatus.LOADING,
      action: () => handleGoBack(),
    },
    isMobileOrTablet,
  }

  return { tosSidebarProps }
}
