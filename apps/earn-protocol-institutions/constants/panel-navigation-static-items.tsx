import { IconWithText } from '@/components/molecules/IconWithText/IconWithText'

export const panelNavigationStaticItems = ({
  actions,
}: {
  actions: {
    openFeedbackModal: () => void
  }
}) => [
  {
    id: 'help-support',
    label: (
      <IconWithText iconName="question_o" size={20}>
        Help & Support
      </IconWithText>
    ),
    link: { href: '' },
  },
  {
    id: 'open-feedback-modal',
    label: (
      <IconWithText iconName="plus" size={18}>
        Feedback
      </IconWithText>
    ),
    // eslint-disable-next-line no-console
    action: actions.openFeedbackModal,
  },
]
