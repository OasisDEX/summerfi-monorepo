import { forwardRef } from 'react'

/**
 * A component that renders a proxy link - removes /rays from the href (WATCH OUT)
 * needs: `passHref` and `legacyBehavior` on Link to work
 *
 * ```tsx
 * <ProxyLinkComponent href="/example">Click me</ProxyLinkComponent>
 * ```
 * This link on Rays dashboard is gonna be `/rays/example`, this component fixes that
 */
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