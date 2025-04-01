import {
  forwardRef,
  type ForwardRefExoticComponent,
  type HTMLAttributeAnchorTarget,
  type RefAttributes,
} from 'react'

import { basePath } from '@/helpers/base-path'

/**
 * A component that renders a proxy link - removes /rays from the href (WATCH OUT)
 * needs: `passHref` and `legacyBehavior` on Link to work (and probably `prefetch={false}`)
 * because we dont want to preload non-existing page
 *
 * ```tsx
 * <ProxyLinkComponent href="/example">Click me</ProxyLinkComponent>
 * ```
 * This link on Rays dashboard is gonna be `/rays/example`, this component fixes that
 */
export const ProxyLinkComponent: ForwardRefExoticComponent<
  {
    onClick?: (params: unknown) => void
    href?: string
    children: React.ReactNode
    style?: React.CSSProperties
    className?: string
    suppressHydrationWarning?: boolean
    target?: HTMLAttributeAnchorTarget
  } & RefAttributes<HTMLAnchorElement>
> = forwardRef(
  (
    {
      onClick: _onClick,
      href,
      children,
      style,
      className,
      suppressHydrationWarning,
      target,
    }: {
      onClick?: (params: unknown) => void
      href?: string
      children: React.ReactNode
      style?: React.CSSProperties
      className?: string
      suppressHydrationWarning?: boolean
      target?: HTMLAttributeAnchorTarget
    },
    ref: React.Ref<HTMLAnchorElement>,
  ) => {
    return (
      <a
        suppressHydrationWarning={suppressHydrationWarning}
        style={style}
        href={href?.startsWith(basePath) ? href.slice(5) : href}
        className={className}
        ref={ref}
        target={target}
      >
        {children}
      </a>
    )
  },
)
