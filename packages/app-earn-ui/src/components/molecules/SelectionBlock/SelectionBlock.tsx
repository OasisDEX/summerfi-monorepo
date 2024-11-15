import clsx from 'clsx'

import { Text } from '@/components/atoms/Text/Text'

import selectionStyles from './SelectionBlock.module.scss'

type SelectionBlockProps = {
  title: string
  subTitle?: string
  active?: boolean
  onClick?: () => void
  customContent?: React.ReactNode
  style?: React.CSSProperties
}

export const SelectionBlock = ({
  title,
  subTitle,
  onClick,
  active = false,
  customContent,
  style,
}: SelectionBlockProps) => {
  return (
    <div
      onClick={onClick}
      className={clsx(selectionStyles.selectionBlockBorderWrapper, {
        [selectionStyles.active]: active,
      })}
      style={style}
    >
      <div className={selectionStyles.selectionBlockWrapper}>
        <Text variant="p2semi">{title}</Text>
        {subTitle && <Text variant="p4semiColorful">{subTitle}</Text>}
        {customContent}
      </div>
    </div>
  )
}
