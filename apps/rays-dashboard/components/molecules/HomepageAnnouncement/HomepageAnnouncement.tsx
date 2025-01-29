import { type IconNamesList } from '@summerfi/app-types'
import { Icon, Text, WithArrow } from '@summerfi/app-ui'
import Link from 'next/link'

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
    >
      <div
        style={{
          background: '#FFFFFF',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          borderRadius: '32px',
          padding: '8px',
          paddingRight: '32px',
          marginTop: '16px',
          marginBottom: '36px',
          color: '#17344F',
        }}
      >
        {announcement.icon ? (
          <div
            style={{
              padding: '0 5px',
              width: '24px',
              height: '24px',
              minWidth: '24px',
              minHeight: '24px',
              borderRadius: '32px',
              marginRight: '16px',
            }}
          >
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
