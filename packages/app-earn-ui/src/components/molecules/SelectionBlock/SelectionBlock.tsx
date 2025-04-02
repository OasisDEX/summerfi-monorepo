import { Text } from '@/components/atoms/Text/Text'
import { GradientBox } from '@/components/molecules/GradientBox/GradientBox'

import selectionStyles from './SelectionBlock.module.scss'

type SelectionBlockProps = {
  title: string
  subTitle?: string
  active?: boolean
  onClick?: () => void
  children?: React.ReactNode
  style?: React.CSSProperties
}

export const SelectionBlock = ({
  title,
  subTitle,
  onClick,
  active = false,
  children,
  style,
}: SelectionBlockProps): React.ReactNode => {
  return (
    <GradientBox
      className={selectionStyles.selectionBlockBorderWrapper}
      onClick={onClick}
      selected={active}
      style={style}
    >
      <div className={selectionStyles.selectionBlockWrapper}>
        <Text variant="p2semi">{title}</Text>
        {subTitle && <Text variant="p4semiColorful">{subTitle}</Text>}
        {children}
      </div>
    </GradientBox>
  )
}
