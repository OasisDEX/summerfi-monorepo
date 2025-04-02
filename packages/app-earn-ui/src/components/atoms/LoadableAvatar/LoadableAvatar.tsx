import loadable, { type LoadableComponent } from '@loadable/component'
import { type AvatarProps } from 'boring-avatars'

export const LoadableAvatar: LoadableComponent<AvatarProps> = loadable(
  () => import('boring-avatars'),
  {
    fallback: (
      <svg viewBox="0 0 6.35 6.35" color="inherit" display="inline-block" width={24} height={24}>
        <circle
          style={{ fill: '#9d9d9d', fillOpacity: 0.350168, strokeWidth: 0.340624 }}
          cx="3.175"
          cy="3.175"
          r="3.175"
        />
      </svg>
    ),
  },
)
