import styles from './AvgResponse.module.css'

interface AvgResponseProps {
  isAI: boolean
  validResponses: number[]
  avgResponse: number
}

const AvgResponse: React.FC<AvgResponseProps> = ({ isAI, validResponses, avgResponse }) => (
  <div className={styles.avgResponse}>
    Avg. response:{' '}
    {isAI
      ? 'instant'
      : validResponses.length > 0
        ? avgResponse < 1
          ? `${Math.round(avgResponse * 1000)}ms`
          : `${avgResponse.toFixed(2)}s`
        : '--'}
  </div>
)

export default AvgResponse
