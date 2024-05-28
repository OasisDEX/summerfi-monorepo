import { FC } from 'react'

export interface IconProps {
  variant?: 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl' | 'xxxl'
  role?: 'presentation'
  focusable?: boolean
  icon: {
    path: React.JSX.Element
    viewBox?: string
  }
}

export const Icon: FC<IconProps> = ({
  variant = 'l',
  role = 'presentation',
  focusable = false,
  icon,
}) => {
  const size = {
    xxs: 10,
    xs: 15,
    s: 20,
    m: 25,
    l: 30,
    xl: 35,
    xxl: 40,
    xxxl: 45,
  }[variant]

  return (
    <svg
      viewBox={icon.viewBox ?? '0 0 24 24'}
      color="inherit"
      display="inline-block"
      focusable={focusable}
      role={role}
      width={size}
      height={size}
    >
      {icon.path}
    </svg>
  )
}
