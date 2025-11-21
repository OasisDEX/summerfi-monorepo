'use client'

import { PanelNavigation, useMobileCheck } from '@summerfi/app-earn-ui'
import { usePathname, useRouter } from 'next/navigation'

import { IconWithText } from '@/components/molecules/IconWithText/IconWithText'
import { panelNavigationStaticItems } from '@/constants/panel-navigation-static-items'
import { useDeviceType } from '@/contexts/DeviceContext/DeviceContext'
import { getPanelOverviewNavigationTabId } from '@/helpers/get-pathname-tab-id'

export const OverviewPanelNavigationWrapper = ({
  institutionName,
}: {
  institutionName: string
}) => {
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
            push(`/${institutionName}/overview/institution`)
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
            push(`/${institutionName}/overview/manage-internal-users`)
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
      staticItems={panelNavigationStaticItems}
    />
  )
}
