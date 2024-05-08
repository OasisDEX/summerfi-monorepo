import buttonExampleStyles from './ButtonExample.module.scss'

export const ButtonExample = ({ children, test }: { children: React.ReactNode; test: string }) => {
  return (
    <button className={buttonExampleStyles.buttonExampleStyle}>
      {children}
      {test}
    </button>
  )
}
