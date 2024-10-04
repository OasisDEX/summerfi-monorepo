import { StrategyGrid } from '@summerfi/app-earn-ui'

const EarnPage = () => {
  return (
    <StrategyGrid
      topContent={<p>Top Content</p>}
      leftContent={
        <div>
          <p>Left Content</p>
          <p>Left Content</p>
          <p>Left Content</p>
          <p>Left Content</p>
          <p>Left Content</p>
          <p>Left Content</p>
          <p>Left Content</p>
          <p>Left Content</p>
          <p>Left Content</p>
          <p>Left Content</p>
        </div>
      }
      rightContent={<p>Right Content</p>}
    />
  )
}

export default EarnPage
