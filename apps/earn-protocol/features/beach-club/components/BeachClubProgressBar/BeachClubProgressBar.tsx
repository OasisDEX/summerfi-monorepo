import classNames from './BeachClubProgressBar.module.css'

interface BeachClubProgressBarProps {
  max: number
  current: number
}

export const BeachClubProgressBar = ({ max, current }: BeachClubProgressBarProps) => {
  return (
    <div className={classNames.progressBar}>
      <div className={classNames.progressBarFill} style={{ width: `${(current / max) * 100}%` }} />
    </div>
  )
}
