import { Card, Icon, type IconNamesList, Text } from '@summerfi/app-earn-ui'

import classNames from './BeachClubHowToShare.module.css'

const cards = [
  {
    title: 'Share your link on social',
    description:
      'Approve or off board markets, ensuring only the best and safest yield opportunities are available.',
    icons: ['social_x_beach_club', 'social_link_beach_club'],
  },
  {
    title: 'Get your friends to migrate',
    description:
      'Approve or off board markets, ensuring only the best and safest yield opportunities are available.',
    icons: ['social_plant_beach_club'],
  },
  {
    title: 'Other ways to share',
    description:
      'Approve or off board markets, ensuring only the best and safest yield opportunities are available.',
    icons: ['social_question_beach_club'],
  },
]

export const BeachClubHowToShare = () => {
  return (
    <div className={classNames.beachClubHowToShareWrapper}>
      <Text as="h2" variant="h2" style={{ marginBottom: 'var(--general-space-32)' }}>
        How to share your unique code
      </Text>

      <div className={classNames.cardsWrapper}>
        {cards.map((card) => (
          <Card className={classNames.card} key={card.title} variant="cardSecondary">
            <div className={classNames.cardIconsWrapper}>
              {card.icons.map((icon) => (
                <Icon key={icon} iconName={icon as IconNamesList} size={45} />
              ))}
            </div>
            <div className={classNames.cardContent}>
              <Text as="h5" variant="h5" style={{ marginBottom: 'var(--general-space-8)' }}>
                {card.title}
              </Text>
              <Text as="p" variant="p2semi" style={{ color: 'var(--earn-protocol-secondary-40)' }}>
                {card.description}
              </Text>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
