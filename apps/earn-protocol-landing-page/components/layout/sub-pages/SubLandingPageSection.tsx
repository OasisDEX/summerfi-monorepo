import subLandingPageSectionStyles from './SubLandingPageSection.module.css'

export const SubLandingPageSection = ({
  children,
  style,
  className,
}: {
  children: React.ReactNode
  style?: React.CSSProperties
  className?: string
}) => {
  return (
    <div
      className={`${subLandingPageSectionStyles.subLandingPageSectionWrapper} ${className}`}
      style={style}
    >
      {children}
    </div>
  )
}
