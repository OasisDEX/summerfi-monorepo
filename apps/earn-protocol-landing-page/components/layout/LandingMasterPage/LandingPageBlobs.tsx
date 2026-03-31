import Image from 'next/image'

import landingPageGrid from '@/public/img/landing-page/grid.svg'

import landingPageBlobsStyles from '@/components/layout/LandingMasterPage/landingPageBlobs.module.css'

type BlobProps = {
  size: number
  blur: number
  position: {
    x: number
    y: number
  }
  background: string
}

const SMALL_BLOB_POSITIONS: React.CSSProperties[] = [
  { top: '5%', left: '1%' },
  { top: '16%', left: '40%' },
  { top: '17%', right: '18%' },
  { top: '41%', right: '32%' },
  { top: '80%', left: '12%' },
  { top: '96%', left: '43%' },
  { top: '91%', right: '1%' },
]

const LARGE_BLOB_POSITIONS: BlobProps[] = [
  {
    background: '#5B035D',
    position: {
      x: 65,
      y: 55,
    },
    size: 340,
    blur: 150,
  },
  {
    background:
      'radial-gradient(99% 99% at 3.96% 33.66%, #DB70A5 0%, #8D3360 44.23%, #5E1238 100%)',
    position: {
      x: 75,
      y: 50,
    },
    size: 400,
    blur: 30,
  },
  {
    background: '#5D1A03',
    position: {
      x: 80,
      y: 40,
    },
    size: 350,
    blur: 150,
  },
]

const LandingPageSmallBlobs = ({
  size = 6,
  glow = { size: 10, color: 'rgba(222, 32, 127, 0.35)' },
  backgroundColor = '#de207f',
}: {
  size?: number
  glow?: {
    size: number
    color: string
  }
  backgroundColor?: string
}) => {
  const driftClasses = [
    landingPageBlobsStyles.smallBlobDrift1,
    landingPageBlobsStyles.smallBlobDrift2,
    landingPageBlobsStyles.smallBlobDrift3,
    landingPageBlobsStyles.smallBlobDrift4,
  ]

  return (
    <>
      {SMALL_BLOB_POSITIONS.map((pos, i) => (
        <span
          key={i}
          className={driftClasses[i % driftClasses.length]}
          style={{
            position: 'absolute',
            ...pos,
            width: `${size}px`,
            height: `${size}px`,
          }}
        >
          <span
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              backgroundColor,
            }}
          />
          <span
            style={{
              position: 'absolute',
              inset: `-${glow.size}px`,
              borderRadius: '50%',
              backgroundColor: glow.color,
              filter: `blur(${glow.size}px)`,
            }}
          />
        </span>
      ))}
    </>
  )
}

const LandingPageLargeBlobs = () => {
  const driftClasses = [
    landingPageBlobsStyles.largeBlobDrift1,
    landingPageBlobsStyles.largeBlobDrift2,
    landingPageBlobsStyles.largeBlobDrift3,
  ]

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {LARGE_BLOB_POSITIONS.map((blob, index) => (
        <div
          key={index}
          className={driftClasses[index % driftClasses.length]}
          style={{
            position: 'absolute',
            width: `${blob.size}px`,
            height: `${blob.size}px`,
            top: `${blob.position.y}%`,
            left: `${blob.position.x}%`,
            borderRadius: '50%',
            background: blob.background,
            filter: `blur(${blob.blur}px)`,
          }}
        />
      ))}
    </div>
  )
}

export const LandingPageBlobs = ({ isMainPage }: { isMainPage: boolean }) => {
  return (
    <div className={landingPageBlobsStyles.blobsContainer}>
      <Image
        src={landingPageGrid}
        alt="landing_page_grid"
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          zIndex: -1,
          transform: 'scale(1.5)',
        }}
        priority
      />
      {isMainPage && <LandingPageLargeBlobs />}
      <LandingPageSmallBlobs />
      {!isMainPage && <div className={landingPageBlobsStyles.gradientBottom} />}
    </div>
  )
}
