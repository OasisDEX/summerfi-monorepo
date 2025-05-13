import { type IconNamesList } from '@summerfi/app-types'
import { Icon, Text, WithArrow } from '@summerfi/app-ui'
import Link from 'next/link'

import homepageAnnouncementStyles from './HomepageAnnouncement.module.css'

export type HomepageAnnouncementProps = {
  announcement?: {
    message: string
    url: string
    enabled: boolean
    icon: string
  }
}

export function HomepageAnnouncement({ announcement }: HomepageAnnouncementProps) {
  return announcement && announcement.enabled ? (
    <Link
      href={announcement.url}
      style={{
        width: 'fit-content',
        margin: '0 auto',
      }}
      target="_blank"
    >
      <div className={homepageAnnouncementStyles.wrapper}>
        {announcement.icon ? (
          <div className={homepageAnnouncementStyles.iconWrapper}>
            <Icon iconName={announcement.icon as IconNamesList} size={24} />
          </div>
        ) : null}
        <Text
          variant="p3semi"
          style={{
            marginRight: '-7px',
          }}
        >
          {announcement.message}
        </Text>
        <WithArrow>&nbsp;</WithArrow>
      </div>
    </Link>
  ) : null
}
