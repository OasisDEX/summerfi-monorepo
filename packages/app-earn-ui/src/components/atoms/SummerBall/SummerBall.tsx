const Ellipse = ({ size, ...props }: { size: number } & React.SVGProps<SVGEllipseElement>) => {
  return <ellipse cx={size} cy={size} rx={size} ry={size} {...props} />
}

export const SummerBall = ({
  size = 100,
  randomSize,
  style,
  blurSize = 0,
}: {
  size?: number
  randomSize?: boolean
  style?: React.CSSProperties
  blurSize?: number
}) => {
  // randomId is needed because svg filters/gradients need unique ids
  // otherwise first one will be used for all :(
  const randomId = Math.random().toString(36).substring(7)
  const actualSize = size / 2 // size is the diameter, actualSize is the radius
  const randomRotationValue = Math.floor(Math.random() * 360)
  const randomRotation = `rotate(${randomRotationValue}, ${actualSize}, ${actualSize})`
  const computedSize = randomSize ? Math.floor(Math.random() * actualSize) + actualSize : actualSize
  const svgSize = Number(computedSize * 2)
  const randomSpinDuration = Math.floor(Math.random() * 20) + 10

  return (
    <svg
      width={svgSize}
      height={svgSize}
      viewBox={`0 0 ${svgSize} ${svgSize}`}
      xmlns="http://www.w3.org/"
      style={{
        ...style,
        filter: blurSize ? `blur(${blurSize}px)` : undefined,
      }}
    >
      <defs>
        <filter id={`summerNoiseFilter-${randomId}`} filterUnits="userSpaceOnUse">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.7"
            numOctaves="8"
            stitchTiles="stitch"
          />
        </filter>
        <linearGradient
          id={`summerGradient-${randomId}`}
          x1="0"
          y1="0"
          x2={computedSize * 1.5}
          y2={computedSize * 1.5}
          gradientUnits="userSpaceOnUse"
          gradientTransform={randomRotation}
        >
          <stop stopColor="#FE72D2" />
          <stop offset="1" stopColor="#FFE9B1" />
        </linearGradient>
        <mask id={`ellipseHole-${randomId}`}>
          <ellipse cx={computedSize} cy={computedSize} rx={computedSize} ry={computedSize} />
        </mask>
      </defs>
      <g>
        <g>
          <Ellipse size={computedSize} fill={`url(#summerGradient-${randomId})`} />
          <animateTransform
            attributeName="transform"
            attributeType="XML"
            type="rotate"
            from={`0 ${computedSize} ${computedSize}`}
            to={`360 ${computedSize} ${computedSize}`}
            dur={`${randomSpinDuration}s`}
            repeatCount="indefinite"
          />
        </g>
        <Ellipse
          size={computedSize}
          filter={`url(#summerNoiseFilter-${randomId})`}
          mask={`url(#ellipseHole-${randomId})`}
          style={{
            mixBlendMode: 'color-burn',
          }}
        />
        <Ellipse
          size={computedSize}
          filter={`url(#summerNoiseFilter-${randomId})`}
          mask={`url(#ellipseHole-${randomId})`}
          style={{
            opacity: 0.5,
            mixBlendMode: 'color-burn',
          }}
        />
      </g>
    </svg>
  )
}
