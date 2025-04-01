import clsx from 'clsx'

import { Text } from '@/components/atoms/Text/Text'

import blockLabelStyles, { type ClassNames as BlockLabelVariants } from './BlockLabel.module.scss'

interface BlockLabelProps {
  label: string
  variant?: Exclude<BlockLabelVariants, 'wrapper'>
}

export const BlockLabel = ({ label, variant = 'neutral' }: BlockLabelProps): React.ReactNode => {
  return (
    <div className={clsx(blockLabelStyles.wrapper, blockLabelStyles[variant])}>
      <Text as="p" variant={variant === 'colorful' ? 'p4semiColorful' : 'p4semi'}>
        {label}
      </Text>
    </div>
  )
}
