import { SkeletonLine } from '@summerfi/app-ui'

export const BridgeSwapHandlerLoader = () => {
  return (
    <div
      style={{
        width: '320px',
        padding: '30px',
        marginTop: '30px',
      }}
    >
      <div
        style={{
          marginTop: '30px',
        }}
      >
        <SkeletonLine height="30px" />
      </div>
      <div
        style={{
          marginTop: '30px',
        }}
      >
        <SkeletonLine height="30px" />
      </div>
      <div
        style={{
          marginTop: '30px',
        }}
      >
        <SkeletonLine height="30px" />
      </div>
      <div
        style={{
          marginTop: '30px',
        }}
      >
        <SkeletonLine height="30px" />
      </div>
    </div>
  )
}
