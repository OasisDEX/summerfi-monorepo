import classNames from './BeachClubProgressBar.module.css'

interface BeachClubProgressBarProps {
  max: number
  current: number
  wrapperStyle?: React.CSSProperties
}

export const BeachClubProgressBar = ({ max, current, wrapperStyle }: BeachClubProgressBarProps) => {
  return (
    <div className={classNames.progressBar} style={wrapperStyle}>
      <div className={classNames.progressBarFill} style={{ width: `${(current / max) * 100}%` }} />
    </div>
  )
}
