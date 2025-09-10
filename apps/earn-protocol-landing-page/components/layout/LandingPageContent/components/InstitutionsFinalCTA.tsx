'use client'
import { Icon, Text, WithArrow } from '@summerfi/app-earn-ui'
import { type IconNamesList } from '@summerfi/app-types'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { EarnProtocolEvents } from '@/helpers/mixpanel'

import institutionsPageStyles from '@/app/institutions/institutionsPage.module.css'

export const FinalCTAElement = ({
  id,
  title,
  icon,
  url,
  urlLabel,
}: {
  id: string
  title: string
  icon: IconNamesList
  url: string
  urlLabel: string
}) => {
  const pathname = usePathname()
  const handleLinkClick = () => {
    EarnProtocolEvents.buttonClicked({
      buttonName: `lp-${id}`,
      page: pathname,
    })
  }

  return (
    <div className={institutionsPageStyles.finalCTAElement}>
      <Icon iconName={icon} size={32} />
      <Text variant="p2semi" as="p">
        {title}
      </Text>
      <Link href={url} prefetch={false} target="_blank" onClick={handleLinkClick}>
        <WithArrow variant="p2semi">{urlLabel}</WithArrow>
      </Link>
    </div>
  )
}
