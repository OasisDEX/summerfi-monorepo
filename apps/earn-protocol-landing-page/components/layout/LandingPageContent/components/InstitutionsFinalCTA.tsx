'use client'
import { Icon, Text, WithArrow } from '@summerfi/app-earn-ui'
import { type IconNamesList } from '@summerfi/app-types'
import Link from 'next/link'

import institutionsPageStyles from '@/app/institutions/institutionsPage.module.css'

export const FinalCTAElement = ({
  title,
  icon,
  url,
  urlLabel,
}: {
  title: string
  icon: IconNamesList
  url: string
  urlLabel: string
}) => {
  return (
    <div className={institutionsPageStyles.finalCTAElement}>
      <Icon iconName={icon} size={32} />
      <Text variant="p2semi" as="p">
        {title}
      </Text>
      <Link href={url} prefetch={false}>
        <WithArrow variant="p2semi">{urlLabel}</WithArrow>
      </Link>
    </div>
  )
}
