'use client'

import { PanelNavigation, useMobileCheck } from '@summerfi/app-earn-ui'
import { usePathname, useRouter } from 'next/navigation'

import { IconWithText } from '@/components/molecules/IconWithText/IconWithText'
import { useDeviceType } from '@/contexts/DeviceContext/DeviceContext'
import { getPanelOverviewNavigationTabId } from '@/helpers/get-pathname-tab-id'

export const OverviewPanelNavigationWrapper = ({ institutionId }: { institutionId: string }) => {
  const { deviceType } = useDeviceType()
  const { isMobile } = useMobileCheck(deviceType)
  const pathname = usePathname()
  const { push } = useRouter()
  const panelNavigationTabId = getPanelOverviewNavigationTabId(pathname)

  const navigation = [
    {
      id: '1',
      items: [
        {
          id: 'institution',
          label: (
            <IconWithText iconName="info" size={20}>
              Institution overview
            </IconWithText>
          ),
          // eslint-disable-next-line no-console
          action: () => {
            push(`/${institutionId}/overview/institution`)
          },
          isActive: panelNavigationTabId === 'institution',
        },
        {
          id: 'manage-internal-users',
          label: (
            <IconWithText iconName="cog" size={20}>
              Manage internal users
            </IconWithText>
          ),
          // eslint-disable-next-line no-console
          action: () => {
            push(`/${institutionId}/overview/manage-internal-users`)
          },
          isActive: panelNavigationTabId === 'manage-internal-users',
        },
      ],
    },
  ]

  return (
    <PanelNavigation
      isMobile={isMobile}
      navigation={navigation}
      staticItems={[
        {
          id: 'request-new-market',
          label: (
            <IconWithText iconName="plus" size={20}>
              Request a new market
            </IconWithText>
          ),
          // eslint-disable-next-line no-console
          action: () => console.log('Request a new market'),
        },
        {
          id: 'help-support',
          label: (
            <IconWithText iconName="question_o" size={20}>
              Help & Support
            </IconWithText>
          ),
          link: { href: '/', target: '_blank' },
        },
      ]}
    />
  )
}
