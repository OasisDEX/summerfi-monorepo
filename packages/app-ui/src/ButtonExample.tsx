import buttonExampleStyles from './ButtonExample.module.scss'
import classnames from 'classnames'

export const ButtonExample = ({ children, text }: { children: React.ReactNode; text?: string }) => {
  return (
    <>
      <button
        className={classnames(buttonExampleStyles.buttonExampleStyle, buttonExampleStyles.testets)}
      >
        {children}
        {text}
      </button>
    </>
  )
}
