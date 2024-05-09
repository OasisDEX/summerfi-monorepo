import buttonExampleStyles from './ButtonExample.module.scss'
import classnames from 'classnames'

export const ButtonExample = ({ children, test }: { children: React.ReactNode; test: string }) => {
  return (
    <>
      <button
        className={classnames(buttonExampleStyles.buttonExampleStyle, buttonExampleStyles.test)}
      >
        {children}
        {test}
      </button>
    </>
  )
}
