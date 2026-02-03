'use client'

import { type ReactNode, useState } from 'react'
import { Modal, PanelNavigation, useMobileCheck } from '@summerfi/app-earn-ui'

import { FeedbackModal } from '@/components/molecules/FeedbackModal/FeedbackModal'
import { panelNavigationStaticItems } from '@/constants/panel-navigation-static-items'
import { useDeviceType } from '@/contexts/DeviceContext/DeviceContext'

export const NavigationIntermediary = ({
  navigation,
}: {
  navigation: {
    id: string
    items: {
      id: string
      label: ReactNode
      action: () => void
      isActive: boolean
    }[]
  }[]
}) => {
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false)
  const { deviceType } = useDeviceType()
  const { isMobile } = useMobileCheck(deviceType)

  const closeFeedbackModal = () => {
    setIsFeedbackModalOpen(false)
  }

  return (
    <>
      <PanelNavigation
        isMobile={isMobile}
        navigation={navigation}
        staticItems={panelNavigationStaticItems({
          actions: {
            openFeedbackModal: () => {
              setIsFeedbackModalOpen(true)
            },
          },
        })}
      />
      <Modal openModal={isFeedbackModalOpen} closeModal={closeFeedbackModal} noScroll>
        <FeedbackModal />
      </Modal>
    </>
  )
}
