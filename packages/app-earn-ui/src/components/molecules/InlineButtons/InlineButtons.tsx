import { type CSSProperties } from 'react'
import { type InlineButtonOption } from '@summerfi/app-types'

import { Button } from '@/components/atoms/Button/Button'
import { Text, type TextAllowedHtmlTags } from '@/components/atoms/Text/Text'
import type { ClassNames as TextClassNames } from '@/components/atoms/Text/Text.module.scss'

import classNames from './InlineButtons.module.scss'

interface InlineButtonsProps<O extends string> {
  options: InlineButtonOption<O>[]
  currentOptions: InlineButtonOption<O>[]
  handleOption: (option: InlineButtonOption<O>) => void
  style?: CSSProperties
  asButtons?: boolean
  asUnstyled?: boolean
  as?: TextAllowedHtmlTags
  variant: TextClassNames
}

export function InlineButtons<O extends string>({
  options,
  currentOptions,
  handleOption,
  style,
  asButtons,
  asUnstyled,
  as = 'span',
  variant,
}: InlineButtonsProps<O>): React.ReactNode {
  return (
    <div className={classNames.inlineButtonsWrapper} style={style}>
      {options.map((option) => (
        <Button
          key={option.key}
          variant={
            currentOptions.some((o) => o.key === option.key)
              ? asUnstyled
                ? 'unstyled'
                : 'primarySmall'
              : asButtons
                ? 'secondarySmall'
                : 'unstyled'
          }
          style={{ height: '31px', padding: asUnstyled ? '0' : '0px 16px' }}
          onClick={() => handleOption(option)}
        >
          <Text
            as={as}
            variant={variant}
            style={{
              color: currentOptions.some((o) => o.key === option.key)
                ? 'var(--earn-protocol-secondary-100)'
                : 'var(--earn-protocol-secondary-60)',
            }}
          >
            {option.title}
          </Text>
        </Button>
      ))}
    </div>
  )
}
