import titleStyles from './TitleExample.module.scss'

export const TitleExample = ({ children }: { children: React.ReactNode }) => {
  return <h1 className={titleStyles.title}>Hello World! {children}</h1>
}
