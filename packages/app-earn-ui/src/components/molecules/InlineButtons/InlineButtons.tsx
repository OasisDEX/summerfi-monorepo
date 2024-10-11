import { type CSSProperties } from 'react'
import { type InlineButtonOption } from '@summerfi/app-types'

import { Button } from '@/components/atoms/Button/Button'
import { Text } from '@/components/atoms/Text/Text'

import classNames from './InlineButtons.module.scss'

interface InlineButtonsProps<O extends string> {
  options: InlineButtonOption<O>[]
  currentOption: InlineButtonOption<O>
  handleOption: (option: InlineButtonOption<O>) => void
  style?: CSSProperties
}

export function InlineButtons<O extends string>({
  options,
  currentOption,
  handleOption,
  style,
}: InlineButtonsProps<O>) {
  return (
    <div className={classNames.inlineButtonsWrapper} style={style}>
      {options.map((option) => (
        <Button
          key={option.key}
          variant={option.key === currentOption.key ? 'primarySmall' : 'unstyled'}
          style={{ height: '31px', padding: '0px 16px' }}
          onClick={() => handleOption(option)}
        >
          <Text
            as="span"
            variant="p4semi"
            style={{
              color:
                option === currentOption
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
