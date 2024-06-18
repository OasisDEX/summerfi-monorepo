import { forwardRef } from 'react'

export const ProxyLinkComponent = forwardRef(
  (
    {
      onClick,
      href,
      children,
      style,
      className,
    }: {
      onClick?: () => void
      href?: string
      children: React.ReactNode
      style?: React.CSSProperties
      className?: string
    },
    ref: React.Ref<HTMLAnchorElement>,
  ) => {
    return (
      <a
        style={style}
        href={href?.startsWith('/rays') ? href.slice(5) : href}
        className={className}
        onClick={onClick}
        ref={ref}
      >
        {children}
      </a>
    )
  },
)
