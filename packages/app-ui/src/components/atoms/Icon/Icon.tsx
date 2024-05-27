import { FC } from 'react'

export interface IconProps {
  variant?: 'large' | 'small'
  size?: number
  role?: 'presentation'
  focusable?: boolean
  icon: {
    path: React.JSX.Element
    viewBox?: string
  }
}

export const Icon: FC<IconProps> = ({
  variant = 'small',
  role = 'presentation',
  focusable = false,
  icon,
  size,
}) => {
  const finalSize =
    size ??
    {
      large: 44,
      small: 30,
    }[variant]

  return (
    <svg
      viewBox={icon.viewBox ?? '0 0 24 24'}
      color="inherit"
      display="inline-block"
      focusable={focusable}
      role={role}
      width={finalSize}
      height={finalSize}
    >
      {icon.path}
    </svg>
  )
}
