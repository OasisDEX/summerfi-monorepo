import { useEffect } from 'react'
import {
  INTERNAL_LINKS,
  type SidebarProps,
  Text,
  useMobileCheck,
  WithArrow,
} from '@summerfi/app-earn-ui'
import { type TOSState, TOSStatus } from '@summerfi/app-types'
import { slugify } from '@summerfi/app-utils'
import Link from 'next/link'

import { TermsOfServiceCookiePrefix } from '@/constants/terms-of-service'
import { useDeviceType } from '@/contexts/DeviceContext/DeviceContext'
import { useHandleButtonClickEvent } from '@/hooks/use-mixpanel-event'

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

/**
 * Custom hook to manage the Terms of Service sidebar logic.
 * Handles device type checks, risk verification, and triggers TOS actions based on state.
 *
 * @param {Object} params - The parameters object.
 * @param {TOSState} params.tosState - The current Terms of Service state.
 * @param {() => void} params.handleGoBack - Callback to handle the "go back" action.
 * @returns {SidebarProps} Sidebar properties for rendering the TOS sidebar.
 */
export const useTermsOfServiceSidebar = ({
  tosState,
  handleGoBack,
}: {
  tosState: TOSState
  handleGoBack: () => void
}) => {
  const { deviceType } = useDeviceType()
  const buttonClickEventHandler = useHandleButtonClickEvent()
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
    title: 'Terms\u00A0&\u00A0Conditions',
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
        buttonClickEventHandler(`terms-of-service-${slugify(getPrimaryButtonLabel(tosState))}`)
        // eslint-disable-next-line no-unused-expressions
        'action' in tosState && tosState.action()
      },
      loading: tosState.status === TOSStatus.LOADING,
    },
    goBackAction: () => {
      buttonClickEventHandler(`terms-of-service-go-back`)
      handleGoBack()
    },
    secondaryButton: {
      label: 'Reject',
      disabled: tosState.status === TOSStatus.LOADING,
      action: () => {
        buttonClickEventHandler(`terms-of-service-reject`)
        handleGoBack()
      },
    },
    isMobileOrTablet,
  }

  return { tosSidebarProps }
}
