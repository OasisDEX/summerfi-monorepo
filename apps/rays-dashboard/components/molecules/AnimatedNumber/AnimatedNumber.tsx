import NumberComponent, {
  AnimatedNumberProps as OriginalAnimatedNumberProps,
} from 'react-awesome-animated-number'

import 'react-awesome-animated-number/dist/index.css'

type AnimatedNumberProps = {
  number: number
  size?: number
  style?: React.CSSProperties
  className?: string
} & Omit<OriginalAnimatedNumberProps, 'value'>

export const AnimatedNumber = ({
  number,
  size = 20,
  style,
  className,
  duration,
  ...rest
}: AnimatedNumberProps) => {
  return (
    <NumberComponent
      {...rest}
      value={number}
      hasComma
      size={size}
      duration={duration ?? 500}
      style={style}
      className={className}
    />
  )
}
